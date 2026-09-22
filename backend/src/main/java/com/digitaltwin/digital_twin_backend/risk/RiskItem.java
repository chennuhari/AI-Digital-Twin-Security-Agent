package com.digitaltwin.digital_twin_backend.risk;

public record RiskItem(
        Long assetId,
        Integer portNumber,
        String service,
        String category,
        String threatSeverity,
        int riskScore,
        String riskLevel,
        String rationale
) {
}