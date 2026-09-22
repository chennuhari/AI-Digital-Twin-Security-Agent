import {
  Flame,
  AlertTriangle,
  Play,
  Pause,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

export default function ThreatPage({
  threats,
  attackPaths,
  simulationRunning,
  toggleAttackSimulation,
  activeMitreStep,
  setActiveMitreStep,
  simCurrentStepIndex,
  switchPage,
}) {
  const activePaths = attackPaths?.attack_paths || [];
  const currentPath = activePaths[0];
  const steps = currentPath?.steps || [];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="glass-panel p-6 border-rose-500/30 shadow-2xl relative overflow-hidden flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-rose-500/20 border border-rose-500/40 text-rose-300 font-mono text-xs font-bold">
              SECTION 04 / 07
            </span>
            <span className="text-xs font-mono text-rose-400 font-bold">
              Graph Pathfinding · MITRE ATT&CK Mapping
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wide mt-1.5 flex items-center gap-2">
            <Flame className="h-7 w-7 text-rose-500" />
            Threat Intelligence Agent & Attack Path Simulator
          </h1>
          <p className="text-xs text-slate-300 mt-1 font-mono">
            Graph-theoretic adversary route modeling simulating multi-hop pivots from external exposure to core crown jewels.
          </p>
        </div>

        <button
          onClick={toggleAttackSimulation}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border font-mono text-xs font-bold transition shadow-xl cursor-pointer ${
            simulationRunning
              ? "border-rose-500 bg-rose-500/30 text-rose-200 shadow-[0_0_20px_rgba(244,63,94,0.6)] animate-pulse"
              : "border-amber-400/40 bg-amber-400/15 text-amber-200 hover:bg-amber-400/25"
          }`}
        >
          {simulationRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          <span>{simulationRunning ? "Pause Attack Simulation" : "Run Live Attack Simulation"}</span>
        </button>
      </div>

      {/* MITRE ATT&CK Kill-Chain Stepper */}
      <div className="glass-panel p-6 border-white/10 shadow-2xl">
        <div className="mb-4">
          <h2 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-rose-400" />
            Adversary Multi-Hop Kill Chain Path
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 font-mono">
            Step-by-step route analysis from external entry point to internal privilege escalation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {steps.map((step, idx) => {
            const isCurrentSim = simulationRunning && simCurrentStepIndex === idx;
            const isSelected = activeMitreStep === idx;
            return (
              <div
                key={idx}
                onClick={() => setActiveMitreStep(idx)}
                className={`p-4 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                  isCurrentSim
                    ? "border-rose-500 bg-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.4)]"
                    : isSelected
                    ? "border-cyan-400/50 bg-cyan-500/10"
                    : "border-white/10 bg-slate-900/60 hover:bg-slate-900/90"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <span className="font-bold text-slate-400">HOP 0{idx + 1}</span>
                    <span className="text-rose-400 font-bold">{step.tactic || "TACTIC"}</span>
                  </div>
                  <div className="text-sm font-bold text-white">{step.name}</div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                    {step.description}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-white/5 text-[11px] font-mono text-cyan-300">
                  Technique: {step.techniqueId || "T1190"}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Vulnerability Findings Grid */}
      <div className="glass-panel p-6 border-white/10 shadow-2xl">
        <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
          <div>
            <h2 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
              <Flame className="h-4 w-4 text-rose-400" />
              Mapped Vulnerabilities & Exploit Vectors
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">
              {threats.length} vulnerabilities detected across active network sockets
            </p>
          </div>
          <span className="text-xs font-mono text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20 font-bold">
            {threats.length} FINDINGS
          </span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {threats.map((t, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-rose-500/25 bg-rose-500/5 hover:border-rose-500/50 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">
                    {t.category}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 border border-rose-500/30 text-rose-300 font-mono text-[10px] font-bold">
                    {t.severity || "HIGH"}
                  </span>
                </div>
                <div className="text-sm font-bold text-white mt-2">{t.cveId || "EXPLOIT-VECTOR-01"}</div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{t.description}</p>
              </div>

              <div className="mt-4 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Target Port: <strong className="text-cyan-300">{t.portNumber || "80"}</strong></span>
                <span>CVSS v3.1: <strong className="text-amber-300">{t.cvssScore ?? "7.5"}</strong></span>
              </div>
            </div>
          ))}
          {!threats.length && (
            <div className="col-span-3 p-8 text-center text-slate-500">
              No threat findings mapped. Run a scan to populate intelligence.
            </div>
          )}
        </div>
      </div>

      {/* Page Navigation Footer */}
      <div className="flex items-center justify-between border-t border-white/10 pt-4">
        <button
          onClick={() => switchPage("recon")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-xs font-mono text-slate-300 hover:text-white hover:bg-white/5 transition cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Recon Agent</span>
        </button>

        <button
          onClick={() => switchPage("defense")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/15 border border-cyan-400/30 text-xs font-mono font-bold text-cyan-300 hover:bg-cyan-500/25 transition cursor-pointer"
        >
          <span>Explore Defense Playbooks</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
