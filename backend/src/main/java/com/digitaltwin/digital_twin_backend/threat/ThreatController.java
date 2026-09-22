package com.digitaltwin.digital_twin_backend.threat;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/threat")
public class ThreatController {

    private final ThreatService threatService;

    public ThreatController(ThreatService threatService) {
        this.threatService = threatService;
    }

    @GetMapping("/assets/{assetId}")
    public ResponseEntity<List<ThreatFinding>> analyzeAsset(
            @PathVariable Long assetId) {

        return ResponseEntity.ok(
                threatService.analyzeAsset(assetId)
        );
    }
}