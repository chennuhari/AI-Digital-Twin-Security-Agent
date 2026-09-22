package com.digitaltwin.digital_twin_backend.graph;

import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;

import java.util.ArrayList;
import java.util.List;

@Node("Asset")
public class GraphAssetNode {

    @Id
    private Long sourceAssetId;

    private String ipAddress;
    private String hostname;
    private String operatingSystem;
    private String macAddress;
    private String status;

    @Relationship(type = "HAS_SERVICE", direction = Relationship.Direction.OUTGOING)
    private List<GraphServiceNode> services = new ArrayList<>();

    public GraphAssetNode() {
    }

    public GraphAssetNode(
            Long sourceAssetId,
            String ipAddress,
            String hostname,
            String operatingSystem,
            String macAddress,
            String status) {

        this.sourceAssetId = sourceAssetId;
        this.ipAddress = ipAddress;
        this.hostname = hostname;
        this.operatingSystem = operatingSystem;
        this.macAddress = macAddress;
        this.status = status;
    }

    public Long getSourceAssetId() {
        return sourceAssetId;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public String getHostname() {
        return hostname;
    }

    public String getOperatingSystem() {
        return operatingSystem;
    }

    public String getMacAddress() {
        return macAddress;
    }

    public String getStatus() {
        return status;
    }

    public List<GraphServiceNode> getServices() {
        return services;
    }

    public void setSourceAssetId(Long sourceAssetId) {
        this.sourceAssetId = sourceAssetId;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public void setHostname(String hostname) {
        this.hostname = hostname;
    }

    public void setOperatingSystem(String operatingSystem) {
        this.operatingSystem = operatingSystem;
    }

    public void setMacAddress(String macAddress) {
        this.macAddress = macAddress;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setServices(List<GraphServiceNode> services) {
        this.services = services;
    }
}