package com.digitaltwin.digital_twin_backend.graphanalysis.dto;

import java.util.List;

public record EnvironmentGraphResponse(
        int assetCount,
        List<FullGraphResponse> assets
) {
}