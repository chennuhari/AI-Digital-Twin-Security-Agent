package com.digitaltwin.digital_twin_backend.graphanalysis;

import com.digitaltwin.digital_twin_backend.graphanalysis.dto.EnvironmentGraphResponse;
import com.digitaltwin.digital_twin_backend.graphanalysis.dto.FullGraphResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/graph-analysis")
public class DigitalTwinAnalysisGraphController {

    private final DigitalTwinAnalysisGraphService service;

    public DigitalTwinAnalysisGraphController(
            DigitalTwinAnalysisGraphService service) {

        this.service = service;
    }

    // Synchronize threat, risk and defense analysis for one asset
    @PostMapping("/assets/{assetId}/sync")
    public ResponseEntity<GraphAnalysisResponse> sync(
            @PathVariable Long assetId) {

        return ResponseEntity.ok(
                service.syncAnalysis(assetId)
        );
    }

    // Get complete graph for one asset
    @GetMapping("/assets/{assetId}/full")
    public ResponseEntity<FullGraphResponse> fullGraph(
            @PathVariable Long assetId) {

        return ResponseEntity.ok(
                service.getFullGraph(assetId)
        );
    }

    // Get complete Digital Twin environment containing all assets
    @GetMapping("/environment/full")
    public ResponseEntity<EnvironmentGraphResponse> environmentGraph() {

        return ResponseEntity.ok(
                service.getEnvironmentGraph()
        );
    }
} 