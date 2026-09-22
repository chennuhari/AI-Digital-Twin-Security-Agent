import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  RotateCcw,
  Play,
  Pause,
  ShieldCheck,
  Flame,
  Info,
  X,
  Layers,
  Server,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import NetworkScene from "../NetworkScene";
import { cyberAudio } from "../soundEffects";

export default function DiagramPage({
  graph,
  selectedNode,
  setSelectedNode,
  activeAttackPath,
  simulationRunning,
  toggleAttackSimulation,
  simCurrentStepIndex,
  attackPaths,
  cameraPreset,
  setCameraPreset,
  layerFilter,
  setLayerFilter,
  isSpinning,
  setIsSpinning,
  spinSpeed,
  setSpinSpeed,
  zoomRef,
  applyMitigation,
  switchPage,
  showAllAssets,
  loadEnvironmentGraph,
  loadDashboard,
  assetId,
}) {
  const activePaths = attackPaths?.attack_paths || [];
  const currentStep = activePaths[0]?.steps?.[simCurrentStepIndex] || activePaths[0]?.steps?.[0];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="glass-panel p-6 border-cyan-500/30 shadow-2xl relative overflow-hidden flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold">
              3D COMMAND CENTER
            </span>
            <span className="text-xs font-mono text-slate-400">
              {graph?.nodes?.length || 0} Graph Nodes · {graph?.edges?.length || 0} Graph Edges
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wide mt-1.5 flex items-center gap-2">
            <Compass className="h-7 w-7 text-cyan-400" />
            3D Holographic Digital Twin Viewport
          </h1>
          <p className="text-xs text-slate-300 mt-1 font-mono">
            Interactive virtual replica visualizing attack surface sockets, adversary pivot paths, and proactive mitigations.
          </p>
        </div>

        {/* View Mode Toggle: Single Asset vs Multi-Asset */}
        <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-xl border border-white/10 text-xs font-mono">
          <button
            onClick={() => loadDashboard(assetId)}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer font-bold ${
              !showAllAssets
                ? "bg-cyan-400 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Focused Asset Twin
          </button>
          <button
            onClick={loadEnvironmentGraph}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer font-bold ${
              showAllAssets
                ? "bg-cyan-400 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Multi-Asset Network Fleet
          </button>
        </div>
      </div>

      {/* 3D Viewport Container */}
      <div className="glass-panel p-5 border-cyan-500/25 shadow-2xl">
        {/* Top Viewport Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Mode: {showAllAssets ? "Multi-Asset Network Topology" : "Focused Core Twin"}</span>
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
              {isSpinning ? "Spin Active" : "Resume Spin"}
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

            {/* Zoom Controls */}
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

        {/* 3D Canvas */}
        <div className="relative w-full h-[640px] rounded-2xl overflow-hidden border border-cyan-500/25 bg-slate-950/80 shadow-2xl">
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

          {/* Attack Simulation Playback Banner */}
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

          {/* Node Inspector Drawer */}
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

          {/* Bottom Viewport Legend */}
          <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
            <div className="pointer-events-auto flex flex-wrap gap-2 text-[11px] font-mono text-slate-300 bg-slate-950/85 p-2 rounded-xl border border-white/10 backdrop-blur-md">
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff]" /> Asset</span>
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

      {/* Page Navigation Footer */}
      <div className="flex items-center justify-between border-t border-white/10 pt-4">
        <button
          onClick={() => switchPage("overview")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-xs font-mono text-slate-300 hover:text-white hover:bg-white/5 transition cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Overview Page</span>
        </button>

        <button
          onClick={() => switchPage("recon")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/15 border border-cyan-400/30 text-xs font-mono font-bold text-cyan-300 hover:bg-cyan-500/25 transition cursor-pointer"
        >
          <span>Explore Reconnaissance Agent</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
