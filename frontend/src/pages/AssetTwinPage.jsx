import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cpu,
  Server,
  ShieldCheck,
  Flame,
  Activity,
  Radar,
  RotateCcw,
  Play,
  Pause,
  ArrowLeft,
  ArrowRight,
  FileDown,
  Info,
  X,
  Copy,
  Check,
  TerminalSquare,
  Crosshair,
  AlertTriangle,
} from "lucide-react";
import NetworkScene from "../NetworkScene";
import { cyberAudio } from "../soundEffects";

export default function AssetTwinPage({
  asset,
  graph,
  ports,
  threats,
  attackPaths,
  risk,
  defense,
  isSpinning,
  setIsSpinning,
  spinSpeed,
  setSpinSpeed,
  cameraPreset,
  setCameraPreset,
  layerFilter,
  setLayerFilter,
  selectedNode,
  setSelectedNode,
  simulationRunning,
  toggleAttackSimulation,
  simCurrentStepIndex,
  zoomRef,
  applyMitigation,
  exportReport,
  switchPage,
  setScanTarget,
}) {
  const [activeSubTab, setActiveSubTab] = useState("ports");
  const [copiedCmd, setCopiedCmd] = useState(null);

  function copyCommand(cmd, key) {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(key);
    cyberAudio.playBeep(880, 0.04);
    setTimeout(() => setCopiedCmd(null), 2000);
  }

  const riskLevelBadge = (() => {
    const lvl = risk?.overallRiskLevel;
    if (lvl === "CRITICAL") return "text-rose-400 border-rose-500/30 bg-rose-500/10";
    if (lvl === "HIGH") return "text-orange-400 border-orange-500/30 bg-orange-500/10";
    if (lvl === "MEDIUM") return "text-amber-400 border-amber-500/30 bg-amber-500/10";
    return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
  })();

  const currentAsset = asset || {
    id: 2,
    hostname: "localhost",
    ipAddress: "127.0.0.1",
    operatingSystem: "Windows / Linux",
    criticality: "HIGH",
    isCrownJewel: true,
  };

  const activePaths = attackPaths?.attack_paths || [];
  const currentStep = activePaths[0]?.steps?.[simCurrentStepIndex] || activePaths[0]?.steps?.[0];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* ========================================================================= */}
      {/* 1. HERO BANNER: DEDICATED IP DIGITAL TWIN TELEMETRY                       */}
      {/* ========================================================================= */}
      <div className="relative overflow-hidden rounded-2xl border border-cyan-500/40 bg-gradient-to-br from-slate-950/95 via-slate-900/90 to-cyan-950/40 p-6 shadow-2xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 h-64 w-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 h-48 w-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 font-mono text-xs font-bold tracking-widest uppercase shadow-[0_0_12px_rgba(0,240,255,0.4)]">
                <Cpu className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
                Dedicated IP Digital Twin
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                Active Model
              </span>
              {currentAsset.isCrownJewel && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold">
                  Crown Jewel Asset
                </span>
              )}
            </div>

            <div className="mt-3 flex flex-wrap items-baseline gap-3">
              <h1 className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white flex items-center gap-2">
                <span className="text-cyan-400">{currentAsset.ipAddress}</span>
                <span className="text-xl sm:text-2xl font-normal text-slate-400 font-sans">
                  ({currentAsset.hostname || "Host Device"})
                </span>
              </h1>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-300">
              <span className="flex items-center gap-1.5">
                <Server className="h-3.5 w-3.5 text-cyan-400" />
                {currentAsset.operatingSystem || "Enterprise Linux / Windows"}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <Crosshair className="h-3.5 w-3.5 text-violet-400" />
                Criticality: <strong className="text-white">{currentAsset.criticality || "TIER-1 HIGH"}</strong>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <TerminalSquare className="h-3.5 w-3.5 text-emerald-400" />
                Asset ID: #{currentAsset.id}
              </span>
            </div>
          </div>

          {/* Quick Metric Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="p-3.5 rounded-xl border border-white/10 bg-slate-900/80 text-center min-w-[105px]">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Overall Risk</div>
              <div className={`text-xl font-mono font-black mt-0.5 ${riskLevelBadge}`}>
                {risk?.overallRiskScore ?? 57}/100
              </div>
              <div className="text-[10px] font-mono text-slate-400 uppercase">{risk?.overallRiskLevel || "MEDIUM"}</div>
            </div>

            <div className="p-3.5 rounded-xl border border-white/10 bg-slate-900/80 text-center min-w-[95px]">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Sockets</div>
              <div className="text-xl font-mono font-black text-cyan-300 mt-0.5">{ports.length}</div>
              <div className="text-[10px] font-mono text-emerald-400">Open & Monitored</div>
            </div>

            <div className="p-3.5 rounded-xl border border-white/10 bg-slate-900/80 text-center min-w-[95px]">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Threats</div>
              <div className="text-xl font-mono font-black text-rose-400 mt-0.5">{threats.length}</div>
              <div className="text-[10px] font-mono text-rose-400/80">Identified</div>
            </div>
          </div>
        </div>

        {/* Action Command Quick Bar */}
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setScanTarget(currentAsset.ipAddress);
                switchPage("recon");
                cyberAudio.playScan();
              }}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-cyan-500/15 border border-cyan-400/40 text-cyan-200 text-xs font-mono font-bold hover:bg-cyan-500/25 transition cursor-pointer shadow-md"
            >
              <Radar className="h-3.5 w-3.5 text-cyan-400" />
              Nmap Re-Scan {currentAsset.ipAddress}
            </button>

            <button
              onClick={toggleAttackSimulation}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-mono font-bold transition cursor-pointer shadow-md ${
                simulationRunning
                  ? "border-rose-500 bg-rose-500/25 text-rose-200 animate-pulse"
                  : "border-amber-400/40 bg-amber-400/15 text-amber-200 hover:bg-amber-400/25"
              }`}
            >
              {simulationRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              {simulationRunning ? "Pause Attack Vector" : "Simulate Attack on this IP"}
            </button>

            <button
              onClick={() => applyMitigation(ports[0]?.portNumber || 80)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-400/40 text-emerald-200 text-xs font-mono font-bold hover:bg-emerald-500/25 transition cursor-pointer shadow-md"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              Apply Virtual Hardening
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportReport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 text-slate-300 text-xs font-mono hover:bg-white/10 hover:text-white transition cursor-pointer"
            >
              <FileDown className="h-3.5 w-3.5 text-cyan-400" />
              Export IP Audit JSON
            </button>

            <button
              onClick={() => switchPage("overview")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 text-slate-300 text-xs font-mono hover:bg-white/10 hover:text-white transition cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-slate-400" />
              Fleet Overview
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. DEDICATED 3D HOLOGRAPHIC DIGITAL TWIN DIAGRAM FOR THIS IP              */}
      {/* ========================================================================= */}
      <div className="relative rounded-2xl border border-cyan-500/30 bg-slate-950/90 p-5 shadow-2xl backdrop-blur-xl">
        {/* Viewport Top Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-white/10 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                3D Constellation: {currentAsset.ipAddress}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                {graph?.nodes?.length || 0} Nodes · {graph?.edges?.length || 0} Relationships
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">
              Displaying ONLY nodes and security edges directly belonging to {currentAsset.ipAddress}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* 3D Spin Toggle */}
            <button
              onClick={() => setIsSpinning((prev) => !prev)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer ${
                isSpinning
                  ? "border-cyan-400/40 bg-cyan-400/15 text-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.3)]"
                  : "border-white/10 bg-white/5 text-slate-400 hover:text-white"
              }`}
            >
              <RotateCcw className={`h-3.5 w-3.5 ${isSpinning ? "animate-spin text-cyan-400" : ""}`} />
              {isSpinning ? "Spinning Active" : "Resume Spin"}
            </button>

            {/* Spin Speed Multiplier */}
            <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 text-[11px] font-mono">
              {[
                { label: "0.2x", speed: 0.15 },
                { label: "0.5x", speed: 0.35 },
                { label: "1.0x", speed: 0.75 },
                { label: "2.0x", speed: 1.5 },
              ].map((s) => (
                <button
                  key={s.label}
                  onClick={() => {
                    setSpinSpeed(s.speed);
                    setIsSpinning(true);
                    cyberAudio.playBeep(500 + s.speed * 200, 0.03);
                  }}
                  className={`px-2 py-0.5 rounded-lg transition cursor-pointer ${
                    spinSpeed === s.speed && isSpinning
                      ? "bg-cyan-400 text-slate-950 font-bold"
                      : "text-slate-400 hover:text-white"
                  }`}
                  title={`Set 3D Spin Speed to ${s.label}`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Layer Filters */}
            <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 text-[11px] font-mono">
              {[
                { id: "ALL", label: "All" },
                { id: "SERVICE", label: "Services" },
                { id: "THREAT", label: "Threats" },
                { id: "RISK", label: "Risks" },
                { id: "RECOMMENDATION", label: "Defense" },
              ].map((layer) => (
                <button
                  key={layer.id}
                  onClick={() => {
                    setLayerFilter(layer.id);
                    cyberAudio.playBeep(layer.id === "ALL" ? 440 : 600, 0.04);
                  }}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    layerFilter === layer.id
                      ? "bg-cyan-400 text-slate-950 font-bold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {layer.label}
                </button>
              ))}
            </div>

            {/* Camera Presets */}
            <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 text-[11px] font-mono">
              <button
                onClick={() => setCameraPreset("overview")}
                className={`px-2 py-1 rounded-lg ${cameraPreset === "overview" ? "bg-white/10 text-cyan-300 font-bold" : "text-slate-400"}`}
              >
                Orbit
              </button>
              <button
                onClick={() => setCameraPreset("isometric")}
                className={`px-2 py-1 rounded-lg ${cameraPreset === "isometric" ? "bg-white/10 text-cyan-300 font-bold" : "text-slate-400"}`}
              >
                Isometric
              </button>
              <button
                onClick={() => setCameraPreset("topdown")}
                className={`px-2 py-1 rounded-lg ${cameraPreset === "topdown" ? "bg-white/10 text-cyan-300 font-bold" : "text-slate-400"}`}
              >
                Top-Down
              </button>
            </div>

            {/* 3D Zoom Controls */}
            <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 text-xs font-mono">
              <span className="text-[10px] text-slate-500 uppercase px-1 hidden sm:inline">Zoom</span>
              <button
                type="button"
                onClick={() => {
                  zoomRef?.current?.zoomIn();
                  cyberAudio.playBeep(700, 0.04);
                }}
                className="h-6 w-6 rounded-lg bg-white/5 hover:bg-cyan-400/20 text-cyan-300 hover:text-white flex items-center justify-center font-bold text-base transition cursor-pointer border border-white/10 hover:border-cyan-400/50"
                title="Zoom In (+)"
              >
                +
              </button>
              <button
                type="button"
                onClick={() => {
                  zoomRef?.current?.zoomOut();
                  cyberAudio.playBeep(500, 0.04);
                }}
                className="h-6 w-6 rounded-lg bg-white/5 hover:bg-cyan-400/20 text-cyan-300 hover:text-white flex items-center justify-center font-bold text-base transition cursor-pointer border border-white/10 hover:border-cyan-400/50"
                title="Zoom Out (-)"
              >
                &minus;
              </button>
            </div>
          </div>
        </div>

        {/* 3D Canvas Viewport */}
        <div className="relative w-full h-[580px] rounded-2xl overflow-hidden border border-cyan-500/25 bg-slate-950/80 shadow-2xl">
          <NetworkScene
            graph={graph}
            selectedNode={selectedNode}
            onSelectNode={(node) => {
              setSelectedNode(node);
              cyberAudio.playBeep(640, 0.06);
            }}
            activeAttackPath={simulationRunning}
            simulationRunning={simulationRunning}
            cameraPreset={cameraPreset}
            layerFilter={layerFilter}
            isSpinning={isSpinning}
            spinSpeed={spinSpeed}
            zoomRef={zoomRef}
          />

          {/* In-Diagram Simulation Banner */}
          <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2">
            <button
              onClick={toggleAttackSimulation}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-mono text-xs font-bold transition shadow-xl cursor-pointer ${
                simulationRunning
                  ? "border-rose-500 bg-rose-500/30 text-rose-200 shadow-[0_0_20px_rgba(244,63,94,0.6)] animate-pulse"
                  : "border-amber-400/40 bg-amber-400/15 text-amber-200 hover:bg-amber-400/25"
              }`}
            >
              {simulationRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {simulationRunning ? "Pause Attack Simulation" : "Simulate Adversary Attack in 3D"}
            </button>

            {simulationRunning && currentStep && (
              <div className="bg-slate-950/90 border border-rose-500/50 px-3.5 py-2 rounded-xl text-xs font-mono text-rose-300 flex items-center gap-2 backdrop-blur-md shadow-xl">
                <Flame className="h-4 w-4 text-rose-500 animate-pulse" />
                <span>STEP {simCurrentStepIndex + 1}: {currentStep.name}</span>
              </div>
            )}
          </div>

          {/* Floating 3D Node Inspector Card */}
          <AnimatePresence>
            {selectedNode && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute bottom-6 right-6 z-20 w-88 rounded-2xl border border-cyan-400/50 bg-slate-950/95 p-4 shadow-2xl backdrop-blur-xl"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
                  <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Info className="h-3.5 w-3.5" /> {selectedNode.type} Node Inspector
                  </span>
                  <button
                    onClick={() => setSelectedNode(null)}
                    className="text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="text-base font-bold text-white">{selectedNode.label}</div>
                <div className="text-xs font-mono text-slate-300">{selectedNode.sublabel}</div>

                {selectedNode.type === "SERVICE" && (
                  <div className="mt-3 space-y-2 text-xs font-mono">
                    <div className="flex justify-between text-slate-400">
                      <span>Port Number:</span>
                      <span className="text-cyan-300 font-bold">{selectedNode.label}/TCP</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Service State:</span>
                      <span className="text-emerald-400 font-bold">ACTIVE & OPEN</span>
                    </div>
                    <button
                      onClick={() => applyMitigation(Number(selectedNode.label))}
                      className="w-full mt-2 py-2 rounded-xl bg-cyan-400/20 border border-cyan-400/40 text-cyan-200 font-bold hover:bg-cyan-400/30 transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <ShieldCheck className="h-4 w-4" /> Apply Virtual Hardening
                    </button>
                  </div>
                )}

                {selectedNode.type === "THREAT" && (
                  <div className="mt-3 text-xs space-y-2">
                    <div className="flex justify-between font-mono">
                      <span className="text-slate-400">Severity:</span>
                      <span className="text-rose-400 font-bold">{selectedNode.severity || "MEDIUM"}</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      Threat Agent identified active exploit vector against this socket.
                    </p>
                  </div>
                )}

                {selectedNode.type === "RISK" && (
                  <div className="mt-3 text-xs space-y-2">
                    <div className="flex justify-between font-mono">
                      <span className="text-slate-400">Risk Score:</span>
                      <span className="text-amber-400 font-bold">{selectedNode.riskScore ?? 57}/100</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      Evaluated by AI Risk Agent based on asset criticality and proximity to core crown jewels.
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom Legend */}
          <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
            <div className="pointer-events-auto flex flex-wrap gap-2 text-[11px] font-mono text-slate-300 bg-slate-950/85 p-2 rounded-xl border border-white/10 backdrop-blur-md">
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff]" /> Asset ({currentAsset.ipAddress})</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-sky-400" /> Sockets</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e]" /> Threats</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-amber-400" /> Risks</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#00ff9d]" /> Defense</span>
            </div>

            <div className="pointer-events-auto text-xs font-mono text-slate-300 bg-slate-950/85 px-3 py-1.5 rounded-xl border border-white/10 backdrop-blur-md flex items-center gap-3">
              <span className="text-cyan-400 flex items-center gap-1">
                <RotateCcw className={`h-3 w-3 ${isSpinning ? "animate-spin" : ""}`} />
                {isSpinning ? "3D Rotation Active" : "Rotation Paused"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. TECHNICAL DEEP-DIVE SUB-TABS SPECIFICALLY FOR THIS IP                  */}
      {/* ========================================================================= */}
      <div className="rounded-2xl border border-white/10 bg-slate-950/90 p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4 mb-6">
          <div>
            <h2 className="text-xl font-black text-white tracking-wide flex items-center gap-2">
              <Activity className="h-5 w-5 text-cyan-400" />
              Technical Diagnostics: {currentAsset.ipAddress}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">
              In-depth socket telemetry, threats, attack simulation, and defenses for this asset
            </p>
          </div>

          {/* Sub-Tab Navigation Pills */}
          <div className="flex flex-wrap items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 text-xs font-mono">
            {[
              { id: "ports", label: `Sockets & Ports (${ports.length})`, icon: Server },
              { id: "threats", label: `Threats & CVEs (${threats.length})`, icon: AlertTriangle },
              { id: "attack", label: "Attack Path Kill-Chain", icon: Flame },
              { id: "defense", label: `Mitigation Playbooks (${defense?.recommendations?.length || 0})`, icon: ShieldCheck },
              { id: "risk", label: "Risk Breakdown", icon: Activity },
            ].map((t) => {
              const Icon = t.icon;
              const active = activeSubTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setActiveSubTab(t.id);
                    cyberAudio.playBeep(active ? 440 : 560, 0.03);
                  }}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                    active
                      ? "bg-cyan-400 text-slate-950 font-bold shadow-md"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* SUB-TAB 1: SOCKETS & PORTS */}
        {activeSubTab === "ports" && (
          <div className="space-y-4 animate-fadeIn">
            <div className="rounded-xl border border-white/10 overflow-hidden bg-slate-950/60 shadow-xl">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-white/5 text-slate-400 border-b border-white/10">
                  <tr>
                    <th className="p-3">Port / Protocol</th>
                    <th className="p-3">Service Name</th>
                    <th className="p-3">Socket State</th>
                    <th className="p-3">Daemon Banner</th>
                    <th className="p-3 text-right">Defense Remediation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {ports.map((p) => (
                    <tr key={p.id} className="hover:bg-white/[0.03] transition">
                      <td className="p-3 font-bold text-cyan-300">{p.portNumber}/{p.protocol}</td>
                      <td className="p-3 text-white font-bold">{p.serviceName || "unknown"}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-[11px]">
                          {p.state}
                        </span>
                      </td>
                      <td className="p-3 text-slate-400 max-w-xs truncate">{p.product || "Standard Network Daemon"}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => applyMitigation(p.portNumber)}
                          className="px-2.5 py-1 rounded-lg bg-cyan-400/15 border border-cyan-400/30 text-cyan-300 hover:bg-cyan-400/25 transition cursor-pointer text-[11px] font-bold"
                        >
                          Harden Port {p.portNumber}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {!ports.length && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500">
                        No open ports detected on {currentAsset.ipAddress}. Trigger an Nmap scan to discover services.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUB-TAB 2: THREATS & CVEs */}
        {activeSubTab === "threats" && (
          <div className="space-y-4 animate-fadeIn">
            <div className="grid md:grid-cols-2 gap-4">
              {threats.map((t, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-rose-500/25 bg-rose-500/5 hover:border-rose-500/40 transition">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">
                      {t.category}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-rose-500/20 border border-rose-500/30 text-rose-300 font-mono text-[10px] font-bold">
                      {t.severity || "HIGH"}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-white mt-1.5">{t.cveId || "EXPLOIT-VECTOR-01"}</div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{t.description}</p>
                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/5 text-[11px] font-mono text-slate-400">
                    <span>Target Port: <strong className="text-cyan-300">{t.portNumber || "80"}</strong></span>
                    <span>CVSS v3.1: <strong className="text-amber-300">{t.cvssScore ?? "7.5"}</strong></span>
                  </div>
                </div>
              ))}
              {!threats.length && (
                <div className="col-span-2 p-8 text-center text-slate-500 border border-white/5 rounded-xl">
                  No critical threats mapped for this asset. System is currently aligned with baseline defense posture.
                </div>
              )}
            </div>
          </div>
        )}

        {/* SUB-TAB 3: ATTACK PATH KILL-CHAIN */}
        {activeSubTab === "attack" && (
          <div className="space-y-4 animate-fadeIn">
            <div className="p-4 rounded-xl border border-amber-500/25 bg-amber-500/5">
              <div className="text-xs font-mono text-amber-300 font-bold uppercase tracking-wider mb-2">
                Simulated Multi-Hop Threat Vector Targeting {currentAsset.ipAddress}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Graph-theoretic route calculated by the Threat Agent, demonstrating how an adversary leverages exposed entry points to target this machine.
              </p>
            </div>

            <div className="space-y-3">
              {(activePaths[0]?.steps || []).map((step, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-white/10 bg-slate-900/60 flex items-start gap-4">
                  <div className="h-8 w-8 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-mono font-bold text-sm flex items-center justify-center shrink-0">
                    0{idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-bold text-white">{step.name}</div>
                      <span className="text-xs font-mono text-rose-400 font-bold">{step.tactic || "MITRE ATT&CK"}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{step.description}</p>
                    <div className="mt-2 text-[11px] font-mono text-cyan-300">
                      Target Technique: {step.techniqueId || "T1190"} · Exploited Port: {step.port || "Open Socket"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUB-TAB 4: DEFENSE PLAYBOOKS */}
        {activeSubTab === "defense" && (
          <div className="space-y-4 animate-fadeIn">
            {(defense?.recommendations || []).map((rec, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-emerald-500/20 bg-slate-900/70 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    {rec.title}
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                    {rec.priority || "P1 - URGENT"}
                  </span>
                </div>
                <p className="text-xs text-slate-300">{rec.description}</p>

                {rec.command && (
                  <div className="relative mt-2">
                    <div className="flex items-center justify-between bg-slate-950 px-3 py-1.5 rounded-t-lg border-t border-x border-white/10 text-[10px] font-mono text-slate-400">
                      <span>Remediation CLI Command</span>
                      <button
                        onClick={() => copyCommand(rec.command, `rec-${idx}`)}
                        className="text-cyan-400 hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        {copiedCmd === `rec-${idx}` ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                        <span>{copiedCmd === `rec-${idx}` ? "Copied" : "Copy"}</span>
                      </button>
                    </div>
                    <pre className="p-3 bg-slate-950/90 rounded-b-lg border border-white/10 text-xs font-mono text-emerald-300 overflow-x-auto">
                      <code>{rec.command}</code>
                    </pre>
                  </div>
                )}
              </div>
            ))}
            {!defense?.recommendations?.length && (
              <div className="p-8 text-center text-slate-500 border border-white/5 rounded-xl font-mono text-xs">
                No active defense alerts pending for this asset.
              </div>
            )}
          </div>
        )}

        {/* SUB-TAB 5: RISK BREAKDOWN */}
        {activeSubTab === "risk" && (
          <div className="space-y-4 animate-fadeIn">
            <div className="p-5 rounded-xl border border-amber-500/20 bg-slate-900/60 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-xs font-mono text-amber-300 font-bold uppercase">Quantitative Risk Assessment</div>
                <div className="text-2xl font-black text-white font-mono mt-1">
                  Asset Risk Score: {risk?.overallRiskScore ?? 57} / 100
                </div>
                <p className="text-xs text-slate-400 mt-1 max-w-xl">
                  Evaluated using composite telemetry: (Asset Criticality Weight &times; Exposure Sockets) + (Threat CVSS Severity &times; Attack Depth).
                </p>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${riskLevelBadge}`}>
                  {risk?.overallRiskLevel || "MEDIUM POSTURE"}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              {(risk?.findings || []).map((f, i) => (
                <div key={i} className="p-3 rounded-xl border border-white/5 bg-slate-950/40 flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-mono font-bold text-white">{f.category} (Port {f.portNumber})</div>
                    <p className="text-xs text-slate-400">{f.rationale}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-mono font-bold text-amber-300">{f.riskScore}/100</span>
                    <div className="text-[10px] font-mono text-slate-500">{f.riskLevel}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 4. FOOTER NAVIGATION                                                      */}
      {/* ========================================================================= */}
      <div className="flex items-center justify-between border-t border-white/10 pt-4">
        <button
          onClick={() => switchPage("overview")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-xs font-mono text-slate-300 hover:text-white hover:bg-white/5 transition cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Fleet Overview</span>
        </button>

        <button
          onClick={() => {
            setScanTarget(currentAsset.ipAddress);
            switchPage("recon");
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/15 border border-cyan-400/30 text-xs font-mono font-bold text-cyan-300 hover:bg-cyan-500/25 transition cursor-pointer"
        >
          <span>Launch Recon on {currentAsset.ipAddress}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
