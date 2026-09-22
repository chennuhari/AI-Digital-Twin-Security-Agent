package com.digitaltwin.digital_twin_backend.history;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "scan_history")
public class ScanHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private Long assetId;
    private String hostname;
    @Column(nullable = false)
    private String ipAddress;
    @Column(nullable = false)
    private Integer openPortCount;
    @Column(nullable = false)
    private Integer threatCount;
    @Column(nullable = false)
    private Integer riskScore;
    @Column(nullable = false)
    private String riskLevel;
    @Column(nullable = false)
    private Integer recommendationCount;
    @Column(nullable = false)
    private LocalDateTime scannedAt;

    public ScanHistory() {}

    public ScanHistory(Long assetId, String hostname, String ipAddress, Integer openPortCount, Integer threatCount, Integer riskScore, String riskLevel, Integer recommendationCount, LocalDateTime scannedAt) {
        this.assetId = assetId;
        this.hostname = hostname;
        this.ipAddress = ipAddress;
        this.openPortCount = openPortCount;
        this.threatCount = threatCount;
        this.riskScore = riskScore;
        this.riskLevel = riskLevel;
        this.recommendationCount = recommendationCount;
        this.scannedAt = scannedAt;
    }

    public Long getId(){ return id; }
    public Long getAssetId(){ return assetId; }
    public String getHostname(){ return hostname; }
    public String getIpAddress(){ return ipAddress; }
    public Integer getOpenPortCount(){ return openPortCount; }
    public Integer getThreatCount(){ return threatCount; }
    public Integer getRiskScore(){ return riskScore; }
    public String getRiskLevel(){ return riskLevel; }
    public Integer getRecommendationCount(){ return recommendationCount; }
    public LocalDateTime getScannedAt(){ return scannedAt; }
}