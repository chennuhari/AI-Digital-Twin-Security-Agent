package com.digitaltwin.digital_twin_backend.collector.dto;

public record CollectorIngestResponse(
        Long assetId,
        String hostname,
        String ipAddress,
        int portCount,
        String message
) {
}