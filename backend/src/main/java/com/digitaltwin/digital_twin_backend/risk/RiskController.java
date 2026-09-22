package com.digitaltwin.digital_twin_backend.risk;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/risk")
public class RiskController {

    private final RiskService riskService;

    public RiskController(RiskService riskService) {
        this.riskService = riskService;
    }

    @GetMapping("/assets/{assetId}")
    public ResponseEntity<RiskAssessment> assessAsset(
            @PathVariable Long assetId) {

        return ResponseEntity.ok(
                riskService.assessAsset(assetId)
        );
    }
}