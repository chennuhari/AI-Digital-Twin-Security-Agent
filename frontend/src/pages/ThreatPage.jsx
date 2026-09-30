import {
  Flame,
  AlertTriangle,
  Play,
  Pause,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Shield,
  Lock,
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
}) {
  const activePaths = attackPaths?.attack_paths || [];
  const currentPath = activePaths[0];
  const steps = currentPath?.steps || [];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Banner (Warm Coral & Purple - No Blue) */}
      <div className="card-rose p-6 rounded-3xl shadow-2xl relative overflow-hidden flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 font-mono text-xs font-bold">
              🕵️ INTRUDER DETECTIVE
            </span>
            <span className="text-xs font-mono text-purple-300 font-bold">
              Catching Sneaky Visitors Early
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wide mt-1.5 flex items-center gap-2">
            <Flame className="h-7 w-7 text-rose-500" />
            Intruder Catcher & Test Game 🕵️‍♂️
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 mt-1 font-sans max-w-2xl leading-relaxed">
            See how sneaky bad guys try to sneak through unlocked digital doors on your toy copy, and watch our guardian robots catch them before they ever reach your real computer!
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={toggleAttackSimulation}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl border font-mono text-xs font-black uppercase tracking-wider transition shadow-xl cursor-pointer ${
              simulationRunning
                ? "border-rose-500 bg-rose-500/30 text-rose-200 shadow-[0_0_20px_rgba(244,63,94,0.6)] animate-pulse"
                : "border-amber-400/40 bg-amber-400/20 text-amber-200 hover:bg-amber-400/30"
            }`}
          >
            {simulationRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            <span>{simulationRunning ? "Pause Game Test" : "🎮 Play Intruder Test Game"}</span>
          </button>
        </div>
      </div>

      {/* Super Friendly Summary Notice Box */}
      <div className="p-4 rounded-3xl border border-amber-500/30 bg-amber-950/20 backdrop-blur-md flex items-start gap-3">
        <div className="p-2 rounded-2xl bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-amber-300">
            💡 How does this page work? (Kid-Friendly Explanation)
          </h3>
          <p className="text-xs text-slate-200 mt-1 leading-relaxed font-sans">
            When you play online games or browse the web, your device has tiny invisible doors called <strong>ports</strong>.
            Our friendly robot tests the copy of your device to make sure no doors are broken or unlocked.
            Below, you can see each door, what danger might try to sneak in, and the 1-click super lock to seal it tight!
          </p>
        </div>
      </div>

      {/* 4 Step Intruder Journey (Kid-Friendly Story) */}
      <div className="glass-panel p-6 border-white/10 shadow-2xl">
        <div className="mb-4">
          <h2 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-rose-400" />
            How a Sneaky Bad Guy Tries to Sneak In (Step-by-Step Story)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 font-sans">
            Watch the 4 steps of how intruders try to sneak from an unlocked door to private toy files:
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
                className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                  isCurrentSim
                    ? "border-rose-500 bg-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.4)]"
                    : isSelected
                    ? "border-purple-400/50 bg-purple-500/10"
                    : "border-white/10 bg-slate-900/60 hover:bg-slate-900/90"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <span className="font-bold text-slate-400">STEP 0{idx + 1}</span>
                    <span className="text-rose-400 font-bold">{step.tactic || "TACTIC"}</span>
                  </div>

                  <div className="text-sm font-bold text-white">
                    {plainChain.simpleName || step.name}
                  </div>

                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed font-sans">
                    {plainChain.simpleDesc || step.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-white/5 text-[11px] font-mono text-purple-300">
                  Secret Code: {step.techniqueId || "T1190"}
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
              Hazards Found & Easy Fixes 🛡️
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 font-sans">
              {threats.length} areas checked on your safe robot twin
            </p>
          </div>
          <span className="text-xs font-mono text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20 font-bold">
            {threats.length} HAZARDS
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
                      {t.category ? t.category.replace(/_/g, " ") : "Hazard Alert"}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-rose-500/20 border border-rose-500/30 text-rose-300 font-mono text-[10px] font-bold">
                      {t.severity || "HIGH"}
                    </span>
                  </div>

                  {/* Title */}
                  <div className="text-base font-bold text-white mt-2">
                    {simple.simpleTitle || (t.cveId || "HAZARD-01")}
                  </div>

                  {/* Plain English breakdown */}
                  <div className="mt-3 space-y-2.5 font-sans text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-950/70 border border-white/5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-purple-300 block mb-0.5">
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
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Target Door: <strong className="text-purple-300">#{t.portNumber || "80"}</strong></span>
                  <span>Safety Impact: <strong className="text-amber-300">{t.cvssScore ?? "7.5"}</strong></span>
                </div>
              </div>
            );
          })}

          {!threats.length && (
            <div className="col-span-3 p-8 text-center text-slate-400 font-sans">
              All clear! No hazards found on this device twin right now.
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
          <span>Back to Door Inspector</span>
        </button>

        <button
          onClick={() => switchPage("defense")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-400/30 text-xs font-mono font-bold text-emerald-300 hover:bg-emerald-500/25 transition cursor-pointer"
        >
          <span>Put Super Locks On Now 🛡️🔒</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
