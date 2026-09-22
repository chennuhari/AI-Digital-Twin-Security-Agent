package com.digitaltwin.digital_twin_backend.collector.dto;

import java.util.List;

public record CollectorMachineReport(
        String hostname,
        String ipAddress,
        String operatingSystem,
        String macAddress,
        String status,
        List<CollectorPortReport> ports
) {
}