# AI Digital Twin Security Agent

An intelligent cybersecurity platform that creates a virtual representation (Digital Twin) of an organization's network infrastructure to proactively discover vulnerabilities, simulate adversary attack paths, evaluate risks, and generate mitigation strategies without impacting production operations.

Built strictly according to the research abstract using **Python**, **FastAPI**, **PostgreSQL**, **Neo4j**, and **Nmap**, combined with an interactive **3D Futuristic Holographic Command Center** built with **React**, **Three.js / React Three Fiber**, and **Tailwind CSS**.

---

## 🚀 Key Features & Agent Architecture

### 1. 🔍 Recon Agent (`ReconAgent`)
- Automated network discovery using native **Nmap** (`-sT -T4`).
- Identifies active hosts, open ports, protocols, and service signatures.
- Stores assets in **PostgreSQL** (`assets`, `ports`, `scan_history`) and maps nodes in **Neo4j**.

### 2. ⚡ Threat Agent (`ThreatAgent`)
- Analyzes discovered services for vulnerability vectors (cleartext protocols, exposed databases, file-sharing relays).
- **Adversary Attack Path Simulator**: Graph-based multi-stage attack simulations showing how an attacker pivots from perimeter web ingress &rarr; lateral SMB hops &rarr; core database compromise.
- Mapped to **MITRE ATT&CK** tactics and techniques (e.g. T1190, T1040, T1021, T1530).

### 3. 🛡️ Defense Agent (`DefenseAgent`)
- Produces prioritized remediation playbooks (P1 Immediate, P2 High, P3 Medium) aligned with **CIS Controls v8** and **NIST SP 800-53**.
- **Interactive Simulated Remediation**: Virtual hardening of exposed ports to test defensive countermeasures and recalculate risk in real time.

### 4. 📊 Risk Agent (`RiskAgent`)
- Multi-factor quantitative cyber risk calculation factoring in:
  - Base CVSS severity
  - Contextual exposure adjustments
  - Asset criticality weighting
  - Attack path depth
- Returns overall risk score (0-100) and tier (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`).

### 5. 🌐 3D Futuristic Holographic Cyber Command Center
- **Overview Section First**: Executive mission control with 4 KPI cards, autonomous agent matrix, and monitored fleet inventory.
- **Continuous 3D Group Spinning**: Smooth Three.js Y-axis rotation with speed multipliers (0.2x, 0.5x, 1.0x, 2.0x) and Pause/Resume.
- **Interactive Zoom In (+) and Zoom Out (−)**: Dedicated floating zoom HUD on the 3D canvas and in the diagram toolbar with instant Reset.
- **Dynamic Attack Path Visualization**: Animated neon laser conduits and traveling energy packets showing simulated adversary paths in 3D.
- **Interactive 3D Node Inspector**: Click any node to view real-time telemetry, CVSS data, and defensive actions.
- **Web Audio Cyber Sound Effects**: Synthesized audio feedback for scans, alerts, and mitigations with toggleable mute.
- **Digital Twin Posture Export**: Export complete digital twin security assessments as JSON.

---

## 📖 Detailed Demonstration & Defense Guide

For a complete, comprehensive presentation walkthrough, technical agent mechanics, and evaluator Q&A defense script, read:
👉 **[`DEMONSTRATION_GUIDE.md`](./DEMONSTRATION_GUIDE.md)**

---

## 🛠️ Technology Stack

| Component | Technology |
|---|---|
| **Backend Framework** | Python 3.12, FastAPI, Uvicorn |
| **Relational Storage** | PostgreSQL (`digital_twin` database) |
| **Graph Database** | Neo4j (`neo4j://127.0.0.1:7687`) |
| **Network Recon** | Nmap 7.991, python-nmap |
| **Graph Theory / Simulation** | NetworkX, Cypher Queries |
| **Frontend Framework** | React 19, Vite |
| **3D Rendering** | Three.js, `@react-three/fiber`, `@react-three/drei` |
| **Styling & UI** | Tailwind CSS v4, Lucide Icons, Framer Motion |

---

## 🏃‍♂️ Quick Start

### 1. Launch Everything
Run the automated launcher script:
```powershell
.\start_all.bat
```

Or manually:

#### Start Python FastAPI Backend:
```powershell
cd fastapi-backend
python -m uvicorn main:app --host 0.0.0.0 --port 8001 --reload
```

#### Start Frontend:
```powershell
cd frontend
npm run dev
```

### 2. Access the Applications
- **Cyber Command Dashboard**: [http://localhost:5173](http://localhost:5173)
- **FastAPI Interactive Swagger Docs**: [http://localhost:8001/docs](http://localhost:8001/docs)
- **Default Login Credentials**:
  - **Username**: `testuser3`
  - **Password**: `Test@123`
