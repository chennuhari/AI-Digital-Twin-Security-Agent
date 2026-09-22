package com.digitaltwin.digital_twin_backend.risk;

import com.digitaltwin.digital_twin_backend.threat.ThreatFinding;
import com.digitaltwin.digital_twin_backend.threat.ThreatService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class RiskService {

    private final ThreatService threatService;

    public RiskService(ThreatService threatService) {
        this.threatService = threatService;
    }

    public RiskAssessment assessAsset(Long assetId) {

        List<ThreatFinding> threats =
                threatService.analyzeAsset(assetId);

        List<RiskItem> findings = new ArrayList<>();

        if (threats.isEmpty()) {
            return new RiskAssessment(
                    assetId,
                    0,
                    "NONE",
                    0,
                    findings
            );
        }

        int weightedSeverityTotal = 0;
        int highestSeverityScore = 0;

        for (ThreatFinding threat : threats) {

            int baseScore = scoreForSeverity(threat.severity());
            int contextBonus = contextBonus(threat);

            // Individual finding score stays bounded to 100.
            int findingScore = Math.min(
                    100,
                    baseScore + contextBonus
            );

            weightedSeverityTotal += findingScore;
            highestSeverityScore = Math.max(
                    highestSeverityScore,
                    findingScore
            );

            findings.add(
                    new RiskItem(
                            threat.assetId(),
                            threat.portNumber(),
                            threat.service(),
                            threat.category(),
                            threat.severity(),
                            findingScore,
                            levelForScore(findingScore),
                            buildRationale(
                                    threat,
                                    baseScore,
                                    contextBonus
                            )
                    )
            );
        }

        /*
         * Asset score combines:
         *  - average severity/context score
         *  - the most serious finding
         *  - a small exposure bonus when several findings exist
         *
         * This avoids giving every asset with the same average
         * severity mix exactly the same final risk score.
         */
        double average =
                (double) weightedSeverityTotal / threats.size();

        int exposureBonus =
                Math.min(15, Math.max(0, threats.size() - 1) * 5);

        int overallScore = (int) Math.round(
                (average * 0.65)
                        + (highestSeverityScore * 0.35)
                        + exposureBonus
        );

        overallScore = Math.min(100, overallScore);

        return new RiskAssessment(
                assetId,
                overallScore,
                levelForScore(overallScore),
                findings.size(),
                findings
        );
    }

    private int scoreForSeverity(String severity) {

        if (severity == null) {
            return 10;
        }

        return switch (severity.toUpperCase()) {
            case "CRITICAL" -> 90;
            case "HIGH" -> 75;
            case "MEDIUM" -> 50;
            case "LOW" -> 20;
            default -> 10;
        };
    }

    private int contextBonus(ThreatFinding threat) {

        String category = safe(threat.category()).toUpperCase();
        String service = safe(threat.service()).toLowerCase();
        Integer port = threat.portNumber();

        int bonus = switch (category) {
            case "INSECURE_LEGACY_SERVICE" -> 12;
            case "LEGACY_FILE_TRANSFER" -> 8;
            case "DATABASE_SERVICE" -> 7;
            case "FILE_SHARING_SERVICE" -> 6;
            case "UNKNOWN_SERVICE" -> 4;
            case "WEB_SERVICE" -> 2;
            default -> 0;
        };

        // Small service-specific context adjustments.
        if (port != null) {
            if (port == 23) {
                bonus += 3;
            } else if (port == 21) {
                bonus += 2;
            } else if (port == 3306 || port == 5432) {
                bonus += 2;
            }
        }

        if (service.contains("telnet")) {
            bonus += 2;
        }

        return Math.min(18, bonus);
    }

    private String levelForScore(int score) {

        if (score >= 85) {
            return "CRITICAL";
        }

        if (score >= 70) {
            return "HIGH";
        }

        if (score >= 40) {
            return "MEDIUM";
        }

        if (score > 0) {
            return "LOW";
        }

        return "NONE";
    }

    private String buildRationale(
            ThreatFinding threat,
            int baseScore,
            int contextBonus) {

        return "Risk is based on the detected "
                + threat.category()
                + " finding with "
                + threat.severity()
                + " threat severity"
                + " (base score "
                + baseScore
                + ", service/context adjustment +"
                + contextBonus
                + ").";
    }

    private String safe(String value) {
        return value == null ? "" : value;
    }
}
