package com.digitaltwin.digital_twin_backend.risk;

import java.util.List;

public record RiskAssessment(
        Long assetId,
        int overallScore,
        String overallRiskLevel,
        int totalFindings,
        List<RiskItem> findings
) {
}