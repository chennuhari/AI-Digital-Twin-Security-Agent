package com.digitaltwin.digital_twin_backend.graphanalysis;

import com.digitaltwin.digital_twin_backend.graphanalysis.dto.EnvironmentGraphResponse;
import com.digitaltwin.digital_twin_backend.defense.DefenseRecommendation;
import com.digitaltwin.digital_twin_backend.defense.DefenseReport;
import com.digitaltwin.digital_twin_backend.defense.DefenseService;
import com.digitaltwin.digital_twin_backend.graphanalysis.dto.FullGraphResponse;
import com.digitaltwin.digital_twin_backend.graphanalysis.dto.GraphEdgeDto;
import com.digitaltwin.digital_twin_backend.graphanalysis.dto.GraphNodeDto;
import com.digitaltwin.digital_twin_backend.risk.RiskAssessment;
import com.digitaltwin.digital_twin_backend.risk.RiskItem;
import com.digitaltwin.digital_twin_backend.risk.RiskService;
import com.digitaltwin.digital_twin_backend.threat.ThreatFinding;
import com.digitaltwin.digital_twin_backend.threat.ThreatService;
import org.springframework.data.neo4j.core.Neo4jClient;
import org.springframework.stereotype.Service;
import java.util.Collection;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DigitalTwinAnalysisGraphService {

    private final ThreatService threatService;
    private final RiskService riskService;
    private final DefenseService defenseService;
    private final Neo4jClient neo4jClient;

    public DigitalTwinAnalysisGraphService(
            ThreatService threatService,
            RiskService riskService,
            DefenseService defenseService,
            Neo4jClient neo4jClient) {

        this.threatService = threatService;
        this.riskService = riskService;
        this.defenseService = defenseService;
        this.neo4jClient = neo4jClient;
    }

    public GraphAnalysisResponse syncAnalysis(Long assetId) {

        List<ThreatFinding> threats =
                threatService.analyzeAsset(assetId);

        RiskAssessment riskAssessment =
                riskService.assessAsset(assetId);

        DefenseReport defenseReport =
                defenseService.recommendForAsset(assetId);

        clearExistingAnalysis(assetId);

        for (ThreatFinding threat : threats) {
            createThreat(assetId, threat);
        }

        for (RiskItem risk : riskAssessment.findings()) {
            createRisk(assetId, risk);
        }

        for (DefenseRecommendation recommendation : defenseReport.recommendations()) {
            createRecommendation(assetId, recommendation);
        }

        return new GraphAnalysisResponse(
                assetId,
                threats.size(),
                riskAssessment.findings().size(),
                defenseReport.recommendations().size(),
                "Threat, risk, and defense relationships synchronized with Neo4j"
        );
    }

    public FullGraphResponse getFullGraph(Long assetId) {

        List<GraphNodeDto> nodes = new ArrayList<>();
        List<GraphEdgeDto> edges = new ArrayList<>();

        Map<String, Object> assetRow =
                neo4jClient.query("""
                        MATCH (a:Asset {sourceAssetId: $assetId})
                        RETURN a.sourceAssetId AS sourceAssetId,
                               a.hostname AS hostname,
                               a.ipAddress AS ipAddress
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

        String assetNodeId = "asset-" + assetId;

        nodes.add(
                new GraphNodeDto(
                        assetNodeId,
                        "ASSET",
                        stringValue(assetRow.get("hostname"), "localhost"),
                        stringValue(assetRow.get("ipAddress"), ""),
                        ""
                )
        );

        Collection<Map<String, Object>> rows =
        neo4jClient.query("""
                MATCH (a:Asset {sourceAssetId: $assetId})-[:HAS_SERVICE]->(s:Service)
                OPTIONAL MATCH (s)-[:HAS_THREAT]->(t:Threat)
                OPTIONAL MATCH (t)-[:ASSESSED_AS]->(r:Risk)
                OPTIONAL MATCH (r)-[:MITIGATED_BY]->(d:Recommendation)
                RETURN s.id AS serviceId,
                       s.portNumber AS portNumber,
                       s.serviceName AS serviceName,
                       t.id AS threatId,
                       t.category AS threatCategory,
                       t.severity AS threatSeverity,
                       r.id AS riskId,
                       r.riskScore AS riskScore,
                       r.riskLevel AS riskLevel,
                       d.id AS recommendationId,
                       d.priority AS recommendationPriority,
                       d.recommendation AS recommendationText
                ORDER BY s.portNumber
                """)
                .bind(assetId)
                .to("assetId")
                .fetch()
                .all();

        for (Map<String, Object> row : rows) {

            String serviceId = stringValue(row.get("serviceId"), "");
            String serviceNodeId = "service-" + serviceId;

            addNodeIfMissing(
                    nodes,
                    new GraphNodeDto(
                            serviceNodeId,
                            "SERVICE",
                            stringValue(row.get("portNumber"), ""),
                            stringValue(row.get("serviceName"), "unknown"),
                            ""
                    )
            );

            addEdgeIfMissing(
                    edges,
                    new GraphEdgeDto(
                            assetNodeId,
                            serviceNodeId,
                            "HAS_SERVICE"
                    )
            );

            String threatId = stringValue(row.get("threatId"), "");

            if (!threatId.isBlank()) {

                String threatNodeId = "threat-" + threatId;

                addNodeIfMissing(
                        nodes,
                        new GraphNodeDto(
                                threatNodeId,
                                "THREAT",
                                stringValue(row.get("threatCategory"), "Threat"),
                                "Threat finding",
                                stringValue(row.get("threatSeverity"), "")
                        )
                );

                addEdgeIfMissing(
                        edges,
                        new GraphEdgeDto(
                                serviceNodeId,
                                threatNodeId,
                                "HAS_THREAT"
                        )
                );

                String riskId = stringValue(row.get("riskId"), "");

                if (!riskId.isBlank()) {

                    String riskNodeId = "risk-" + riskId;

                    addNodeIfMissing(
                            nodes,
                            new GraphNodeDto(
                                    riskNodeId,
                                    "RISK",
                                    "Risk " + stringValue(row.get("riskScore"), "0"),
                                    stringValue(row.get("riskLevel"), ""),
                                    stringValue(row.get("riskLevel"), "")
                            )
                    );

                    addEdgeIfMissing(
                            edges,
                            new GraphEdgeDto(
                                    threatNodeId,
                                    riskNodeId,
                                    "ASSESSED_AS"
                            )
                    );

                    String recommendationId =
                            stringValue(row.get("recommendationId"), "");

                    if (!recommendationId.isBlank()) {

                        String recommendationNodeId =
                                "recommendation-" + recommendationId;

                        addNodeIfMissing(
                                nodes,
                                new GraphNodeDto(
                                        recommendationNodeId,
                                        "RECOMMENDATION",
                                        "Defense",
                                        stringValue(
                                                row.get("recommendationPriority"),
                                                ""
                                        ),
                                        ""
                                )
                        );

                        addEdgeIfMissing(
                                edges,
                                new GraphEdgeDto(
                                        riskNodeId,
                                        recommendationNodeId,
                                        "MITIGATED_BY"
                                )
                        );
                    }
                }
            }
        }

        return new FullGraphResponse(
                assetId,
                nodes,
                edges
        );
    }


    public EnvironmentGraphResponse getEnvironmentGraph() {

        Collection<Map<String, Object>> assetRows =
                neo4jClient.query("""
                        MATCH (a:Asset)
                        WHERE a.sourceAssetId IS NOT NULL
                        RETURN DISTINCT a.sourceAssetId AS assetId
                        ORDER BY assetId
                        """)
                        .fetch()
                        .all();

        List<FullGraphResponse> assetGraphs = new ArrayList<>();

        for (Map<String, Object> row : assetRows) {
            Object value = row.get("assetId");

            if (value == null) {
                continue;
            }

            Long assetId;

            if (value instanceof Number number) {
                assetId = number.longValue();
            } else {
                assetId = Long.valueOf(value.toString());
            }

            assetGraphs.add(getFullGraph(assetId));
        }

        return new EnvironmentGraphResponse(
                assetGraphs.size(),
                assetGraphs
        );
    }

    private void clearExistingAnalysis(Long assetId) {

        neo4jClient.query("""
                MATCH (a:Asset {sourceAssetId: $assetId})-[:HAS_SERVICE]->(s:Service)
                OPTIONAL MATCH (s)-[:HAS_THREAT]->(t:Threat)
                OPTIONAL MATCH (t)-[:ASSESSED_AS]->(r:Risk)
                OPTIONAL MATCH (r)-[:MITIGATED_BY]->(d:Recommendation)
                DETACH DELETE d, r, t
                """)
                .bind(assetId)
                .to("assetId")
                .run();
    }

    private void createThreat(
            Long assetId,
            ThreatFinding threat) {

        Map<String, Object> params = new HashMap<>();
        params.put("assetId", assetId);
        params.put("portNumber", threat.portNumber());
        params.put(
                "threatId",
                threatId(
                        assetId,
                        threat.portNumber(),
                        threat.category()
                )
        );
        params.put("category", safe(threat.category()));
        params.put("severity", safe(threat.severity()));
        params.put("description", safe(threat.description()));

        neo4jClient.query("""
                MATCH (a:Asset {sourceAssetId: $assetId})-[:HAS_SERVICE]->(s:Service)
                WHERE s.portNumber = $portNumber
                MERGE (t:Threat {id: $threatId})
                SET t.category = $category,
                    t.severity = $severity,
                    t.description = $description
                MERGE (s)-[:HAS_THREAT]->(t)
                """)
                .bindAll(params)
                .run();
    }

    private void createRisk(
            Long assetId,
            RiskItem risk) {

        Map<String, Object> params = new HashMap<>();
        params.put("assetId", assetId);
        params.put("portNumber", risk.portNumber());
        params.put("category", safe(risk.category()));
        params.put(
                "riskId",
                riskId(
                        assetId,
                        risk.portNumber(),
                        risk.category()
                )
        );
        params.put("riskScore", risk.riskScore());
        params.put("riskLevel", safe(risk.riskLevel()));
        params.put("rationale", safe(risk.rationale()));

        neo4jClient.query("""
                MATCH (a:Asset {sourceAssetId: $assetId})-[:HAS_SERVICE]->(s:Service)
                      -[:HAS_THREAT]->(t:Threat)
                WHERE s.portNumber = $portNumber
                  AND t.category = $category
                MERGE (r:Risk {id: $riskId})
                SET r.riskScore = $riskScore,
                    r.riskLevel = $riskLevel,
                    r.rationale = $rationale
                MERGE (t)-[:ASSESSED_AS]->(r)
                """)
                .bindAll(params)
                .run();
    }

    private void createRecommendation(
            Long assetId,
            DefenseRecommendation recommendation) {

        Map<String, Object> params = new HashMap<>();
        params.put("assetId", assetId);
        params.put("portNumber", recommendation.portNumber());
        params.put("category", safe(recommendation.category()));
        params.put(
                "recommendationId",
                recommendationId(
                        assetId,
                        recommendation.portNumber(),
                        recommendation.category()
                )
        );
        params.put("priority", safe(recommendation.priority()));
        params.put(
                "recommendation",
                safe(recommendation.recommendation())
        );

        neo4jClient.query("""
                MATCH (a:Asset {sourceAssetId: $assetId})-[:HAS_SERVICE]->(s:Service)
                      -[:HAS_THREAT]->(t:Threat)-[:ASSESSED_AS]->(r:Risk)
                WHERE s.portNumber = $portNumber
                  AND t.category = $category
                MERGE (d:Recommendation {id: $recommendationId})
                SET d.priority = $priority,
                    d.recommendation = $recommendation
                MERGE (r)-[:MITIGATED_BY]->(d)
                """)
                .bindAll(params)
                .run();
    }

    private void addNodeIfMissing(
            List<GraphNodeDto> nodes,
            GraphNodeDto candidate) {

        boolean exists =
                nodes.stream()
                        .anyMatch(node ->
                                node.id().equals(candidate.id())
                        );

        if (!exists) {
            nodes.add(candidate);
        }
    }

    private void addEdgeIfMissing(
            List<GraphEdgeDto> edges,
            GraphEdgeDto candidate) {

        boolean exists =
                edges.stream()
                        .anyMatch(edge ->
                                edge.source().equals(candidate.source())
                                        && edge.target().equals(candidate.target())
                                        && edge.type().equals(candidate.type())
                        );

        if (!exists) {
            edges.add(candidate);
        }
    }

    private String threatId(
            Long assetId,
            Integer portNumber,
            String category) {

        return "asset-"
                + assetId
                + "-port-"
                + portNumber
                + "-threat-"
                + normalize(category);
    }

    private String riskId(
            Long assetId,
            Integer portNumber,
            String category) {

        return "asset-"
                + assetId
                + "-port-"
                + portNumber
                + "-risk-"
                + normalize(category);
    }

    private String recommendationId(
            Long assetId,
            Integer portNumber,
            String category) {

        return "asset-"
                + assetId
                + "-port-"
                + portNumber
                + "-recommendation-"
                + normalize(category);
    }

    private String normalize(String value) {
        return safe(value)
                .toLowerCase()
                .replaceAll("[^a-z0-9]+", "-");
    }

    private String safe(String value) {
        return value == null ? "" : value;
    }

    private String stringValue(
            Object value,
            String fallback) {

        if (value == null) {
            return fallback;
        }

        String result = value.toString();

        return result.isBlank()
                ? fallback
                : result;
    }
}