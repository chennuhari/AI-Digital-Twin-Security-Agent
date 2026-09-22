package com.digitaltwin.digital_twin_backend.graphanalysis.dto;

public record GraphNodeDto(
        String id,
        String type,
        String label,
        String sublabel,
        String severity
) {
}