package com.digitaltwin.digital_twin_backend.collector.dto;

public record CollectorPortReport(
        Integer portNumber,
        String protocol,
        String service,
        String state
) {
}