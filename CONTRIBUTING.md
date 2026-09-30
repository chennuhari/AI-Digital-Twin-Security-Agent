# Contributing to AI Digital Twin Security Agent

Thank you for your interest in contributing to the **AI Digital Twin Security Agent**! 🎉

This project is an open-source, kid-friendly, AI-powered cybersecurity digital twin designed to make network threat analysis, attack path visualization, and automated remediation intuitive, visual, and accessible to everyone.

---

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please report unacceptable behavior to `chennuharikrishnareddy@gmail.com`.

---

## How Can I Contribute?

### 1. Reporting Bugs
- Search existing [Issues](https://github.com/chennuhari/AI-Digital-Twin-Security-Agent/issues) to verify if the issue was already reported.
- If not, use our [Bug Report Template](.github/ISSUE_TEMPLATE/bug_report.md) with steps to reproduce, expected vs. actual behavior, and browser/OS details.

### 2. Suggesting Features
- We welcome feature suggestions! Open a feature request using the [Feature Request Template](.github/ISSUE_TEMPLATE/feature_request.md).
- Emphasize how the feature enhances security awareness or simplifies complex threat concepts.

### 3. Submitting Code (Pull Requests)
1. **Fork** the repository and create a new branch from `main`:
   ```bash
   git checkout -b feature/my-amazing-feature
   ```
2. **Install dependencies**:
   ```bash
   # Frontend
   cd frontend
   npm install

   # Backend
   cd ../fastapi-backend
   pip install -r requirements.txt
   ```
3. **Design & Code Standards**:
   - **Kid-Friendly Aesthetics:** Use vibrant, inviting colors (Emerald, Violet/Purple, Amber, Rose). Avoid plain blue generic palettes.
   - **Plain English Language:** Explain technical security terms in simple, clear language so beginners and kids can understand.
   - **Interactive 3D Engine:** Keep Three.js geometries lightweight, clean, and responsive with smooth micro-animations.
4. **Test locally**:
   ```bash
   # Run frontend dev server
   npm run dev

   # Verify production build
   npm run build
   ```
5. **Commit your changes**:
   ```bash
   git commit -m "feat(ui): add interactive sound toggle to fortress game"
   ```
6. **Push and open a Pull Request** against the `main` branch.

---

## Architecture Overview

- **`frontend/`**: React 18 SPA with Vite, Three.js 3D canvas, Lucide icons, TwinBot AI copilot, Defend Fortress mini-game, Subnet Radar, and 1-Click Executive PDF generator.
- **`fastapi-backend/`**: High-performance asynchronous FastAPI microservice providing instant threat modeling, simulated network reconnaissance, and MITRE ATT&CK mapping.
- **`backend/`**: Autonomous Python multi-agent orchestration, Neo4j graph generator, and Nmap scanner modules.

---

## Community Guidelines

- Keep discussions constructive, polite, and inclusive.
- All Pull Requests undergo automated build verification and peer review before merging.
- Happy hacking and building a safer cyber world! 🛡️✨
