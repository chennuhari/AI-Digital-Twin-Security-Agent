package com.digitaltwin.digital_twin_backend.recon;

import com.digitaltwin.digital_twin_backend.entity.Asset;
import com.digitaltwin.digital_twin_backend.entity.Port;
import com.digitaltwin.digital_twin_backend.history.ScanHistoryService;
import com.digitaltwin.digital_twin_backend.service.AssetService;
import com.digitaltwin.digital_twin_backend.service.PortService;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

@Service
public class ReconService {
    private final AssetService assetService;
    private final PortService portService;
    private final ScanHistoryService scanHistoryService;

    public ReconService(AssetService assetService, PortService portService, ScanHistoryService scanHistoryService) {
        this.assetService = assetService;
        this.portService = portService;
        this.scanHistoryService = scanHistoryService;
    }

    public String testRecon() { return "Recon Agent is ready"; }

    public List<String> scan(String target) throws Exception {
        if (target == null || !(target.equals("127.0.0.1") || target.equalsIgnoreCase("localhost") || target.equals("::1"))) {
            throw new IllegalArgumentException("Only localhost scanning is allowed");
        }

        List<String> results = new ArrayList<>();
        ProcessBuilder processBuilder = new ProcessBuilder("nmap", "-sT", target);
        processBuilder.redirectErrorStream(true);
        Process process = processBuilder.start();
        BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
        String line;
        while ((line = reader.readLine()) != null) results.add(line);

        int exitCode = process.waitFor();
        if (exitCode != 0) throw new RuntimeException("Nmap scan failed");

        Asset asset = saveDiscoveredAsset(target, results);
        if (asset != null) {
            saveDiscoveredPorts(asset, results);
            scanHistoryService.recordScan(asset);
        }
        return results;
    }

    private Asset saveDiscoveredAsset(String target, List<String> results) {
        boolean hostIsUp = results.stream().anyMatch(line -> line.contains("Host is up"));
        if (!hostIsUp) return null;

        Asset asset = assetService.findByIpAddress(target).orElse(new Asset());
        asset.setIpAddress(target);
        asset.setHostname(extractHostname(results));
        asset.setStatus("UP");
        return assetService.saveAsset(asset);
    }

    private void saveDiscoveredPorts(Asset asset, List<String> results) {
        portService.deletePortsByAssetId(asset.getId());
        for (String line : results) {
            if (!line.contains("/tcp")) continue;
            String[] parts = line.trim().split("\\s+");
            if (parts.length < 3) continue;
            String[] portParts = parts[0].split("/");
            if (portParts.length != 2) continue;
            try {
                Integer portNumber = Integer.parseInt(portParts[0]);
                Port port = new Port();
                port.setPortNumber(portNumber);
                port.setProtocol(portParts[1]);
                port.setState(parts[1]);
                port.setService(parts[2]);
                port.setAsset(asset);
                portService.savePort(port);
            } catch (NumberFormatException ignored) {}
        }
    }

    private String extractHostname(List<String> results) {
        for (String line : results) {
            if (line.startsWith("Nmap scan report for")) {
                String hostname = line.substring("Nmap scan report for".length()).trim();
                if (hostname.contains(" (")) hostname = hostname.substring(0, hostname.indexOf(" ("));
                return hostname;
            }
        }
        return null;
    }
}