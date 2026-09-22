from typing import List, Dict, Any

class RiskAgent:
    def __init__(self):
        self.name = "AI Quantitative Risk Assessment Agent"
        self.version = "2.4.0"

    def assess_risk(self, asset_id: int, threats: list, asset_criticality: float = 1.0) -> Dict[str, Any]:
        if not threats:
            return {
                "assetId": asset_id,
                "overallScore": 0,
                "overallRiskLevel": "NONE",
                "findingCount": 0,
                "criticalityMultiplier": asset_criticality,
                "findings": []
            }

        weighted_severity_total = 0
        highest_severity_score = 0
        findings = []

        for threat in threats:
            sev = threat.get("severity", "LOW").upper()
            cat = threat.get("category", "").upper()
            port = threat.get("portNumber")
            service = threat.get("service", "")

            base_score = self._score_for_severity(sev)
            context_bonus = self._context_bonus(cat, port, service)

            finding_score = min(100, base_score + context_bonus)
            weighted_severity_total += finding_score
            highest_severity_score = max(highest_severity_score, finding_score)

            rationale = (
                f"Risk is based on detected {cat} with {sev} severity "
                f"(base: {base_score}, context: +{context_bonus})."
            )

            findings.append({
                "assetId": asset_id,
                "portNumber": port,
                "service": service,
                "category": cat,
                "severity": sev,
                "riskScore": finding_score,
                "riskLevel": self._level_for_score(finding_score),
                "rationale": rationale
            })

        avg_score = weighted_severity_total / len(threats)
        exposure_bonus = min(15, max(0, len(threats) - 1) * 5)

        raw_overall = (avg_score * 0.65) + (highest_severity_score * 0.35) + exposure_bonus
        adjusted_overall = int(round(raw_overall * asset_criticality))
        final_score = min(100, max(0, adjusted_overall))

        return {
            "assetId": asset_id,
            "overallScore": final_score,
            "overallRiskLevel": self._level_for_score(final_score),
            "findingCount": len(findings),
            "criticalityMultiplier": asset_criticality,
            "findings": findings
        }

    def _score_for_severity(self, severity: str) -> int:
        s = (severity or "").upper()
        if s == "CRITICAL":
            return 90
        elif s == "HIGH":
            return 75
        elif s == "MEDIUM":
            return 50
        elif s == "LOW":
            return 20
        return 10

    def _context_bonus(self, category: str, port: int, service: str) -> int:
        bonus = 0
        c = (category or "").upper()
        s = (service or "").lower()

        if c == "INSECURE_LEGACY_SERVICE":
            bonus += 12
        elif c == "LEGACY_FILE_TRANSFER":
            bonus += 8
        elif c == "DATABASE_SERVICE":
            bonus += 7
        elif c == "FILE_SHARING_SERVICE":
            bonus += 6
        elif c == "UNKNOWN_SERVICE":
            bonus += 4
        elif c == "WEB_SERVICE":
            bonus += 2

        if port in (23, 21):
            bonus += 3
        elif port in (3306, 5432):
            bonus += 2
        elif port == 445:
            bonus += 2

        return min(18, bonus)

    def _level_for_score(self, score: int) -> str:
        if score >= 85:
            return "CRITICAL"
        elif score >= 70:
            return "HIGH"
        elif score >= 40:
            return "MEDIUM"
        elif score > 0:
            return "LOW"
        return "NONE"

risk_agent = RiskAgent()
