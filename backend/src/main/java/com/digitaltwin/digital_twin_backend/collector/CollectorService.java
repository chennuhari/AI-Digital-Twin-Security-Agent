package com.digitaltwin.digital_twin_backend.collector;

import com.digitaltwin.digital_twin_backend.collector.dto.CollectorIngestResponse;
import com.digitaltwin.digital_twin_backend.collector.dto.CollectorMachineReport;
import com.digitaltwin.digital_twin_backend.collector.dto.CollectorPortReport;
import com.digitaltwin.digital_twin_backend.entity.Asset;
import com.digitaltwin.digital_twin_backend.entity.Port;
import com.digitaltwin.digital_twin_backend.graph.DigitalTwinGraphService;
import com.digitaltwin.digital_twin_backend.graphanalysis.DigitalTwinAnalysisGraphService;
import com.digitaltwin.digital_twin_backend.history.ScanHistoryService;
import com.digitaltwin.digital_twin_backend.service.AssetService;
import com.digitaltwin.digital_twin_backend.service.PortService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CollectorService {

    private final AssetService assetService;
    private final PortService portService;
    private final ScanHistoryService scanHistoryService;
    private final DigitalTwinGraphService digitalTwinGraphService;
    private final DigitalTwinAnalysisGraphService analysisGraphService;

    public CollectorService(
            AssetService assetService,
            PortService portService,
            ScanHistoryService scanHistoryService,
            DigitalTwinGraphService digitalTwinGraphService,
            DigitalTwinAnalysisGraphService analysisGraphService) {

        this.assetService = assetService;
        this.portService = portService;
        this.scanHistoryService = scanHistoryService;
        this.digitalTwinGraphService = digitalTwinGraphService;
        this.analysisGraphService = analysisGraphService;
    }

    public CollectorIngestResponse ingest(
            CollectorMachineReport report) {

        validate(report);

        Asset asset = assetService
                .findByIpAddress(report.ipAddress())
                .orElse(new Asset());

        asset.setHostname(clean(report.hostname()));
        asset.setIpAddress(clean(report.ipAddress()));
        asset.setOperatingSystem(clean(report.operatingSystem()));
        asset.setMacAddress(clean(report.macAddress()));

        asset.setStatus(
                report.status() == null || report.status().isBlank()
                        ? "UP"
                        : clean(report.status()).toUpperCase()
        );

        Asset savedAsset =
                assetService.saveAsset(asset);

        portService.deletePortsByAssetId(
                savedAsset.getId()
        );

        List<CollectorPortReport> reportedPorts =
                report.ports() == null
                        ? List.of()
                        : report.ports();

        for (CollectorPortReport reportedPort : reportedPorts) {

            if (reportedPort == null
                    || reportedPort.portNumber() == null
                    || reportedPort.portNumber() < 1
                    || reportedPort.portNumber() > 65535) {
                continue;
            }

            Port port = new Port();

            port.setPortNumber(
                    reportedPort.portNumber()
            );

            port.setProtocol(
                    cleanOrDefault(
                            reportedPort.protocol(),
                            "tcp"
                    )
            );

            port.setService(
                    cleanOrDefault(
                            reportedPort.service(),
                            "unknown"
                    )
            );

            port.setState(
                    cleanOrDefault(
                            reportedPort.state(),
                            "open"
                    )
            );

            port.setAsset(savedAsset);

            portService.savePort(port);
        }

        scanHistoryService.recordScan(savedAsset);

        digitalTwinGraphService.syncAsset(
                savedAsset.getId()
        );

        analysisGraphService.syncAnalysis(
                savedAsset.getId()
        );

        return new CollectorIngestResponse(
                savedAsset.getId(),
                savedAsset.getHostname(),
                savedAsset.getIpAddress(),
                reportedPorts.size(),
                "Authorized machine inventory stored and Digital Twin synchronized"
        );
    }

    private void validate(
            CollectorMachineReport report) {

        if (report == null) {
            throw new IllegalArgumentException(
                    "Machine report is required"
            );
        }

        if (report.ipAddress() == null
                || report.ipAddress().isBlank()) {

            throw new IllegalArgumentException(
                    "ipAddress is required"
            );
        }
    }

    private String clean(String value) {
        return value == null
                ? null
                : value.trim();
    }

    private String cleanOrDefault(
            String value,
            String fallback) {

        if (value == null || value.isBlank()) {
            return fallback;
        }

        return value.trim();
    }
}