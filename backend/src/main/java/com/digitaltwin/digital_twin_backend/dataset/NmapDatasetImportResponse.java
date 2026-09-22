package com.digitaltwin.digital_twin_backend.dataset;

import java.util.List;

public record NmapDatasetImportResponse(
        int importedHostCount,
        List<NmapDatasetHostResult> hosts,
        String message
) {
}
