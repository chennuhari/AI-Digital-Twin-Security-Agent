import { useState } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  Copy,
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Lock,
  Smartphone,
  CheckCircle2,
} from "lucide-react";
import { cyberAudio } from "../soundEffects";

export default function DefensePage({
  defense,
  applyMitigation,
  ports,
  busy,
  switchPage,
}) {
  const [copiedCmd, setCopiedCmd] = useState(null);

  function copyCommand(cmd, key) {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(key);
    cyberAudio.playBeep(880, 0.04);
    setTimeout(() => setCopiedCmd(null), 2000);
  }

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Banner (Emerald & Purple - No Blue) */}
      <div className="card-emerald p-6 rounded-3xl shadow-2xl relative overflow-hidden flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold">
              🛡️ SUPER GUARDIAN LOCKS
            </span>
            <span className="text-xs font-mono text-emerald-300 font-bold">
              1-Click Protection for Your Toy Twin
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wide mt-1.5 flex items-center gap-2">
            <ShieldCheck className="h-7 w-7 text-emerald-400" />
            Super Guardian - 1-Click Protective Padlocks 🔒
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 mt-1 font-sans max-w-2xl leading-relaxed">
            Whenever a digital door is left open, our guardian robots give you a super-strong virtual lock. Click the button to lock it immediately and watch your device smile!
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => applyMitigation(ports[0]?.portNumber || 80)}
            disabled={busy || !ports.length}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-mono text-xs font-black uppercase tracking-wider hover:brightness-110 transition cursor-pointer shadow-xl shadow-emerald-950/50"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>🔒 Lock Top Open Door Now</span>
          </button>
        </div>
      </div>

      {/* Kid-Friendly Explanation Guide Box */}
      <div className="p-4 rounded-3xl border border-emerald-500/30 bg-emerald-950/20 backdrop-blur-md flex items-start gap-3">
        <div className="p-2 rounded-2xl bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
          <Lock className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-emerald-300">
            💡 What happens when you click &ldquo;Lock This Door&rdquo;?
          </h3>
          <p className="text-xs text-slate-200 mt-1 leading-relaxed font-sans">
            Our robots put a <strong>protective shield</strong> over that open door on your safe copy.
            Nothing can get broken, and we recalculate your Safety Score right away.
            Once you see it works safely on the copy, you know your real phone or laptop can be kept safe too!
          </p>
        </div>
      </div>

      {/* Defense Playbooks Grid */}
      <div className="space-y-4">
        {(defense?.recommendations || []).map((rec, idx) => {
          const isUrgent = rec.priority === "P1 - URGENT";
          return (
            <div
              key={idx}
              className={`p-6 rounded-2xl border transition ${
                isUrgent
                  ? "bg-slate-900/80 border-rose-500/30 shadow-lg"
                  : "bg-slate-900/60 border-white/10"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <span className={`p-2 rounded-xl border ${
                    isUrgent
                      ? "bg-rose-500/15 border-rose-500/30 text-rose-400"
                      : "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                  }`}>
                    <ShieldCheck className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-white">{rec.title}</h3>
                    <div className="text-xs font-mono text-slate-400">
                      Safe Rule: Door #{rec.portNumber || "Exposed Socket"}
                    </div>
                  </div>
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${
                  isUrgent
                    ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
                    : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                }`}>
                  {isUrgent ? "⚠️ Needs Lock Soon" : "⭐ Good Lock"}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans mt-2">
                {rec.description}
              </p>

              {/* Kid-Friendly Tip for Personal Device */}
              <div className="mt-3 p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-200 font-sans flex items-start gap-2">
                <Smartphone className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong>Helpful Tip:</strong> Ask a grown-up or turn off unused sharing features when using public Wi-Fi, and keep your software updated!
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-mono text-slate-300">
                  Safety Score Boost: <strong className="text-emerald-400">+15 Stars ⭐</strong>
                </span>
                <button
                  onClick={() => applyMitigation(rec.portNumber)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:brightness-110 text-xs font-mono font-black uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-950/40"
                >
                  <Lock className="h-3.5 w-3.5 text-slate-950" />
                  <span>Lock This Door Now 🔒</span>
                </button>
              </div>
            </div>
          );
        })}

        {!defense?.recommendations?.length && (
          <div className="glass-panel p-12 text-center text-slate-400 font-sans text-xs">
            Yay! No locks needed right now. Your robot twin says your device is happy and safe!
          </div>
        )}
      </div>

      {/* Page Navigation Footer */}
      <div className="flex items-center justify-between border-t border-white/10 pt-4">
        <button
          onClick={() => switchPage("threat")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-xs font-mono text-slate-300 hover:text-white hover:bg-white/5 transition cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Intruder Detective</span>
        </button>

        <button
          onClick={() => switchPage("risk")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/15 border border-purple-400/30 text-xs font-mono font-bold text-purple-300 hover:bg-purple-500/25 transition cursor-pointer"
        >
          <span>Check Gold Star Safety Score ⭐</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
