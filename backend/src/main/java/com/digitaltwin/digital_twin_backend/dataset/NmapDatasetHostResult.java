package com.digitaltwin.digital_twin_backend.dataset;

public record NmapDatasetHostResult(
        Long assetId,
        String hostname,
        String ipAddress,
        String operatingSystem,
        int openPortCount
) {
}
