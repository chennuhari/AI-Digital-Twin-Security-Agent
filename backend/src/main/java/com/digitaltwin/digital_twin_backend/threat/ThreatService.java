package com.digitaltwin.digital_twin_backend.threat;

import com.digitaltwin.digital_twin_backend.entity.Asset;
import com.digitaltwin.digital_twin_backend.entity.Port;
import com.digitaltwin.digital_twin_backend.service.AssetService;
import com.digitaltwin.digital_twin_backend.service.PortService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ThreatService {

    private final AssetService assetService;
    private final PortService portService;

    public ThreatService(
            AssetService assetService,
            PortService portService) {
        this.assetService = assetService;
        this.portService = portService;
    }

    public List<ThreatFinding> analyzeAsset(Long assetId) {

        Asset asset = assetService.getAssetById(assetId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Asset not found with id: " + assetId
                        )
                );

        List<Port> ports = portService.getPortsByAssetId(assetId);
        List<ThreatFinding> findings = new ArrayList<>();

        for (Port port : ports) {

            if (!"open".equalsIgnoreCase(port.getState())) {
                continue;
            }

            ThreatFinding finding = analyzePort(asset, port);

            if (finding != null) {
                findings.add(finding);
            }
        }

        return findings;
    }

    private ThreatFinding analyzePort(
            Asset asset,
            Port port) {

        int number = port.getPortNumber();
        String service = safe(port.getService()).toLowerCase();

        if (number == 23 || service.contains("telnet")) {
            return new ThreatFinding(
                    asset.getId(),
                    number,
                    port.getService(),
                    "INSECURE_LEGACY_SERVICE",
                    "HIGH",
                    "Telnet is an unencrypted legacy service. Review whether it is required and prefer encrypted remote access."
            );
        }

        if (number == 21 || service.contains("ftp")) {
            return new ThreatFinding(
                    asset.getId(),
                    number,
                    port.getService(),
                    "LEGACY_FILE_TRANSFER",
                    "MEDIUM",
                    "FTP may transmit credentials or data without strong protection. Review whether a secure alternative is available."
            );
        }

        if (number == 445 || service.contains("microsoft-ds")) {
            return new ThreatFinding(
                    asset.getId(),
                    number,
                    port.getService(),
                    "FILE_SHARING_SERVICE",
                    "MEDIUM",
                    "Windows file-sharing service is exposed on this asset. Keep access restricted to trusted systems and disable it if unused."
            );
        }

        if (number == 3306 || service.contains("mysql")) {
            return new ThreatFinding(
                    asset.getId(),
                    number,
                    port.getService(),
                    "DATABASE_SERVICE",
                    "MEDIUM",
                    "MySQL service is listening on this asset. Restrict database access to trusted applications and local or approved hosts."
            );
        }

        if (number == 5432 || service.contains("postgresql")) {
            return new ThreatFinding(
                    asset.getId(),
                    number,
                    port.getService(),
                    "DATABASE_SERVICE",
                    "MEDIUM",
                    "PostgreSQL service is listening on this asset. Limit access to trusted applications and review authentication settings."
            );
        }

        if (number == 80 || number == 8080 || service.contains("http")) {
            return new ThreatFinding(
                    asset.getId(),
                    number,
                    port.getService(),
                    "WEB_SERVICE",
                    "LOW",
                    "A web service is available on this asset. Keep the application updated and review whether authentication and TLS are required."
            );
        }

        if ("unknown".equals(service)) {
            return new ThreatFinding(
                    asset.getId(),
                    number,
                    port.getService(),
                    "UNKNOWN_SERVICE",
                    "LOW",
                    "An open port is using an unidentified service. Verify the owning application and whether the service is required."
            );
        }

        return null;
    }

    private String safe(String value) {
        return value == null ? "" : value;
    }
}