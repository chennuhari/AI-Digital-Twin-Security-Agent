package com.digitaltwin.digital_twin_backend.graph;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/graph")
public class DigitalTwinGraphController {

    private final DigitalTwinGraphService graphService;

    public DigitalTwinGraphController(
            DigitalTwinGraphService graphService) {

        this.graphService = graphService;
    }

    @PostMapping("/assets/{assetId}/sync")
    public ResponseEntity<GraphSyncResponse> syncAsset(
            @PathVariable Long assetId) {

        return ResponseEntity.ok(
                graphService.syncAsset(assetId)
        );
    }

    @GetMapping("/assets/{assetId}")
    public ResponseEntity<GraphAssetNode> getGraphAsset(
            @PathVariable Long assetId) {

        return ResponseEntity.ok(
                graphService.getGraphAsset(assetId)
        );
    }
}