import {
  Activity,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

export default function RiskPage({
  risk,
  switchPage,
}) {
  const riskScore = risk?.overallRiskScore ?? 57;
  const riskLevel = risk?.overallRiskLevel || "MEDIUM";

  const riskLevelBadge = (() => {
    if (riskLevel === "CRITICAL") return "text-rose-400 border-rose-500/30 bg-rose-500/10";
    if (riskLevel === "HIGH") return "text-orange-400 border-orange-500/30 bg-orange-500/10";
    if (riskLevel === "MEDIUM") return "text-amber-400 border-amber-500/30 bg-amber-500/10";
    return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
  })();

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="glass-panel p-6 border-amber-500/30 shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold">
            SECTION 06 / 07
          </span>
          <span className="text-xs font-mono text-amber-400 font-bold">
            Dynamic Quantitative Scoring Engine
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wide mt-1.5 flex items-center gap-2">
          <Activity className="h-7 w-7 text-amber-400" />
          Quantitative Risk Assessment Matrix
        </h1>
        <p className="text-xs text-slate-300 mt-1 font-mono">
          Mathematical risk calculation based on asset criticality, CVSS vulnerability severity, and attack path depth.
        </p>
      </div>

      {/* Grid: Circular Gauge & 5x5 Heatmap Matrix */}
      <div className="grid lg:grid-cols-[.9fr_1.1fr] gap-6">
        {/* Risk Gauge Card */}
        <div className="glass-panel p-6 border-white/10 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
              Overall Security Posture Score
            </div>

            <div className="flex flex-col items-center justify-center py-6">
              <div className="relative h-44 w-44 rounded-full border-4 border-slate-800 flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.15)]">
                <div className="text-center">
                  <div className="text-5xl font-black font-mono text-white tracking-tight">
                    {riskScore}
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 mt-1 uppercase tracking-widest">
                    Score / 100
                  </div>
                </div>
              </div>

              <div className="mt-5 text-center">
                <span className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold border ${riskLevelBadge}`}>
                  {riskLevel} RISK POSTURE
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 text-xs text-slate-300 space-y-1.5">
            <div className="font-bold text-white font-mono">Calculation Formula:</div>
            <p className="text-slate-400 font-mono text-[11px] leading-relaxed">
              Risk = (Asset Weight &times; Exposed Sockets) + (Threat CVSS Severity &times; Attack Depth) &minus; Defense Mitigation Factor
            </p>
          </div>
        </div>

        {/* 5x5 Likelihood vs Impact Risk Matrix Heatmap */}
        <div className="glass-panel p-6 border-white/10 shadow-2xl">
          <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">5&times;5 Likelihood vs Impact Heatmap</h2>
              <p className="text-xs text-slate-400 font-mono mt-0.5">Plotted security vulnerability coordinates</p>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Risk Distribution</span>
          </div>

          <div className="grid grid-cols-5 gap-2 my-4 text-center text-xs font-mono">
            {[
              { score: "5,1", color: "bg-amber-500/20 text-amber-300 border-amber-500/40" },
              { score: "5,2", color: "bg-orange-500/20 text-orange-300 border-orange-500/40" },
              { score: "5,3", color: "bg-rose-500/25 text-rose-300 border-rose-500/50" },
              { score: "5,4", color: "bg-rose-600/30 text-rose-200 border-rose-600/60 font-bold" },
              { score: "5,5 (CRITICAL)", color: "bg-rose-700/40 text-rose-100 border-rose-600 font-black shadow-lg animate-pulse" },

              { score: "4,1", color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30" },
              { score: "4,2", color: "bg-amber-500/20 text-amber-300 border-amber-500/40" },
              { score: "4,3", color: "bg-orange-500/25 text-orange-300 border-orange-500/50" },
              { score: "4,4", color: "bg-rose-500/30 text-rose-300 border-rose-500/60" },
              { score: "4,5", color: "bg-rose-600/30 text-rose-200 border-rose-600/60 font-bold" },

              { score: "3,1", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
              { score: "3,2", color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30" },
              { score: "3,3", color: "bg-amber-500/25 text-amber-300 border-amber-500/40" },
              { score: "3,4", color: "bg-orange-500/30 text-orange-300 border-orange-500/50" },
              { score: "3,5", color: "bg-rose-500/30 text-rose-300 border-rose-500/60" },

              { score: "2,1", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
              { score: "2,2", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
              { score: "2,3", color: "bg-yellow-500/25 text-yellow-300 border-yellow-500/40" },
              { score: "2,4", color: "bg-amber-500/30 text-amber-300 border-amber-500/50" },
              { score: "2,5", color: "bg-orange-500/30 text-orange-300 border-orange-500/60" },

              { score: "1,1 (LOW)", color: "bg-emerald-500/30 text-emerald-300 border-emerald-500/40 font-bold" },
              { score: "1,2", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
              { score: "1,3", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
              { score: "1,4", color: "bg-yellow-500/25 text-yellow-300 border-yellow-500/40" },
              { score: "1,5", color: "bg-amber-500/30 text-amber-300 border-amber-500/50" },
            ].map((cell, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg border flex items-center justify-center text-[10px] ${cell.color} transition hover:scale-105`}
              >
                {cell.score}
              </div>
            ))}
          </div>

          <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-2">
            <span>Impact &rarr; (1 Low to 5 Catastrophic)</span>
            <span>Likelihood &uarr; (1 Rare to 5 Almost Certain)</span>
          </div>

          {/* Risk Findings List */}
          <div className="mt-4 space-y-2 max-h-48 overflow-y-auto pr-1">
            {(risk?.findings || []).map((f, i) => (
              <div key={i} className="p-3 rounded-xl border border-white/5 bg-slate-950/40 flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-mono font-bold text-white">{f.category} (Port {f.portNumber})</div>
                  <p className="text-xs text-slate-400 mt-0.5">{f.rationale}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-sm font-mono font-bold text-amber-300">{f.riskScore}/100</span>
                  <div className="text-[10px] font-mono text-slate-500">{f.riskLevel}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Page Navigation Footer */}
      <div className="flex items-center justify-between border-t border-white/10 pt-4">
        <button
          onClick={() => switchPage("defense")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-xs font-mono text-slate-300 hover:text-white hover:bg-white/5 transition cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Defense Agent</span>
        </button>

        <button
          onClick={() => switchPage("audit")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/15 border border-cyan-400/30 text-xs font-mono font-bold text-cyan-300 hover:bg-cyan-500/25 transition cursor-pointer"
        >
          <span>Explore Audit History & Evolution</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
