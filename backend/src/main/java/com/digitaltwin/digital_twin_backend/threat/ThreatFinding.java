package com.digitaltwin.digital_twin_backend.threat;

public record ThreatFinding(
        Long assetId,
        Integer portNumber,
        String service,
        String category,
        String severity,
        String description
) {
}