import {
  Flame,
  AlertTriangle,
  Play,
  Pause,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Shield,
  HelpCircle,
  Info,
  CheckCircle2,
} from "lucide-react";
import { getPlainEnglishThreat, killChainTranslations } from "../easyEnglish";

export default function ThreatPage({
  threats,
  attackPaths,
  simulationRunning,
  toggleAttackSimulation,
  activeMitreStep,
  setActiveMitreStep,
  simCurrentStepIndex,
  switchPage,
  plainEnglishMode = true,
  setPlainEnglishMode,
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
              SECTION 05 / 08
            </span>
            <span className="text-xs font-mono text-rose-400 font-bold">
              {plainEnglishMode ? "Security Threat Breakdown · Easy Explanations" : "Graph Pathfinding · MITRE ATT&CK Mapping"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wide mt-1.5 flex items-center gap-2">
            <Flame className="h-7 w-7 text-rose-500" />
            {plainEnglishMode ? "Threat Intelligence & Attack Simulator" : "Threat Intelligence Agent & Attack Path Simulator"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 font-sans">
            {plainEnglishMode
              ? "See the security risks found on your device explained in clear, simple words, and watch a simulated attack route."
              : "Graph-theoretic adversary route modeling simulating multi-hop pivots from external exposure to core crown jewels."}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {setPlainEnglishMode && (
            <button
              onClick={() => setPlainEnglishMode(!plainEnglishMode)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-mono font-bold transition cursor-pointer ${
                plainEnglishMode
                  ? "bg-amber-400/20 border-amber-400/50 text-amber-300 shadow-md shadow-amber-950/40"
                  : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
              }`}
              title="Toggle Easy English Explanations"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>{plainEnglishMode ? "💡 Easy English: ON" : "⚙️ Advanced Cyber Mode"}</span>
            </button>
          )}

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
      </div>

      {/* Plain English Summary Notice Box */}
      {plainEnglishMode && (
        <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-950/20 backdrop-blur-md flex items-start gap-3">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-amber-300">
              💡 What does this page tell you in simple words?
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed font-sans">
              When your device connects to the internet or Wi-Fi, it opens small &ldquo;digital doors&rdquo; (ports) so apps can work.
              Below, our AI scanned your digital twin to see if any doors were left unlocked.
              Each card shows: <strong>1. What the door does</strong>, <strong>2. What bad actors could do</strong>, and <strong>3. How to fix it</strong>.
            </p>
          </div>
        </div>
      )}

      {/* MITRE ATT&CK Kill-Chain Stepper */}
      <div className="glass-panel p-6 border-white/10 shadow-2xl">
        <div className="mb-4">
          <h2 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-rose-400" />
            {plainEnglishMode ? "How a Hacker Attacks (Step-by-Step)" : "Adversary Multi-Hop Kill Chain Path"}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 font-sans">
            {plainEnglishMode
              ? "This simulation shows the 4 steps an attacker takes to break in and reach private data."
              : "Step-by-step route analysis from external entry point to internal privilege escalation."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {steps.map((step, idx) => {
            const isCurrentSim = simulationRunning && simCurrentStepIndex === idx;
            const isSelected = activeMitreStep === idx;
            const plainChain = killChainTranslations[idx] || {};

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

                  <div className="text-sm font-bold text-white">
                    {plainEnglishMode ? (plainChain.simpleName || step.name) : step.name}
                  </div>

                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed font-sans">
                    {plainEnglishMode ? (plainChain.simpleDesc || step.description) : step.description}
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
              {plainEnglishMode ? "Discovered Security Risks & Simple Fixes" : "Mapped Vulnerabilities & Exploit Vectors"}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 font-sans">
              {threats.length} security areas analyzed across this device&apos;s digital twin
            </p>
          </div>
          <span className="text-xs font-mono text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20 font-bold">
            {threats.length} FINDINGS
          </span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {threats.map((t, idx) => {
            const simple = getPlainEnglishThreat(t.portNumber, t.category, t.description);

            return (
              <div
                key={idx}
                className="p-5 rounded-2xl border border-rose-500/30 bg-slate-900/80 hover:border-rose-500/60 transition flex flex-col justify-between shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">
                      {t.category ? t.category.replace(/_/g, " ") : "Threat Vector"}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-rose-500/20 border border-rose-500/30 text-rose-300 font-mono text-[10px] font-bold">
                      {t.severity || "HIGH"}
                    </span>
                  </div>

                  {/* Title */}
                  <div className="text-base font-bold text-white mt-2">
                    {plainEnglishMode ? simple.simpleTitle : (t.cveId || "EXPLOIT-VECTOR-01")}
                  </div>

                  {/* Plain English breakdown */}
                  {plainEnglishMode ? (
                    <div className="mt-3 space-y-2.5 font-sans text-xs">
                      <div className="p-2.5 rounded-xl bg-slate-950/70 border border-white/5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-300 block mb-0.5">
                          🗣️ What this means:
                        </span>
                        <p className="text-slate-300 leading-relaxed">
                          {simple.simpleExplanation}
                        </p>
                      </div>

                      <div className="p-2.5 rounded-xl bg-rose-950/20 border border-rose-500/20">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400 block mb-0.5">
                          ⚠️ The Danger:
                        </span>
                        <p className="text-rose-200 leading-relaxed">
                          {simple.danger}
                        </p>
                      </div>

                      <div className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 block mb-0.5">
                          🛡️ How to Fix:
                        </span>
                        <p className="text-emerald-200 leading-relaxed">
                          {simple.fix}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed font-sans">{t.description}</p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Target Port: <strong className="text-cyan-300">{t.portNumber || "80"}</strong></span>
                  <span>Risk Severity: <strong className="text-amber-300">{t.cvssScore ?? "7.5"}</strong></span>
                </div>
              </div>
            );
          })}

          {!threats.length && (
            <div className="col-span-3 p-8 text-center text-slate-500 font-sans">
              No threats detected on this device twin. Run a scan from the Recon page to evaluate security posture.
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
          <span>See Easy Fixes & Defense Playbooks</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
