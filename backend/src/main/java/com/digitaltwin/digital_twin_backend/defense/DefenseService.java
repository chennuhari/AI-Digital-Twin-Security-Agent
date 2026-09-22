package com.digitaltwin.digital_twin_backend.defense;

import com.digitaltwin.digital_twin_backend.risk.RiskAssessment;
import com.digitaltwin.digital_twin_backend.risk.RiskItem;
import com.digitaltwin.digital_twin_backend.risk.RiskService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class DefenseService {

    private final RiskService riskService;

    public DefenseService(RiskService riskService) {
        this.riskService = riskService;
    }

    public DefenseReport recommendForAsset(Long assetId) {

        RiskAssessment assessment =
                riskService.assessAsset(assetId);

        List<DefenseRecommendation> recommendations =
                new ArrayList<>();

        for (RiskItem item : assessment.findings()) {

            recommendations.add(
                    new DefenseRecommendation(
                            item.assetId(),
                            item.portNumber(),
                            item.service(),
                            item.category(),
                            item.riskLevel(),
                            recommendationFor(item)
                    )
            );
        }

        return new DefenseReport(
                assetId,
                assessment.overallRiskLevel(),
                assessment.overallScore(),
                recommendations.size(),
                recommendations
        );
    }

    private String recommendationFor(RiskItem item) {

        return switch (item.category()) {

            case "INSECURE_LEGACY_SERVICE" ->
                    "Disable the legacy service if it is not required. Prefer an encrypted and authenticated alternative.";

            case "LEGACY_FILE_TRANSFER" ->
                    "Replace legacy file transfer with a secure alternative and restrict access to trusted users and hosts.";

            case "FILE_SHARING_SERVICE" ->
                    "Restrict file-sharing access to trusted systems only, keep the operating system patched, and disable the service if unused.";

            case "DATABASE_SERVICE" ->
                    "Restrict database access to local or approved applications, use strong authentication, and review database network exposure.";

            case "WEB_SERVICE" ->
                    "Keep the web application and dependencies updated, enable authentication where appropriate, and use TLS for sensitive traffic.";

            case "UNKNOWN_SERVICE" ->
                    "Identify the application using this port. If it is unnecessary, stop or disable the service and verify local firewall rules.";

            default ->
                    "Review whether this service is required, keep it updated, and restrict access according to least-privilege principles.";
        };
    }
}