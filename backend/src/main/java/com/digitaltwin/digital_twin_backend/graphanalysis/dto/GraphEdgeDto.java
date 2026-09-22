package com.digitaltwin.digital_twin_backend.graphanalysis.dto;

public record GraphEdgeDto(
        String source,
        String target,
        String type
) {
}