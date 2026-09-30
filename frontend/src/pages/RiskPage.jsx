import {
  Activity,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  Star,
} from "lucide-react";

export default function RiskPage({
  risk,
  switchPage,
}) {
  const riskScore = risk?.overallRiskScore ?? 57;
  const safetyHealth = Math.max(0, 100 - riskScore);
  const riskLevel = risk?.overallRiskLevel || "MEDIUM";

  const riskLevelBadge = (() => {
    if (riskLevel === "CRITICAL") return "text-rose-400 border-rose-500/30 bg-rose-500/10";
    if (riskLevel === "HIGH") return "text-rose-400 border-rose-500/30 bg-rose-500/10";
    if (riskLevel === "MEDIUM") return "text-amber-400 border-amber-500/30 bg-amber-500/10";
    return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
  })();

  const plainExplanation = (() => {
    if (riskScore >= 70) {
      return {
        title: "⚠️ Needs Quick Attention",
        color: "text-rose-400 border-rose-500/30 bg-rose-950/20",
        message: "Your device has several open doorways listening on the network. Anyone on the same Wi-Fi could peek inside.",
        action: "Head to the Super Locks tab and click 'Lock This Door' to apply instant digital shields!"
      };
    }
    if (riskScore >= 40) {
      return {
        title: "⭐ Pretty Good, But Let's Lock It Tighter!",
        color: "text-amber-400 border-amber-500/30 bg-amber-950/20",
        message: "Your device has a couple of doors open. Closing the unused ones gives you a perfect gold star score!",
        action: "Apply the suggested 1-click shield locks in the Super Locks tab."
      };
    }
    return {
      title: "🌟 Super Safe Gold Star Device!",
      color: "text-emerald-400 border-emerald-500/30 bg-emerald-950/20",
      message: "Awesome job! Unnecessary doors are safely locked. Our AI robot confirmed bad guys cannot sneak into your system.",
      action: "Keep playing safely and avoid untrusted public Wi-Fi without a VPN."
    };
  })();

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Banner (Amber & Purple - No Blue) */}
      <div className="card-amber p-6 rounded-3xl shadow-2xl relative overflow-hidden flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold">
              ⭐ SAFETY SCORE JUDGE
            </span>
            <span className="text-xs font-mono text-emerald-300 font-bold">
              Easy Device Health Meter
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wide mt-1.5 flex items-center gap-2">
            <Activity className="h-7 w-7 text-amber-400" />
            Safety Score Judge ⭐ - Your Health Bar
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 mt-1 font-sans max-w-2xl leading-relaxed">
            Just like a game character has a health bar from 0 to 100, your safe robot twin has a Safety Score! High safety means you have full gold shields on every door.
          </p>
        </div>
      </div>

      {/* Kid-Friendly Score Breakdown Card */}
      <div className={`p-5 rounded-3xl border backdrop-blur-md ${plainExplanation.color}`}>
        <div className="flex items-center gap-2 font-bold text-sm">
          <Sparkles className="h-5 w-5 text-amber-400" />
          <span>Kid-Friendly Explanation: What does your score of {riskScore}/100 mean?</span>
        </div>
        <p className="mt-2 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
          {plainExplanation.message}
        </p>
        <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-2 text-xs text-amber-300 font-sans">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
          <span><strong>What to do next:</strong> {plainExplanation.action}</span>
        </div>
      </div>

      {/* Grid: Health Meter & Fun Safety Grid */}
      <div className="grid lg:grid-cols-[.9fr_1.1fr] gap-6">
        {/* Safety Health Gauge Card */}
        <div className="glass-panel p-6 border-white/10 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-4 border-b border-white/10 pb-2 flex items-center justify-between">
              <span>Overall Safety Health Bar</span>
              <span className="text-amber-400 font-bold">⭐ {safetyHealth}% Safe</span>
            </div>

            <div className="flex flex-col items-center justify-center py-6">
              <div className="relative h-44 w-44 rounded-full border-4 border-emerald-500/40 bg-emerald-950/20 flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.2)]">
                <div className="text-center">
                  <div className="text-5xl font-black font-mono text-white tracking-tight">
                    {safetyHealth}
                  </div>
                  <div className="text-[11px] font-mono text-emerald-400 mt-1 uppercase tracking-widest font-bold">
                    Health Points
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

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 text-xs text-slate-300 space-y-1.5 font-sans">
            <div className="font-bold text-white font-mono flex items-center gap-1.5">
              <Star className="h-4 w-4 text-amber-400" />
              <span>How your stars are counted:</span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">
              We start with 100 gold stars. If doors are left unlocked, points go down. Whenever you click <strong>Lock This Door</strong>, you win stars back!
            </p>
          </div>
        </div>

        {/* 5x5 Hazard vs Safety Grid */}
        <div className="glass-panel p-6 border-white/10 shadow-2xl">
          <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                Safety Playground Grid 🗺️
              </h2>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Green boxes are super safe! Red boxes are doors that need locks.
              </p>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 font-bold">Safe Map</span>
          </div>

          <div className="grid grid-cols-5 gap-2 my-4 text-center text-xs font-mono">
            {[
              { score: "5,1", color: "bg-amber-500/20 text-amber-300 border-amber-500/40" },
              { score: "5,2", color: "bg-amber-600/20 text-amber-300 border-amber-500/40" },
              { score: "5,3", color: "bg-rose-500/25 text-rose-300 border-rose-500/50" },
              { score: "5,4", color: "bg-rose-600/30 text-rose-200 border-rose-600/60 font-bold" },
              { score: "5,5 ⚠️", color: "bg-rose-700/40 text-rose-100 border-rose-600 font-black shadow-lg animate-pulse" },

              { score: "4,1", color: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
              { score: "4,2", color: "bg-amber-500/20 text-amber-300 border-amber-500/40" },
              { score: "4,3", color: "bg-rose-500/25 text-rose-300 border-rose-500/50" },
              { score: "4,4", color: "bg-rose-500/30 text-rose-300 border-rose-500/60" },
              { score: "4,5", color: "bg-rose-600/30 text-rose-200 border-rose-600/60 font-bold" },

              { score: "3,1", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
              { score: "3,2", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
              { score: "3,3", color: "bg-amber-500/25 text-amber-300 border-amber-500/40" },
              { score: "3,4", color: "bg-rose-500/30 text-rose-300 border-rose-500/50" },
              { score: "3,5", color: "bg-rose-500/30 text-rose-300 border-rose-500/60" },

              { score: "2,1", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
              { score: "2,2", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
              { score: "2,3", color: "bg-amber-500/25 text-amber-300 border-amber-500/40" },
              { score: "2,4", color: "bg-amber-500/30 text-amber-300 border-amber-500/50" },
              { score: "2,5", color: "bg-rose-500/30 text-rose-300 border-rose-500/60" },

              { score: "1,1 ⭐", color: "bg-emerald-500/30 text-emerald-300 border-emerald-500/40 font-bold" },
              { score: "1,2", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
              { score: "1,3", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
              { score: "1,4", color: "bg-amber-500/25 text-amber-300 border-amber-500/40" },
              { score: "1,5", color: "bg-amber-500/30 text-amber-300 border-amber-500/50" },
            ].map((cell, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border flex items-center justify-center text-[10px] ${cell.color} transition hover:scale-105`}
              >
                {cell.score}
              </div>
            ))}
          </div>

          <div className="flex justify-between text-[10px] font-sans text-slate-400 mt-2">
            <span>&larr; How easy it is to break in &rarr;</span>
            <span>&uarr; How much trouble it causes</span>
          </div>

          {/* Risk Findings List */}
          <div className="mt-4 space-y-2 max-h-48 overflow-y-auto pr-1">
            {(risk?.findings || []).map((f, i) => (
              <div key={i} className="p-3 rounded-2xl border border-white/5 bg-slate-950/40 flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-mono font-bold text-white">
                    {f.category ? f.category.replace(/_/g, " ") : "Door Status"} (Door #{f.portNumber})
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5 font-sans">{f.rationale}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-sm font-mono font-bold text-amber-300">{f.riskScore}/100</span>
                  <div className="text-[10px] font-mono text-slate-400">{f.riskLevel}</div>
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
          <span>Back to Super Locks</span>
        </button>

        <button
          onClick={() => switchPage("audit")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/15 border border-purple-400/30 text-xs font-mono font-bold text-purple-300 hover:bg-purple-500/25 transition cursor-pointer"
        >
          <span>Read Robot Diary 📜</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
