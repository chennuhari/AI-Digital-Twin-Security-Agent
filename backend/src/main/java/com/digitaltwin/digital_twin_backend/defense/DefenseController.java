package com.digitaltwin.digital_twin_backend.defense;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/defense")
public class DefenseController {

    private final DefenseService defenseService;

    public DefenseController(DefenseService defenseService) {
        this.defenseService = defenseService;
    }

    @GetMapping("/assets/{assetId}")
    public ResponseEntity<DefenseReport> recommendForAsset(
            @PathVariable Long assetId) {

        return ResponseEntity.ok(
                defenseService.recommendForAsset(assetId)
        );
    }
}