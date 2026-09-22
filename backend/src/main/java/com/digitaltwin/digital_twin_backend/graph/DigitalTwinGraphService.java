package com.digitaltwin.digital_twin_backend.graph;

import com.digitaltwin.digital_twin_backend.entity.Asset;
import com.digitaltwin.digital_twin_backend.entity.Port;
import com.digitaltwin.digital_twin_backend.service.AssetService;
import com.digitaltwin.digital_twin_backend.service.PortService;
import org.springframework.data.neo4j.core.Neo4jClient;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DigitalTwinGraphService {

    private final AssetService assetService;
    private final PortService portService;
    private final Neo4jClient neo4jClient;

    public DigitalTwinGraphService(
            AssetService assetService,
            PortService portService,
            Neo4jClient neo4jClient) {

        this.assetService = assetService;
        this.portService = portService;
        this.neo4jClient = neo4jClient;
    }

    public GraphSyncResponse syncAsset(Long assetId) {

        Asset asset = assetService.getAssetById(assetId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Asset not found with id: " + assetId
                        )
                );

        List<Port> ports =
                portService.getPortsByAssetId(assetId);

        Map<String, Object> assetParams = new HashMap<>();
        assetParams.put("assetId", asset.getId());
        assetParams.put("ipAddress", safe(asset.getIpAddress()));
        assetParams.put("hostname", safe(asset.getHostname()));
        assetParams.put("operatingSystem", safe(asset.getOperatingSystem()));
        assetParams.put("macAddress", safe(asset.getMacAddress()));
        assetParams.put("status", safe(asset.getStatus()));

        neo4jClient.query("""
                MERGE (a:Asset {sourceAssetId: $assetId})
                SET a.ipAddress = $ipAddress,
                    a.hostname = $hostname,
                    a.operatingSystem = $operatingSystem,
                    a.macAddress = $macAddress,
                    a.status = $status
                """)
                .bindAll(assetParams)
                .run();

        neo4jClient.query("""
                MATCH (a:Asset {sourceAssetId: $assetId})
                OPTIONAL MATCH (a)-[r:HAS_SERVICE]->(s:Service)
                DELETE r
                WITH collect(s) AS oldServices
                UNWIND oldServices AS oldService
                WITH oldService
                WHERE oldService IS NOT NULL
                  AND NOT (oldService)<-[:HAS_SERVICE]-()
                DETACH DELETE oldService
                """)
                .bind(assetId)
                .to("assetId")
                .run();

        for (Port port : ports) {

            Map<String, Object> params = new HashMap<>();
            params.put("assetId", assetId);
            params.put("serviceId", buildServiceId(assetId, port));
            params.put("portNumber", port.getPortNumber());
            params.put("protocol", safe(port.getProtocol()));
            params.put("serviceName", safe(port.getService()));
            params.put("state", safe(port.getState()));

            neo4jClient.query("""
                    MATCH (a:Asset {sourceAssetId: $assetId})
                    MERGE (s:Service {id: $serviceId})
                    SET s.portNumber = $portNumber,
                        s.protocol = $protocol,
                        s.serviceName = $serviceName,
                        s.state = $state
                    MERGE (a)-[:HAS_SERVICE]->(s)
                    """)
                    .bindAll(params)
                    .run();
        }

        return new GraphSyncResponse(
                asset.getId(),
                asset.getHostname(),
                asset.getIpAddress(),
                ports.size(),
                "Digital Twin graph synchronized with Neo4j"
        );
    }

    public GraphAssetNode getGraphAsset(Long assetId) {

        Map<String, Object> assetRow =
                neo4jClient.query("""
                        MATCH (a:Asset {sourceAssetId: $assetId})
                        RETURN a.sourceAssetId AS sourceAssetId,
                               a.ipAddress AS ipAddress,
                               a.hostname AS hostname,
                               a.operatingSystem AS operatingSystem,
                               a.macAddress AS macAddress,
                               a.status AS status
                        """)
                        .bind(assetId)
                        .to("assetId")
                        .fetch()
                        .one()
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Graph asset not found with id: " + assetId
                                )
                        );

        GraphAssetNode graphAsset = new GraphAssetNode(
                ((Number) assetRow.get("sourceAssetId")).longValue(),
                stringValue(assetRow.get("ipAddress")),
                stringValue(assetRow.get("hostname")),
                stringValue(assetRow.get("operatingSystem")),
                stringValue(assetRow.get("macAddress")),
                stringValue(assetRow.get("status"))
        );

        List<GraphServiceNode> services = new ArrayList<>();

        neo4jClient.query("""
                MATCH (a:Asset {sourceAssetId: $assetId})
                      -[:HAS_SERVICE]->(s:Service)
                RETURN s.id AS id,
                       s.portNumber AS portNumber,
                       s.protocol AS protocol,
                       s.serviceName AS serviceName,
                       s.state AS state
                ORDER BY s.portNumber
                """)
                .bind(assetId)
                .to("assetId")
                .fetch()
                .all()
                .forEach(row ->
                        services.add(
                                new GraphServiceNode(
                                        stringValue(row.get("id")),
                                        row.get("portNumber") == null
                                                ? null
                                                : ((Number) row.get("portNumber")).intValue(),
                                        stringValue(row.get("protocol")),
                                        stringValue(row.get("serviceName")),
                                        stringValue(row.get("state"))
                                )
                        )
                );

        graphAsset.setServices(services);

        return graphAsset;
    }

    private String buildServiceId(
            Long assetId,
            Port port) {

        return "asset-"
                + assetId
                + "-port-"
                + port.getPortNumber()
                + "-"
                + safe(port.getProtocol());
    }

    private String safe(String value) {
        return value == null ? "" : value;
    }

    private String stringValue(Object value) {
        return value == null ? "" : value.toString();
    }
}