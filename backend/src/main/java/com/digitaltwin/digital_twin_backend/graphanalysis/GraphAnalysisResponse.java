package com.digitaltwin.digital_twin_backend.graphanalysis;

public record GraphAnalysisResponse(
        Long assetId,
        int threatNodes,
        int riskNodes,
        int recommendationNodes,
        String message
) {
}