package com.digitaltwin.digital_twin_backend.history;

import com.digitaltwin.digital_twin_backend.defense.DefenseReport;
import com.digitaltwin.digital_twin_backend.defense.DefenseService;
import com.digitaltwin.digital_twin_backend.entity.Asset;
import com.digitaltwin.digital_twin_backend.risk.RiskAssessment;
import com.digitaltwin.digital_twin_backend.risk.RiskService;
import com.digitaltwin.digital_twin_backend.service.PortService;
import com.digitaltwin.digital_twin_backend.threat.ThreatService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ScanHistoryService {
    private final ScanHistoryRepository repository;
    private final PortService portService;
    private final ThreatService threatService;
    private final RiskService riskService;
    private final DefenseService defenseService;

    public ScanHistoryService(ScanHistoryRepository repository, PortService portService, ThreatService threatService, RiskService riskService, DefenseService defenseService) {
        this.repository = repository;
        this.portService = portService;
        this.threatService = threatService;
        this.riskService = riskService;
        this.defenseService = defenseService;
    }

    public ScanHistory recordScan(Asset asset) {
        int openPortCount = portService.getPortsByAssetId(asset.getId()).size();
        int threatCount = threatService.analyzeAsset(asset.getId()).size();
        RiskAssessment risk = riskService.assessAsset(asset.getId());
        DefenseReport defense = defenseService.recommendForAsset(asset.getId());

        ScanHistory history = new ScanHistory(
                asset.getId(), asset.getHostname(), asset.getIpAddress(),
                openPortCount, threatCount, risk.overallScore(), risk.overallRiskLevel(),
                defense.recommendationCount(), LocalDateTime.now());

        return repository.save(history);
    }

    public List<ScanHistory> getRecentHistory() {
        return repository.findTop20ByOrderByScannedAtDesc();
    }
}