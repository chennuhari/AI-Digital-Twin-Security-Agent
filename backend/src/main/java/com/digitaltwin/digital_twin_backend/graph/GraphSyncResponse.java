package com.digitaltwin.digital_twin_backend.graph;

public record GraphSyncResponse(
        Long assetId,
        String hostname,
        String ipAddress,
        int serviceCount,
        String message
) {
}