# Security Policy

## Supported Versions

The following table lists the security support status for versions of the **AI Digital Twin Security Agent**:

| Version | Supported          |
| ------- | ------------------ |
| 2.x.x   | :white_check_mark: |
| 1.x.x   | :white_check_mark: |
| < 1.0.0 | :x:                |

---

## Reporting a Vulnerability

The AI Digital Twin Security Agent team takes security vulnerabilities seriously. We appreciate your efforts to responsibly disclose findings.

### How to Report
If you discover a security issue or vulnerability:
1. **Do not** open a public GitHub issue.
2. Email your findings directly to the project maintainers at:
   - **Email:** `harikrishnachennu607@gmail.com`
3. Please include in your report:
   - Type of vulnerability (e.g., buffer overflow, command injection, cross-site scripting, denial of service).
   - Full steps to reproduce or proof-of-concept (PoC) code/scripts.
   - Affected components (`frontend`, `fastapi-backend`, `backend` agents, or `3D visualization engine`).
   - Any suggested mitigations or patches.

### Response Timeline
- **Initial Acknowledgement:** Within **24–48 hours**.
- **Assessment & Triage:** Within **5 business days**.
- **Fix & Public Advisory:** Dependent on severity, usually released within **14 days** with full credit to the reporter.

---

## Sandbox & Safe Defense Policy
- **Authorized Targets Only:** All network reconnaissance, port scanning, and simulated exploit defense modules are engineered strictly for authorized diagnostic networks (`127.0.0.1`, RFC 1918 private subnets, and explicitly user-permitted environments).
- **Non-Destructive Simulation:** Attack graphs, honeypot traps, and zero-day attack simulations operate entirely in sandboxed in-memory digital twin models without launching real destructive network payloads.
