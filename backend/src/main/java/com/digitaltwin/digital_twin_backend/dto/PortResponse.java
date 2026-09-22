package com.digitaltwin.digital_twin_backend.dto;

public record PortResponse(
        Long id,
        Integer portNumber,
        String protocol,
        String service,
        String state
) {
}