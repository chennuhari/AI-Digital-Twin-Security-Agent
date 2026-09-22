package com.digitaltwin.digital_twin_backend.graphanalysis.dto;

import java.util.List;

public record FullGraphResponse(
        Long assetId,
        List<GraphNodeDto> nodes,
        List<GraphEdgeDto> edges
) {
}