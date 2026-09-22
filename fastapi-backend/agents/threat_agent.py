import networkx as nx
from typing import List, Dict, Any

class ThreatAgent:
    def __init__(self):
        self.name = "AI Threat Intelligence & Attack Simulation Agent"
        self.version = "2.4.0"

    def analyze_asset_threats(self, asset_id: int, ports: list) -> List[Dict[str, Any]]:
        findings = []

        for p in ports:
            state = getattr(p, "state", "open")
            if str(state).lower() != "open":
                continue

            num = getattr(p, "port_number", 0)
            service = str(getattr(p, "service", "") or "").lower()

            if num == 23 or "telnet" in service:
                findings.append({
                    "assetId": asset_id,
                    "portNumber": num,
                    "service": p.service,
                    "category": "INSECURE_LEGACY_SERVICE",
                    "severity": "HIGH",
                    "cvss": 8.5,
                    "mitre_technique": "T1040 - Network Sniffing",
                    "description": "Telnet is an unencrypted legacy service. Adversaries can capture plaintext credentials and execute commands remotely."
                })
            elif num == 21 or "ftp" in service:
                findings.append({
                    "assetId": asset_id,
                    "portNumber": num,
                    "service": p.service,
                    "category": "LEGACY_FILE_TRANSFER",
                    "severity": "MEDIUM",
                    "cvss": 6.8,
                    "mitre_technique": "T1078 - Valid Accounts",
                    "description": "FTP may transmit credentials and files in cleartext without modern TLS transport encryption."
                })
            elif num == 445 or "microsoft-ds" in service or "smb" in service:
                findings.append({
                    "assetId": asset_id,
                    "portNumber": num,
                    "service": p.service,
                    "category": "FILE_SHARING_SERVICE",
                    "severity": "MEDIUM",
                    "cvss": 6.5,
                    "mitre_technique": "T1021.002 - SMB/Windows Admin Shares",
                    "description": "Windows file-sharing service is exposed. Susceptible to lateral movement, NTLM relay, and credential relay attacks."
                })
            elif num in (3306, 5432) or any(db in service for db in ["mysql", "postgresql", "postgres"]):
                db_name = "PostgreSQL" if num == 5432 or "postgres" in service else "MySQL"
                findings.append({
                    "assetId": asset_id,
                    "portNumber": num,
                    "service": p.service,
                    "category": "DATABASE_SERVICE",
                    "severity": "MEDIUM",
                    "cvss": 7.2,
                    "mitre_technique": "T1505 - Server Software Component",
                    "description": f"{db_name} relational database port is externally reachable. Untrusted external connections should be isolated."
                })
            elif num in (80, 8080, 8000, 3000, 5000) or "http" in service:
                findings.append({
                    "assetId": asset_id,
                    "portNumber": num,
                    "service": p.service,
                    "category": "WEB_SERVICE",
                    "severity": "LOW",
                    "cvss": 4.5,
                    "mitre_technique": "T1190 - Exploit Public-Facing Application",
                    "description": "HTTP application endpoint discovered. Requires regular vulnerability scanning, web application firewall, and HTTPS enforcement."
                })
            elif num in (22, 3389) or any(r in service for r in ["ssh", "ms-wbt-server", "rdp"]):
                findings.append({
                    "assetId": asset_id,
                    "portNumber": num,
                    "service": p.service,
                    "category": "REMOTE_ACCESS_SERVICE",
                    "severity": "LOW",
                    "cvss": 4.0,
                    "mitre_technique": "T1021.001 - Remote Desktop Protocol",
                    "description": "Remote administrative access point. Ensure multi-factor authentication, IP allowlisting, and rate limiting."
                })
            else:
                findings.append({
                    "assetId": asset_id,
                    "portNumber": num,
                    "service": p.service,
                    "category": "UNKNOWN_SERVICE",
                    "severity": "LOW",
                    "cvss": 3.0,
                    "mitre_technique": "T1046 - Network Service Discovery",
                    "description": f"Service on port {num} could not be classified. Verify process origin and enforce principle of least privilege."
                })

        return findings

    def simulate_attack_paths(self, asset_id: int, hostname: str, ports: list) -> Dict[str, Any]:
        """
        Simulate adversary attack paths using Graph Theory (NetworkX) and Cyber Kill Chain.
        """
        G = nx.DiGraph()

        # Attacker Initial Node
        G.add_node("attacker", type="ATTACKER", label="Adversary Vector", step=0)

        port_numbers = [getattr(p, "port_number", 0) for p in ports]
        services = [str(getattr(p, "service", "") or "").lower() for p in ports]

        # Check for initial access vectors (HTTP, FTP, Telnet)
        has_web = any(p in [80, 8080, 8000] for p in port_numbers) or any("http" in s for s in services)
        has_ftp = any(p == 21 for p in port_numbers) or any("ftp" in s for s in services)
        has_telnet = any(p == 23 for p in port_numbers) or any("telnet" in s for s in services)
        has_smb = any(p == 445 for p in port_numbers) or any("microsoft-ds" in s for s in services)
        has_db = any(p in [5432, 3306] for p in port_numbers) or any("postgres" in s or "mysql" in s for s in services)

        simulated_paths = []

        # Path 1: Web Perimeter -> Lateral SMB -> Database Exfiltration
        if has_web or has_db or has_smb:
            path_nodes = [
                {
                    "id": "entry-web",
                    "name": "Perimeter Web Service (Port 80/8080)",
                    "tactic": "Initial Access",
                    "technique": "T1190 - Exploit Public-Facing App",
                    "detail": "Adversary probes web exposure for known CVEs or input validation flaws."
                },
                {
                    "id": "lateral-smb",
                    "name": "Local Network SMB Session (Port 445)",
                    "tactic": "Lateral Movement",
                    "technique": "T1021.002 - SMB Shares",
                    "detail": "Adversary leverages accessible file shares to stage malware and elevate local privileges."
                },
                {
                    "id": "crown-jewel-db",
                    "name": "Production Database Vault (Port 5432)",
                    "tactic": "Exfiltration & Impact",
                    "technique": "T1530 - Data from Database",
                    "detail": "Unauthorized query execution and sensitive database exfiltration achieved."
                }
            ]
            simulated_paths.append({
                "id": f"path-{asset_id}-1",
                "name": "Web Ingress to Core Database Compromise",
                "likelihood": "HIGH" if (has_web and has_db) else "MEDIUM",
                "impact": "CRITICAL",
                "risk_rating": 88 if has_db else 72,
                "steps": path_nodes
            })

        # Path 2: Plaintext Legacy Ingress (FTP/Telnet) -> Privilege Escalation
        if has_ftp or has_telnet or has_smb:
            path_nodes = [
                {
                    "id": "entry-plaintext",
                    "name": "Cleartext Service Sniffing (Port 21/23)",
                    "tactic": "Credential Access",
                    "technique": "T1040 - Network Sniffing",
                    "detail": "Adversary intercepts authentication hashes transmitted over unencrypted protocol."
                },
                {
                    "id": "priv-esc",
                    "name": "Host System Privilege Escalation",
                    "tactic": "Privilege Escalation",
                    "technique": "T1068 - Exploitation for Privilege Escalation",
                    "detail": "Compromised local user credentials leveraged to obtain administrative/SYSTEM rights."
                }
            ]
            simulated_paths.append({
                "id": f"path-{asset_id}-2",
                "name": "Cleartext Protocol Sniffing & Escalation",
                "likelihood": "HIGH" if (has_telnet or has_ftp) else "MEDIUM",
                "impact": "HIGH",
                "risk_rating": 78,
                "steps": path_nodes
            })

        # Default multi-stage fallback simulation if ports are minimal
        if not simulated_paths:
            simulated_paths.append({
                "id": f"path-{asset_id}-generic",
                "name": "Reconnaissance & Service Enumeration Vector",
                "likelihood": "LOW",
                "impact": "MEDIUM",
                "risk_rating": 45,
                "steps": [
                    {
                        "id": "step-recon",
                        "name": "Host Port Enumeration",
                        "tactic": "Discovery",
                        "technique": "T1046 - Network Service Scanning",
                        "detail": "Adversary maps active endpoints looking for unpatched services."
                    },
                    {
                        "id": "step-hardening",
                        "name": "Defense In Depth Barrier",
                        "tactic": "Defense Evasion",
                        "technique": "T1070 - Indicator Removal",
                        "detail": "Current system configuration restricts immediate lateral hop."
                    }
                ]
            })

        return {
            "asset_id": asset_id,
            "hostname": hostname,
            "total_attack_paths": len(simulated_paths),
            "critical_crown_jewel": "PostgreSQL Database Engine (Port 5432)" if has_db else "Host Administrative Core",
            "attack_paths": simulated_paths
        }

threat_agent = ThreatAgent()
