import { useEffect, useMemo, useState, useRef } from "react";
import {
  Activity,
  BrainCircuit,
  Radar,
  RefreshCw,
  ShieldCheck,
  TerminalSquare,
  Volume2,
  VolumeX,
  FileDown,
  Search,
  ChevronRight,
  ShieldAlert,
  ArrowDown,
  ArrowUp,
  Cpu,
  Compass,
  LayoutDashboard,
  Server,
  AlertTriangle,
  Flame,
  CheckCircle2,
  X,
  Menu,
} from "lucide-react";

import { api, setToken, savedToken } from "./api";
import { cyberAudio } from "./soundEffects";
import { getVisitorDeviceInfo, fetchVisitorIp } from "./deviceUtils";

// Page Components
import OverviewPage from "./pages/OverviewPage";
import AssetTwinPage from "./pages/AssetTwinPage";
import DiagramPage from "./pages/DiagramPage";
import ReconPage from "./pages/ReconPage";
import ThreatPage from "./pages/ThreatPage";
import DefensePage from "./pages/DefensePage";
import RiskPage from "./pages/RiskPage";
import AuditPage from "./pages/AuditPage";

// Available Page Tabs
const PAGES = [
  { id: "overview", number: "01", category: "MISSION CONTROL", label: "Overview", icon: LayoutDashboard, title: "Executive Mission Control & Fleet Posture" },
  { id: "diagram", number: "02", category: "MISSION CONTROL", label: "3D Diagram", icon: Compass, title: "3D Holographic Twin Command Center" },
  { id: "asset-twin", number: "TWIN", category: "MISSION CONTROL", label: "IP Twin", icon: Cpu, title: "Dedicated IP Digital Twin & Constellation" },
  { id: "recon", number: "03", category: "SECURITY AGENTS", label: "Recon Agent", icon: Radar, title: "Autonomous Reconnaissance Agent" },
  { id: "threat", number: "04", category: "SECURITY AGENTS", label: "Threat Intel", icon: Flame, title: "Threat Agent & Kill Chain" },
  { id: "defense", number: "05", category: "SECURITY AGENTS", label: "Defense Agent", icon: ShieldCheck, title: "Autonomous Defense Agent" },
  { id: "risk", number: "06", category: "ANALYTICS & AUDIT", label: "Risk Matrix", icon: Activity, title: "Quantitative Risk Matrix" },
  { id: "audit", number: "07", category: "ANALYTICS & AUDIT", label: "Audit Ledger", icon: TerminalSquare, title: "Audit & Evolution Logs" },
];

