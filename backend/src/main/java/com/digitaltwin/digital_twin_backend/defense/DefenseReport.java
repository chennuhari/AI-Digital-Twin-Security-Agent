package com.digitaltwin.digital_twin_backend.defense;

import java.util.List;

public record DefenseReport(
        Long assetId,
        String overallRiskLevel,
        int overallScore,
        int recommendationCount,
        List<DefenseRecommendation> recommendations
) {
}