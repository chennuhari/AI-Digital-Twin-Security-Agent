package com.digitaltwin.digital_twin_backend.defense;

public record DefenseRecommendation(
        Long assetId,
        Integer portNumber,
        String service,
        String category,
        String priority,
        String recommendation
) {
}