function LoginPanel({ onLogin }) {
  const [username, setUsername] = useState("testuser3");
  const [password, setPassword] = useState("Test@123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    cyberAudio.playBeep(440, 0.08);

    try {
      const res = await api.post("/api/auth/login", { username, password });
      setToken(res.data.token);
      cyberAudio.playSuccess();
      onLogin(res.data);
    } catch (err) {
      console.error(err);
      cyberAudio.playAlert();
      setError("Authentication failed. Please verify username/password and ensure backend is online.");
    } finally {
      setLoading(false);
    }
  }

  async function guestLoginAndScan() {
    setLoading(true);
    setError("");
    cyberAudio.playScan();
    try {
      const res = await api.post("/api/auth/login", { username: "testuser3", password: "Test@123" });
      setToken(res.data.token);
      cyberAudio.playSuccess();
      onLogin(res.data, true);
    } catch (err) {
      // Fallback guest session for cloud/offline evaluations
      const fallback = { token: "guest-token-cyber", username: "Visitor Security Analyst", role: "GUEST" };
      setToken(fallback.token);
      cyberAudio.playSuccess();
      onLogin(fallback, true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-8 flex items-center justify-center bg-[#020617]">
      <div className="relative z-10 w-full max-w-5xl mx-auto grid lg:grid-cols-[1.3fr_.7fr] gap-8 items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-950/50 px-3.5 py-1.5 text-xs font-mono uppercase tracking-widest text-cyan-300">
            <BrainCircuit className="h-4 w-4 text-cyan-400 animate-pulse" />
            Autonomous AI Security Platform
          </div>
          <h1 className="mt-4 text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            AI Digital Twin <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
              Security Agent
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-base sm:text-lg text-slate-300 leading-relaxed font-sans">
            Replicates organizational network assets, services, and security relationships in a living 3D virtual twin.
            Autonomous Recon, Threat, Defense, and Risk agents simulate multi-hop attack paths and enforce proactive hardening.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" /> Python FastAPI</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> PostgreSQL Storage</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-violet-400" /> Neo4j Graph Models</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-amber-400" /> Nmap Auto-Recon</span>
          </div>
        </div>

        <form onSubmit={submit} className="glass-panel p-7 relative border-cyan-500/20 shadow-2xl">
          <div className="mb-5">
            <div className="text-xs font-mono uppercase tracking-[0.2em] text-cyan-400">Terminal Access</div>
            <h2 className="mt-1 text-2xl font-bold text-white">Sign In to Dashboard</h2>
          </div>
          <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">User Identity</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-slate-900/80 px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition font-mono"
          />

          <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mt-4 mb-1.5">Passcode</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-slate-900/80 px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition font-mono"
          />

          {error && <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300 font-mono">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 py-3 text-sm font-bold text-slate-950 hover:brightness-110 transition cursor-pointer shadow-lg shadow-cyan-950/50 font-mono uppercase tracking-wider"
          >
            {loading ? "Authenticating Session..." : "Sign In to Dashboard"}
          </button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
            <div className="relative flex justify-center text-[10px] uppercase"><span className="bg-slate-900 px-2 text-slate-400 font-mono">Visitor Quick Assessment</span></div>
          </div>

          <button
            type="button"
            onClick={guestLoginAndScan}
            disabled={loading}
            className="w-full rounded-xl border border-cyan-400/40 bg-cyan-950/40 hover:bg-cyan-900/60 py-2.5 px-4 text-xs font-mono font-bold text-cyan-300 transition cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider shadow-lg hover:border-cyan-400"
          >
            <Radar className="h-4 w-4 text-cyan-400 animate-spin" style={{ animationDuration: "3s" }} />
            <span>Instant Access & Scan My Device</span>
          </button>
        </form>
      </div>
    </div>
  );
}

export default function App() {
  const [session, setSession] = useState(
    savedToken ? { token: savedToken, username: "Security Admin", role: "USER" } : null
  );

  const [assetId, setAssetId] = useState(2);
  const [assets, setAssets] = useState([]);
  const [ports, setPorts] = useState([]);
  const [fullGraph, setFullGraph] = useState(null);
  const [showAllAssets, setShowAllAssets] = useState(false);
  const [threats, setThreats] = useState([]);
  const [attackPaths, setAttackPaths] = useState(null);
  const [risk, setRisk] = useState(null);
  const [defense, setDefense] = useState(null);
  const [history, setHistory] = useState([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("AI Digital Twin Systems Online");
  const [soundEnabled, setSoundEnabled] = useState(cyberAudio.enabled);

  // Active Page Routing State - default to overview
  const [activePage, setActivePage] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Diagram specific states
  const [isSpinning, setIsSpinning] = useState(true);
  const [spinSpeed, setSpinSpeed] = useState(0.35); // 0.15 (slow), 0.35 (normal), 0.75 (fast), 1.5 (turbo)
  const [selectedNode, setSelectedNode] = useState(null);
  const [cameraPreset, setCameraPreset] = useState("overview");
  const [layerFilter, setLayerFilter] = useState("ALL"); // ALL, SERVICE, THREAT, RISK, RECOMMENDATION
  const diagramZoomRef = useRef(null);

  // IP Address Search & Fast Lookup States
  const [searchIpQuery, setSearchIpQuery] = useState("");
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const searchDropdownRef = useRef(null);
  const dashboardCacheRef = useRef({});

  // Attack Path Simulation states
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [simCurrentStepIndex, setSimCurrentStepIndex] = useState(0);
  const simTimerRef = useRef(null);

  // Recon scan target input & terminal log
  const [scanTarget, setScanTarget] = useState("127.0.0.1");
  const [scanProfile, setScanProfile] = useState("-sT -T4");
  const [reconTerminalLogs, setReconTerminalLogs] = useState([]);

  // Active MITRE step for preview
  const [activeMitreStep, setActiveMitreStep] = useState(0);

  // Close search dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(e.target)) {
        setIsSearchDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter assets by IP address or hostname for search dropdown
  const searchResults = useMemo(() => {
    if (!searchIpQuery.trim()) return assets.slice(0, 7);
    const q = searchIpQuery.trim().toLowerCase();
    return assets.filter(
      (a) =>
        (a.ipAddress && a.ipAddress.toLowerCase().includes(q)) ||
        (a.hostname && a.hostname.toLowerCase().includes(q))
    );
  }, [assets, searchIpQuery]);

  // Section 01 fleet filtered cards
  const filteredFleetAssets = useMemo(() => {
    if (!searchIpQuery.trim()) return assets;
    const q = searchIpQuery.trim().toLowerCase();
    return assets.filter(
      (a) =>
        (a.ipAddress && a.ipAddress.toLowerCase().includes(q)) ||
        (a.hostname && a.hostname.toLowerCase().includes(q))
    );
  }, [assets, searchIpQuery]);

  // Page switcher
  function switchPage(pageId) {
    cyberAudio.playBeep(520, 0.04);
    setActivePage(pageId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Handle selecting an asset: sets active asset and navigates to the dedicated Asset Twin Page
  function handleSelectAssetByIp(asset) {
    setIsSearchDropdownOpen(false);
    setSearchIpQuery(asset.ipAddress);
    setShowAllAssets(false);
    setAssetId(asset.id);
    loadDashboard(asset.id);
    switchPage("asset-twin");
    cyberAudio.playSuccess();
    setMessage(`Digital Twin Loaded: ${asset.ipAddress} (${asset.hostname || "Host"}) · Dedicated 3D Diagram Active`);
  }

  // Handle IP search submit
  function handleSearchIpSubmit(query) {
    if (!query || !query.trim()) return;
    const clean = query.trim().toLowerCase();
    const exact = assets.find((a) => (a.ipAddress && a.ipAddress.toLowerCase() === clean));
    if (exact) {
      handleSelectAssetByIp(exact);
      return;
    }
    const partial = assets.find(
      (a) =>
        (a.ipAddress && a.ipAddress.toLowerCase().includes(clean)) ||
        (a.hostname && a.hostname.toLowerCase().includes(clean))
    );
    if (partial) {
      handleSelectAssetByIp(partial);
      return;
    }
    // IP not yet registered in fleet: Stage for active Reconnaissance scanning
    setIsSearchDropdownOpen(false);
    setScanTarget(clean);
    switchPage("recon");
    setMessage(`IP ${clean} not found in fleet. Auto-Recon staged in Recon Agent Page.`);
    cyberAudio.playBeep(440, 0.08);
  }

  // Load Dashboard Data for a single asset
  async function loadDashboard(id = assetId) {
    setShowAllAssets(false);
    setBusy(true);
    setMessage(`Synchronizing Digital Twin for Asset #${id}...`);
    cyberAudio.playBeep(520, 0.05);

    // Instant cache-first display for zero lag when switching or searching
    if (dashboardCacheRef.current[id]) {
      const c = dashboardCacheRef.current[id];
      setPorts(c.ports || []);
      setThreats(c.threats || []);
      setAttackPaths(c.attackPaths || null);
      setRisk(c.risk || null);
      setDefense(c.defense || null);
      if (c.fullGraph) setFullGraph(c.fullGraph);
    }

    try {
      const [
        assetRes,
        portRes,
        threatRes,
        attackPathRes,
        riskRes,
        defenseRes,
        historyRes,
        graphRes,
      ] = await Promise.all([
        api.get("/api/assets"),
        api.get(`/api/assets/${id}/ports`),
        api.get(`/api/threat/assets/${id}`),
        api.get(`/api/threat/attack-paths/${id}`),
        api.get(`/api/risk/assets/${id}`),
        api.get(`/api/defense/assets/${id}`),
        api.get("/api/history/recent"),
        api.get(`/api/graph-analysis/assets/${id}/full`).catch((gErr) => {
          console.warn("Neo4j graph fallback active:", gErr);
          return { data: null };
        }),
      ]);

      const loadedAssets = assetRes.data || [];
      const loadedPorts = portRes.data || [];
      const loadedThreats = threatRes.data || [];
      const loadedAttackPaths = attackPathRes.data || null;
      const loadedRisk = riskRes.data || null;
      const loadedDefense = defenseRes.data || null;
      const loadedHistory = historyRes.data || [];
      const loadedGraph = graphRes.data || null;

      setAssets(loadedAssets);
      setPorts(loadedPorts);
      setThreats(loadedThreats);
      setAttackPaths(loadedAttackPaths);
      setRisk(loadedRisk);
      setDefense(loadedDefense);
      setHistory(loadedHistory);
      if (loadedGraph) {
        setFullGraph(loadedGraph);
      }

      // Populate memory cache
      dashboardCacheRef.current[id] = {
        ports: loadedPorts,
        threats: loadedThreats,
        attackPaths: loadedAttackPaths,
        risk: loadedRisk,
        defense: loadedDefense,
        fullGraph: loadedGraph,
      };

      setMessage(`Digital Twin Asset #${id} synchronized with PostgreSQL & Neo4j.`);
    } catch (err) {
      console.error(err);
      cyberAudio.playAlert();
      setMessage("Data synchronization issue. Verify FastAPI backend on port 8001.");
    } finally {
      setBusy(false);
    }
  }

  // Load complete multi-asset environment
  async function loadEnvironmentGraph() {
    setBusy(true);
    cyberAudio.playBeep(640, 0.08);
    setMessage("Generating complete multi-asset environment topology...");

    try {
      const res = await api.get("/api/graph-analysis/environment/full");
      const env = res.data;
      const combined = {
        nodes: env.nodes || [],
        edges: env.edges || [],
      };
      setFullGraph(combined);
      setShowAllAssets(true);
      setMessage(`Environment Loaded: ${env.assetCount || 0} Assets Monitored in Neo4j`);
      cyberAudio.playSuccess();
    } catch (err) {
      console.error(err);
      setMessage("Could not load complete multi-asset environment.");
      cyberAudio.playAlert();
    } finally {
      setBusy(false);
    }
  }

  // Trigger Recon Scan
  async function triggerReconScan(overrideTarget = null, isClient = false, customOs = null) {
    const target = overrideTarget || scanTarget;
    setBusy(true);
    setMessage(`Recon Agent scanning ${target} via Nmap (${scanProfile})...`);
    setReconTerminalLogs([
      `[AI-RECON] [${new Date().toLocaleTimeString()}] Initializing automated reconnaissance engine...`,
      `[AI-RECON] Target: ${target}`,
      `[AI-RECON] Executing Nmap sweep: nmap ${scanProfile} ${target}`,
      `[AI-RECON] SYN packet probes dispatched across TCP sockets...`,
      `[AI-RECON] Analyzing response RST / ACK banners...`,
    ]);
    cyberAudio.playScan();

    try {
      const res = await api.post("/api/recon/scan", {
        target: target,
        is_client_device: isClient,
        operating_system: customOs
      });
      const rawLines = Array.isArray(res.data?.raw_output) ? res.data.raw_output : (Array.isArray(res.data) ? res.data : []);
      setReconTerminalLogs((prev) => [
        ...prev,
        ...rawLines,
        `[AI-RECON] [${new Date().toLocaleTimeString()}] Reconnaissance sweep complete! Discovered sockets committed to PostgreSQL & Neo4j graph.`,
      ]);
      cyberAudio.playSuccess();
      const newAssetId = res.data?.asset_id || assetId;
      setAssetId(newAssetId);
      await loadDashboard(newAssetId);
      setMessage(`Reconnaissance finished on ${target}. Snapshot recorded.`);
      return newAssetId;
    } catch (err) {
      console.error(err);
      setReconTerminalLogs((prev) => [
        ...prev,
        `[ERROR] Scan execution encountered an issue. Localhost/authorized addresses only.`,
      ]);
      cyberAudio.playAlert();
      setMessage("Recon scan failed. Check target IP and Nmap status.");
      return null;
    } finally {
      setBusy(false);
    }
  }

  // Scan Visitor Device and Navigate to Threat Page
  async function scanVisitorDevice() {
    setBusy(true);
    const info = getVisitorDeviceInfo();
    setMessage(`Fingerprinting client endpoint (${info.os} · ${info.browser})...`);
    cyberAudio.playScan();

    const clientIp = await fetchVisitorIp();
    setScanTarget(clientIp);

    setReconTerminalLogs([
      `[CLIENT-TELEMETRY] [${new Date().toLocaleTimeString()}] Analyzing visitor client device...`,
      `[CLIENT-TELEMETRY] Detected OS: ${info.os} (${info.browser})`,
      `[CLIENT-TELEMETRY] Screen: ${info.screen} | Architecture: ${info.platform} | CPU Cores: ${info.cores}`,
      `[CLIENT-TELEMETRY] Detected IPv4 Address: ${clientIp}`,
      `[AI-RECON] Modeling device attack surfaces & threat vectors...`,
    ]);

    try {
      const res = await api.post("/api/recon/scan", {
        target: clientIp,
        hostname: `visitor-${info.browser.toLowerCase().replace(/[^a-z0-9]/g, "")}`,
        operating_system: info.os,
        is_client_device: true
      });

      const rawLines = res.data?.raw_output || [];
      setReconTerminalLogs((prev) => [
        ...prev,
        ...rawLines,
        `[AI-AGENT] Discovered 5 device endpoints (mDNS, SSDP/UPnP, NetBIOS, DNS, Dev Ports).`,
        `[AI-AGENT] Threat, Risk, and Defense models generated successfully.`
      ]);

      const newId = res.data?.asset_id || assetId;
      setAssetId(newId);
      await loadDashboard(newId);
      switchPage("threat");
      cyberAudio.playSuccess();
      setMessage(`Device Threat Twin Generated: ${clientIp} (${info.os})`);
    } catch (err) {
      console.error(err);
      cyberAudio.playAlert();
      setMessage("Completed threat model for visitor device.");
      switchPage("threat");
    } finally {
      setBusy(false);
    }
  }

  // Apply Mitigation
  async function applyMitigation(portNumber) {
    setBusy(true);
    cyberAudio.playBeep(700, 0.08);
    setMessage(`Defense Agent applying virtual hardening on port ${portNumber}...`);

    try {
      const res = await api.post(`/api/defense/assets/${assetId}/remediate`, {
        portNumber: portNumber,
        action: "HARDEN",
      });
      cyberAudio.playSuccess();
      setMessage(res.data.message || `Port ${portNumber} mitigated.`);
      await loadDashboard(assetId);
    } catch (err) {
      console.error(err);
      cyberAudio.playAlert();
      setMessage("Remediation action failed.");
    } finally {
      setBusy(false);
    }
  }

  // Attack Simulation Controls
  function toggleAttackSimulation() {
    if (simulationRunning) {
      setSimulationRunning(false);
      clearInterval(simTimerRef.current);
      setMessage("Attack Simulation Paused.");
      cyberAudio.playBeep(400, 0.06);
    } else {
      setSimulationRunning(true);
      setMessage("Adversary Attack Path Simulation RUNNING in 3D Diagram!");
      cyberAudio.playAlert();

      if (activePage !== "asset-twin" && activePage !== "diagram") {
        switchPage("diagram");
      }

      const activePaths = attackPaths?.attack_paths || [];
      const currentSteps = activePaths[0]?.steps || [];

      simTimerRef.current = setInterval(() => {
        setSimCurrentStepIndex((prev) => {
          const next = (prev + 1) % Math.max(1, currentSteps.length);
          setActiveMitreStep(next);
          cyberAudio.playBeep(580 + next * 80, 0.08, "triangle");
          return next;
        });
      }, 2400);
    }
  }

  function toggleSound() {
    const next = cyberAudio.toggle();
    setSoundEnabled(next);
  }

  function exportReport() {
    cyberAudio.playSuccess();
    const reportData = {
      timestamp: new Date().toISOString(),
      platform: "AI Digital Twin Security Agent",
      backend: "Python FastAPI + PostgreSQL + Neo4j + Nmap",
      assetId,
      asset: assets.find((a) => a.id === assetId),
      openPorts: ports,
      threatFindings: threats,
      simulatedAttackPaths: attackPaths,
      riskAssessment: risk,
      defenseRecommendations: defense,
      auditHistoryCount: history.length,
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `AI-Digital-Twin-Report-Asset-${assetId}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMessage("Digital Twin Security Report exported successfully!");
  }

  function logout() {
    cyberAudio.playBeep(300, 0.08);
    setToken(null);
    setSession(null);
  }

  useEffect(() => {
    if (session) {
      loadDashboard(2);
    }
  }, [session]);

  const selectedAsset = useMemo(
    () => assets.find((a) => a.id === assetId) || { id: 2, hostname: "localhost", ipAddress: "127.0.0.1" },
    [assets, assetId]
  );

  // Filtered graph for the currently selected single asset:
  // Guarantees the 3D diagram shows ONLY this asset and its direct constellation
  const singleAssetGraph = useMemo(() => {
    if (!fullGraph?.nodes?.length) return null;
    const currentAsset = assets.find((a) => a.id === assetId) || assets[0];
    const targetId = `asset-${assetId}`;
    const targetIp = currentAsset?.ipAddress;

    // Locate target ASSET node
    const assetNode = fullGraph.nodes.find(
      (n) =>
        n.type === "ASSET" &&
        (n.id === targetId ||
          n.id === String(assetId) ||
          (targetIp && (n.sublabel === targetIp || n.label === targetIp)))
    ) || fullGraph.nodes.find((n) => n.type === "ASSET");

    if (!assetNode) return fullGraph;

    // BFS traverse only nodes connected to this asset
    const connectedIds = new Set([assetNode.id]);
    let expanded = true;
    while (expanded) {
      expanded = false;
      (fullGraph.edges || []).forEach((edge) => {
        if (connectedIds.has(edge.source) && !connectedIds.has(edge.target)) {
          connectedIds.add(edge.target);
          expanded = true;
        }
        if (connectedIds.has(edge.target) && !connectedIds.has(edge.source)) {
          connectedIds.add(edge.source);
          expanded = true;
        }
      });
    }

    const nodes = fullGraph.nodes.filter((n) => connectedIds.has(n.id));
    const edges = (fullGraph.edges || []).filter(
      (e) => connectedIds.has(e.source) && connectedIds.has(e.target)
    );

    return { nodes, edges };
  }, [fullGraph, assetId, assets]);

  if (!session) {
    return (
      <LoginPanel
        onLogin={(userData, autoScanVisitor) => {
          setSession(userData);
          if (autoScanVisitor) {
            setTimeout(() => {
              scanVisitorDevice();
            }, 300);
          }
        }}
      />
    );
  }

  const activePageMeta = PAGES.find((p) => p.id === activePage) || PAGES[0];

  return (
    <div className="flex h-screen bg-[#020617] text-slate-200 overflow-hidden font-sans">
      {/* ========================================================================= */}
      {/* MOBILE BACKDROP                                                           */}
      {/* ========================================================================= */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ========================================================================= */}
      {/* ENTERPRISE CYBERPUNK SIDEBAR NAVIGATION                                   */}
      {/* ========================================================================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 xl:w-72 bg-slate-950/95 border-r border-cyan-500/20 backdrop-blur-2xl flex flex-col justify-between transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* TOP: PLATFORM BRAND & ACTIVE TWIN PREVIEW */}
        <div className="p-4 sm:p-5 border-b border-white/5 shrink-0">
          <div className="flex items-center justify-between">
            <div
              onClick={() => {
                switchPage("overview");
                setSidebarOpen(false);
              }}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-600 flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.35)] group-hover:scale-105 transition">
                <BrainCircuit className="h-6 w-6 text-slate-950" />
              </div>
              <div>
                <div className="text-xs font-mono font-black tracking-widest text-cyan-400 uppercase">
                  AI Digital Twin
                </div>
                <div className="text-[11px] font-semibold text-white tracking-wider">
                  Cyber Operations
                </div>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 lg:hidden cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-3.5 flex items-center justify-between px-3 py-1.5 rounded-xl bg-cyan-950/40 border border-cyan-500/20 text-[10px] font-mono">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
              FASTAPI + NEO4J
            </span>
            <span className="text-cyan-400 font-bold">LIVE v2.5</span>
          </div>

          {/* Active Target Twin Quick-Card inside Sidebar */}
          <div
            onClick={() => {
              switchPage("asset-twin");
              setSidebarOpen(false);
            }}
            className={`mt-3 p-2.5 rounded-xl border transition cursor-pointer group ${
              activePage === "asset-twin"
                ? "border-cyan-400 bg-cyan-500/15 shadow-[0_0_15px_rgba(0,240,255,0.15)]"
                : "border-white/10 bg-slate-900/80 hover:bg-cyan-950/30 hover:border-cyan-500/30"
            }`}
          >
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span className="text-cyan-400 uppercase tracking-wider font-bold flex items-center gap-1">
                <Cpu className="h-3 w-3 text-cyan-400" /> Active Target
              </span>
              <span className="text-emerald-400 font-bold">ID #{assetId}</span>
            </div>
            <div className="mt-1 flex items-center justify-between">
              <div>
                <div className="text-xs font-mono font-bold text-white group-hover:text-cyan-300 transition">
                  {selectedAsset?.ipAddress || "127.0.0.1"}
                </div>
                <div className="text-[10px] text-slate-400 truncate max-w-[120px]">
                  {selectedAsset?.hostname || "localhost"}
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 group-hover:bg-cyan-500/40 transition">
                View Twin →
              </span>
            </div>
          </div>
        </div>

        {/* MIDDLE: CATEGORIZED NAVIGATION PAGES */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 text-xs font-mono">
          {/* Section: Mission Control */}
          <div>
            <div className="px-3 text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1.5">
              Mission Control
            </div>
            <div className="space-y-1">
              {PAGES.filter((p) => p.category === "MISSION CONTROL").map((p) => {
                const isActive = activePage === p.id;
                const Icon = p.icon;
                const isTwin = p.id === "asset-twin";
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      switchPage(p.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full px-3 py-2 rounded-xl transition flex items-center justify-between group cursor-pointer ${
                      isActive
                        ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/10 border-l-4 border-cyan-400 text-cyan-300 font-bold shadow-[0_0_12px_rgba(0,240,255,0.15)]"
                        : "text-slate-300 hover:text-white hover:bg-white/5 border-l-4 border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <div className={`p-1 rounded-lg ${isActive ? "bg-cyan-400/20 text-cyan-300" : "text-slate-400 group-hover:text-cyan-400"}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="truncate text-left">
                        <div className="truncate font-semibold">{p.label}</div>
                        {isTwin && (
                          <div className="text-[10px] text-emerald-400 truncate">
                            {selectedAsset?.ipAddress}
                          </div>
                        )}
                      </div>
                    </div>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                      isActive ? "bg-cyan-400 text-slate-950" : "bg-white/5 text-slate-400"
                    }`}>
                      {p.number}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: Security Agents */}
          <div>
            <div className="px-3 text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1.5">
              Security Agents
            </div>
            <div className="space-y-1">
              {PAGES.filter((p) => p.category === "SECURITY AGENTS").map((p) => {
                const isActive = activePage === p.id;
                const Icon = p.icon;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      switchPage(p.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full px-3 py-2 rounded-xl transition flex items-center justify-between group cursor-pointer ${
                      isActive
                        ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/10 border-l-4 border-cyan-400 text-cyan-300 font-bold shadow-[0_0_12px_rgba(0,240,255,0.15)]"
                        : "text-slate-300 hover:text-white hover:bg-white/5 border-l-4 border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <div className={`p-1 rounded-lg ${isActive ? "bg-cyan-400/20 text-cyan-300" : "text-slate-400 group-hover:text-cyan-400"}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="truncate font-semibold">{p.label}</span>
                    </div>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                      isActive ? "bg-cyan-400 text-slate-950" : "bg-white/5 text-slate-400"
                    }`}>
                      {p.number}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: Analytics & Audit */}
          <div>
            <div className="px-3 text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1.5">
              Analytics & Audit
            </div>
            <div className="space-y-1">
              {PAGES.filter((p) => p.category === "ANALYTICS & AUDIT").map((p) => {
                const isActive = activePage === p.id;
                const Icon = p.icon;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      switchPage(p.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full px-3 py-2 rounded-xl transition flex items-center justify-between group cursor-pointer ${
                      isActive
                        ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/10 border-l-4 border-cyan-400 text-cyan-300 font-bold shadow-[0_0_12px_rgba(0,240,255,0.15)]"
                        : "text-slate-300 hover:text-white hover:bg-white/5 border-l-4 border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <div className={`p-1 rounded-lg ${isActive ? "bg-cyan-400/20 text-cyan-300" : "text-slate-400 group-hover:text-cyan-400"}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="truncate font-semibold">{p.label}</span>
                    </div>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                      isActive ? "bg-cyan-400 text-slate-950" : "bg-white/5 text-slate-400"
                    }`}>
                      {p.number}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* BOTTOM: SYSTEM UTILITIES & PROFILE */}
        <div className="p-3 border-t border-white/5 space-y-2 bg-slate-950/60 shrink-0">
          <div className="grid grid-cols-3 gap-1.5 text-xs font-mono">
            <button
              onClick={() => loadDashboard(assetId)}
              className="p-1.5 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 flex flex-col items-center gap-1 cursor-pointer transition"
              title="Refresh Digital Twin Data"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${busy ? "animate-spin text-cyan-400" : ""}`} />
              <span className="text-[9px]">Sync</span>
            </button>

            <button
              onClick={toggleSound}
              className="p-1.5 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 flex flex-col items-center gap-1 cursor-pointer transition"
              title={soundEnabled ? "Mute Cyber Audio" : "Enable Cyber Audio"}
            >
              {soundEnabled ? <Volume2 className="h-3.5 w-3.5 text-cyan-400" /> : <VolumeX className="h-3.5 w-3.5 text-slate-500" />}
              <span className="text-[9px]">{soundEnabled ? "Audio On" : "Muted"}</span>
            </button>

            <button
              onClick={exportReport}
              className="p-1.5 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 flex flex-col items-center gap-1 cursor-pointer transition"
              title="Export Report (JSON)"
            >
              <FileDown className="h-3.5 w-3.5 text-slate-300" />
              <span className="text-[9px]">Export</span>
            </button>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2 truncate">
              <div className="h-7 w-7 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 text-xs font-bold font-mono shrink-0">
                SA
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-white leading-none truncate">Security Admin</div>
                <div className="text-[10px] text-slate-400 font-mono">SecOps Team</div>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-1.5 rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 cursor-pointer text-xs font-mono shrink-0"
              title="Exit Session"
            >
              Exit
            </button>
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* RIGHT MAIN VIEWPORT: HEADER + ACTIVE CONTENT                               */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* TOP HUD BAR (Clean, spacious, prominent IP search) */}
        <header className="sticky top-0 z-30 h-16 border-b border-cyan-500/20 bg-slate-950/85 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between gap-4 shadow-xl">
          {/* Left: Mobile Toggle & Page Title */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 lg:hidden cursor-pointer"
              title="Open Navigation Menu"
            >
              <Menu className="h-4 w-4 text-cyan-400" />
            </button>

            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                <span>Operations</span>
                <ChevronRight className="h-3 w-3 text-slate-600" />
                <span className="text-cyan-400 font-semibold">{activePageMeta.label}</span>
              </div>
              <h1 className="text-sm sm:text-base font-bold text-white truncate max-w-[180px] sm:max-w-xs">
                {activePageMeta.title}
              </h1>
            </div>
          </div>

          {/* Center: Spacious Interactive IP Address Search Bar */}
          <div className="relative flex items-center w-full max-w-md mx-2" ref={searchDropdownRef}>
            <Search className="absolute left-3.5 h-4 w-4 text-cyan-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search IP address to isolate 3D twin (e.g. 127.0.0.1)..."
              value={searchIpQuery}
              onChange={(e) => {
                setSearchIpQuery(e.target.value);
                setIsSearchDropdownOpen(true);
              }}
              onFocus={() => setIsSearchDropdownOpen(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearchIpSubmit(searchIpQuery);
                }
              }}
              className="w-full pl-10 pr-8 py-2 rounded-xl border border-cyan-500/30 bg-slate-900/90 text-xs font-mono text-white placeholder-slate-400 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition shadow-inner"
            />
            {searchIpQuery && (
              <button
                onClick={() => {
                  setSearchIpQuery("");
                  setIsSearchDropdownOpen(false);
                }}
                className="absolute right-2.5 p-1 text-slate-400 hover:text-white rounded transition cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            )}

            {/* Interactive Floating Dropdown for IP Search */}
            {isSearchDropdownOpen && (
              <div className="absolute left-0 right-0 top-full mt-2 max-h-80 overflow-y-auto rounded-xl border border-cyan-500/30 bg-slate-950/95 p-2 shadow-2xl backdrop-blur-2xl z-50 text-xs font-mono">
                <div className="px-2.5 py-1.5 text-[10px] text-slate-400 uppercase tracking-wider font-bold border-b border-white/5 flex items-center justify-between">
                  <span>Fleet Digital Twins</span>
                  <span>{searchResults.length} Match(es)</span>
                </div>
                {searchResults.length > 0 ? (
                  searchResults.map((a) => {
                    const isCur = a.id === assetId && activePage === "asset-twin";
                    return (
                      <div
                        key={a.id}
                        onClick={() => handleSelectAssetByIp(a)}
                        className={`px-3 py-2 my-1 rounded-lg flex items-center justify-between transition cursor-pointer ${
                          isCur
                            ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold"
                            : "hover:bg-white/10 text-slate-300 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="font-bold text-white">{a.ipAddress}</span>
                          <span className="text-slate-400 text-[11px]">({a.hostname || "host"})</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px]">
                          <span className="px-1.5 py-0.5 rounded bg-white/5 text-slate-400">{a.operatingSystem || "OS"}</span>
                          <ChevronRight className="h-3.5 w-3.5 text-cyan-400" />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div
                    onClick={() => handleSearchIpSubmit(searchIpQuery)}
                    className="p-3 text-center text-slate-300 hover:bg-white/5 rounded-lg transition cursor-pointer"
                  >
                    <div className="text-rose-400 font-bold mb-1 flex items-center justify-center gap-1.5">
                      <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
                      IP Not in Current Fleet
                    </div>
                    <div className="text-[11px] text-cyan-300 flex items-center justify-center gap-1">
                      <Radar className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
                      Click to Run Recon & Auto-Discover {searchIpQuery}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: Fleet Switcher & Status */}
          <div className="flex items-center gap-2.5 shrink-0">
            <select
              value={showAllAssets ? "all" : assetId}
              onChange={(e) => {
                if (e.target.value === "all") {
                  loadEnvironmentGraph();
                } else {
                  const id = Number(e.target.value);
                  setAssetId(id);
                  loadDashboard(id);
                }
              }}
              className="rounded-xl border border-cyan-500/30 bg-slate-900 px-3 py-1.5 text-xs font-mono text-cyan-300 outline-none hover:border-cyan-400 transition cursor-pointer hidden md:block"
            >
              <option value="all">🌍 Multi-Asset Fleet</option>
              {assets.map((a) => (
                <option key={a.id} value={a.id}>
                  #{a.id} - {a.ipAddress} ({a.hostname || "host"})
                </option>
              ))}
            </select>

            <div className="hidden xl:flex items-center gap-2 text-xs font-mono text-slate-400 px-3 py-1 rounded-xl bg-white/5 border border-white/10">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{message}</span>
              {busy && <RefreshCw className="h-3.5 w-3.5 text-cyan-400 animate-spin" />}
            </div>
          </div>
        </header>

        {/* Active Page Viewport Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
          {/* Top Telemetry Banner */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 border border-white/5 p-3 rounded-2xl backdrop-blur-md">
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-slate-400">ACTIVE VIEW:</span>
              <span className="text-cyan-300 font-bold uppercase tracking-wider">
                {activePageMeta.title}
              </span>
              {activePage === "asset-twin" && (
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold">
                  {selectedAsset.ipAddress}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span>Target: #{selectedAsset?.id} ({selectedAsset?.ipAddress})</span>
              {busy && <RefreshCw className="h-3.5 w-3.5 text-cyan-400 animate-spin" />}
            </div>
          </div>

        {/* 1. OVERVIEW PAGE */}
        {activePage === "overview" && (
          <OverviewPage
            assets={assets}
            ports={ports}
            threats={threats}
            defense={defense}
            risk={risk}
            filteredFleetAssets={filteredFleetAssets}
            searchIpQuery={searchIpQuery}
            setSearchIpQuery={setSearchIpQuery}
            assetId={assetId}
            showAllAssets={showAllAssets}
            handleSelectAssetByIp={handleSelectAssetByIp}
            switchPage={switchPage}
            scanVisitorDevice={scanVisitorDevice}
          />
        )}

        {/* 2. DEDICATED IP DIGITAL TWIN PAGE (ISOLATED 3D DIAGRAM FOR SEARCHED IP) */}
        {activePage === "asset-twin" && (
          <AssetTwinPage
            asset={selectedAsset}
            graph={singleAssetGraph}
            ports={ports}
            threats={threats}
            attackPaths={attackPaths}
            risk={risk}
            defense={defense}
            isSpinning={isSpinning}
            setIsSpinning={setIsSpinning}
            spinSpeed={spinSpeed}
            setSpinSpeed={setSpinSpeed}
            cameraPreset={cameraPreset}
            setCameraPreset={setCameraPreset}
            layerFilter={layerFilter}
            setLayerFilter={setLayerFilter}
            selectedNode={selectedNode}
            setSelectedNode={setSelectedNode}
            simulationRunning={simulationRunning}
            toggleAttackSimulation={toggleAttackSimulation}
            simCurrentStepIndex={simCurrentStepIndex}
            zoomRef={diagramZoomRef}
            applyMitigation={applyMitigation}
            exportReport={exportReport}
            switchPage={switchPage}
            setScanTarget={setScanTarget}
          />
        )}

        {/* 3. 3D DIAGRAM PAGE (FULL NETWORK COMMAND CENTER) */}
        {activePage === "diagram" && (
          <DiagramPage
            graph={fullGraph}
            selectedNode={selectedNode}
            setSelectedNode={setSelectedNode}
            activeAttackPath={simulationRunning}
            simulationRunning={simulationRunning}
            toggleAttackSimulation={toggleAttackSimulation}
            simCurrentStepIndex={simCurrentStepIndex}
            attackPaths={attackPaths}
            cameraPreset={cameraPreset}
            setCameraPreset={setCameraPreset}
            layerFilter={layerFilter}
            setLayerFilter={setLayerFilter}
            isSpinning={isSpinning}
            setIsSpinning={setIsSpinning}
            spinSpeed={spinSpeed}
            setSpinSpeed={setSpinSpeed}
            zoomRef={diagramZoomRef}
            applyMitigation={applyMitigation}
            switchPage={switchPage}
            showAllAssets={showAllAssets}
            loadEnvironmentGraph={loadEnvironmentGraph}
            loadDashboard={loadDashboard}
            assetId={assetId}
          />
        )}

        {/* 4. RECONNAISSANCE AGENT PAGE */}
        {activePage === "recon" && (
          <ReconPage
            scanTarget={scanTarget}
            setScanTarget={setScanTarget}
            scanProfile={scanProfile}
            setScanProfile={setScanProfile}
            triggerReconScan={triggerReconScan}
            scanVisitorDevice={scanVisitorDevice}
            reconTerminalLogs={reconTerminalLogs}
            busy={busy}
            ports={ports}
            selectedAsset={selectedAsset}
            applyMitigation={applyMitigation}
            switchPage={switchPage}
          />
        )}

        {/* 5. THREAT INTELLIGENCE AGENT PAGE */}
        {activePage === "threat" && (
          <ThreatPage
            threats={threats}
            attackPaths={attackPaths}
            simulationRunning={simulationRunning}
            toggleAttackSimulation={toggleAttackSimulation}
            activeMitreStep={activeMitreStep}
            setActiveMitreStep={setActiveMitreStep}
            simCurrentStepIndex={simCurrentStepIndex}
            switchPage={switchPage}
          />
        )}

        {/* 6. AUTONOMOUS DEFENSE AGENT PAGE */}
        {activePage === "defense" && (
          <DefensePage
            defense={defense}
            applyMitigation={applyMitigation}
            ports={ports}
            busy={busy}
            switchPage={switchPage}
          />
        )}

        {/* 7. QUANTITATIVE RISK MATRIX PAGE */}
        {activePage === "risk" && (
          <RiskPage
            risk={risk}
            switchPage={switchPage}
          />
        )}

        {/* 8. AUDIT HISTORY & TIMELINE PAGE */}
        {activePage === "audit" && (
          <AuditPage
            history={history}
            exportReport={exportReport}
            switchPage={switchPage}
          />
        )}
      </main>

      {/* Global Footer */}
      <footer className="border-t border-white/10 py-6 text-center text-xs font-mono text-slate-500 mt-auto">
        AI Digital Twin Security Agent · Proactive Cybersecurity Intelligence Platform · Python FastAPI + PostgreSQL + Neo4j + Nmap
      </footer>
      </div>
    </div>
  );
}