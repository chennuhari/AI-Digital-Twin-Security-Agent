package com.digitaltwin.digital_twin_backend.graph;

import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;

@Node("Service")
public class GraphServiceNode {

    @Id
    private String id;

    private Integer portNumber;
    private String protocol;
    private String serviceName;
    private String state;

    public GraphServiceNode() {
    }

    public GraphServiceNode(
            String id,
            Integer portNumber,
            String protocol,
            String serviceName,
            String state) {

        this.id = id;
        this.portNumber = portNumber;
        this.protocol = protocol;
        this.serviceName = serviceName;
        this.state = state;
    }

    public String getId() {
        return id;
    }

    public Integer getPortNumber() {
        return portNumber;
    }

    public String getProtocol() {
        return protocol;
    }

    public String getServiceName() {
        return serviceName;
    }

    public String getState() {
        return state;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setPortNumber(Integer portNumber) {
        this.portNumber = portNumber;
    }

    public void setProtocol(String protocol) {
        this.protocol = protocol;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public void setState(String state) {
        this.state = state;
    }
}