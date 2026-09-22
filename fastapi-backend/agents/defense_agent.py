from typing import List, Dict, Any

class DefenseAgent:
    def __init__(self):
        self.name = "AI Cyber Defense & Mitigation Agent"
        self.version = "2.4.0"

    def generate_recommendations(self, asset_id: int, threats: list) -> Dict[str, Any]:
        recommendations = []

        for threat in threats:
            port = threat.get("portNumber")
            category = threat.get("category", "")
            service = threat.get("service", "")
            severity = threat.get("severity", "LOW")

            if category == "INSECURE_LEGACY_SERVICE" or port == 23:
                recommendations.append({
                    "portNumber": port,
                    "service": service,
                    "category": category,
                    "priority": "P1 - IMMEDIATE",
                    "cis_control": "CIS Control 4.1 - Establish Secure Configuration",
                    "nist_mapping": "NIST SP 800-53 SC-8 Transmission Confidentiality",
                    "recommendation": "Decommission unencrypted Telnet service immediately. Migrate all administrative sessions to SSH (v2) with public-key authentication.",
                    "command_hint": "Disable-WindowsOptionalFeature -Online -FeatureName TelnetClient"
                })
            elif category == "LEGACY_FILE_TRANSFER" or port == 21:
                recommendations.append({
                    "portNumber": port,
                    "service": service,
                    "category": category,
                    "priority": "P2 - HIGH",
                    "cis_control": "CIS Control 9.2 - Enforce Network Ports & Protocols",
                    "nist_mapping": "NIST SP 800-53 AC-17 Remote Access",
                    "recommendation": "Replace cleartext FTP with SFTP (SSH File Transfer Protocol) or FTPS with enforced TLS 1.3 encryption and strong cipher suites.",
                    "command_hint": "Configure SFTP subsystem in sshd_config and block port 21 on host firewall."
                })
            elif category == "FILE_SHARING_SERVICE" or port == 445:
                recommendations.append({
                    "portNumber": port,
                    "service": service,
                    "category": category,
                    "priority": "P2 - HIGH",
                    "cis_control": "CIS Control 9.4 - Restrict Unnecessary Services",
                    "nist_mapping": "NIST SP 800-53 AC-3 Access Enforcement",
                    "recommendation": "Isolate SMB port 445 to dedicated internal VLANs. Disable SMBv1 and enforce SMB signing/encryption to thwart relay attacks.",
                    "command_hint": "Set-SmbServerConfiguration -EnableSMB1Protocol $false -EncryptData $true"
                })
            elif category == "DATABASE_SERVICE" or port in (3306, 5432):
                db_name = "PostgreSQL" if port == 5432 else "MySQL"
                recommendations.append({
                    "portNumber": port,
                    "service": service,
                    "category": category,
                    "priority": "P2 - HIGH",
                    "cis_control": "CIS Control 3.3 - Protect Sensitive Data",
                    "nist_mapping": "NIST SP 800-53 IA-2 Identification and Authentication",
                    "recommendation": f"Restrict {db_name} listener to 127.0.0.1 or trusted application container subnet. Enforce SCRAM-SHA-256 and SSL client certificates.",
                    "command_hint": "Edit pg_hba.conf: host all all 127.0.0.1/32 scram-sha-256"
                })
            elif category == "WEB_SERVICE" or port in (80, 8080, 8000):
                recommendations.append({
                    "portNumber": port,
                    "service": service,
                    "category": category,
                    "priority": "P3 - MEDIUM",
                    "cis_control": "CIS Control 7.1 - Establish Secure Application Architecture",
                    "nist_mapping": "NIST SP 800-53 SA-11 Developer Testing",
                    "recommendation": "Enforce HTTPS with automated HSTS header. Deploy Web Application Firewall (WAF) rate limiting and vulnerability scanning.",
                    "command_hint": "Add Content-Security-Policy and Strict-Transport-Security reverse proxy headers."
                })
            elif category == "MULTICAST_DNS" or port == 5353:
                recommendations.append({
                    "portNumber": port,
                    "service": service,
                    "category": category,
                    "priority": "P2 - HIGH",
                    "cis_control": "CIS Control 9.2 - Enforce Network Boundaries",
                    "nist_mapping": "NIST SP 800-53 SC-7 Boundary Protection",
                    "recommendation": "Disable mDNS / Bonjour discovery on untrusted or public Wi-Fi networks to prevent device fingerprinting and broadcast snooping.",
                    "command_hint": "Stop-Service -Name 'Bonjour Service' -PassThru | Set-Service -StartupType Disabled"
                })
            elif category == "NETBIOS_NAME_SERVICE" or port in (137, 138, 139):
                recommendations.append({
                    "portNumber": port,
                    "service": service,
                    "category": category,
                    "priority": "P1 - CRITICAL",
                    "cis_control": "CIS Control 4.1 - Secure Baseline Configuration",
                    "nist_mapping": "NIST SP 800-53 AC-3 Access Enforcement",
                    "recommendation": "Disable NetBIOS over TCP/IP in network adapter settings to neutralize LLMNR/NBT-NS hash relay attacks.",
                    "command_hint": "wmic nicconfig where TcpipNetbiosOptions=1 call SetTcpipNetbios 2"
                })
            elif category == "UPNP_DISCOVERY" or port == 1900:
                recommendations.append({
                    "portNumber": port,
                    "service": service,
                    "category": category,
                    "priority": "P2 - HIGH",
                    "cis_control": "CIS Control 9.4 - Restrict Unnecessary Services",
                    "nist_mapping": "NIST SP 800-53 CM-7 Least Functionality",
                    "recommendation": "Disable SSDP / UPnP service on the operating system and turn off UPnP in local router gateway firmware.",
                    "command_hint": "Stop-Service SSDPSRV; Set-Service SSDPSRV -StartupType Disabled"
                })
            elif category == "UNENCRYPTED_DNS" or port == 53:
                recommendations.append({
                    "portNumber": port,
                    "service": service,
                    "category": category,
                    "priority": "P3 - MEDIUM",
                    "cis_control": "CIS Control 8.5 - Encrypt Sensitive Data in Transit",
                    "nist_mapping": "NIST SP 800-53 SC-8 Transmission Confidentiality",
                    "recommendation": "Configure DNS-over-HTTPS (DoH) using Cloudflare (1.1.1.1) or Quad9 (9.9.9.9) to encrypt all outbound domain queries.",
                    "command_hint": "Set-DnsClientServerAddress -InterfaceAlias 'Wi-Fi' -ServerAddresses ('1.1.1.1','1.0.0.1')"
                })
            elif category == "DEVELOPMENT_SERVER_EXPOSURE":
                recommendations.append({
                    "portNumber": port,
                    "service": service,
                    "category": category,
                    "priority": "P2 - HIGH",
                    "cis_control": "CIS Control 7.2 - Restrict Development Environments",
                    "nist_mapping": "NIST SP 800-53 CM-2 Baseline Configuration",
                    "recommendation": "Bind local dev servers strictly to 127.0.0.1 rather than 0.0.0.0 to prevent LAN adversaries from probing debug endpoints.",
                    "command_hint": "Set server host flag: --host 127.0.0.1 instead of 0.0.0.0"
                })
            else:
                recommendations.append({
                    "portNumber": port,
                    "service": service,
                    "category": category,
                    "priority": "P4 - LOW",
                    "cis_control": "CIS Control 2.1 - Ensure Authorized Software",
                    "nist_mapping": "NIST SP 800-53 CM-7 Least Functionality",
                    "recommendation": f"Verify owning binary for port {port}. Close the socket if not required for business operations.",
                    "command_hint": "netstat -ano | findstr :" + str(port)
                })

        return {
            "assetId": asset_id,
            "recommendationCount": len(recommendations),
            "recommendations": recommendations
        }

defense_agent = DefenseAgent()
