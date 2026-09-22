package com.digitaltwin.digital_twin_backend.graph;

import org.springframework.data.neo4j.repository.Neo4jRepository;

public interface GraphAssetRepository
        extends Neo4jRepository<GraphAssetNode, Long> {
}