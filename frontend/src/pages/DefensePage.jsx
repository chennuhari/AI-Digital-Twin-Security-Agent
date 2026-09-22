import { useState } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  Copy,
  Check,
  ArrowRight,
  ArrowLeft,
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
      {/* Header Banner */}
      <div className="glass-panel p-6 border-emerald-500/30 shadow-2xl relative overflow-hidden flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold">
              SECTION 05 / 07
            </span>
            <span className="text-xs font-mono text-emerald-400 font-bold">
              CIS Controls v8 · NIST SP 800-53
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wide mt-1.5 flex items-center gap-2">
            <ShieldCheck className="h-7 w-7 text-emerald-400" />
            Autonomous Defense Agent & Mitigation Playbooks
          </h1>
          <p className="text-xs text-slate-300 mt-1 font-mono">
            Automated recommendations, firewall rule scripts, and 1-click virtual hardening to proactively eliminate attack surface exposure.
          </p>
        </div>

        <button
          onClick={() => applyMitigation(ports[0]?.portNumber || 80)}
          disabled={busy || !ports.length}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 font-mono text-xs font-bold hover:brightness-110 transition cursor-pointer shadow-lg shadow-emerald-950/40"
        >
          <ShieldCheck className="h-4 w-4" />
          <span>Apply Priority Remediation</span>
        </button>
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
                      Standard: CIS Control {rec.cisControl || "v8 4.1"} · Port {rec.portNumber || "Exposed Socket"}
                    </div>
                  </div>
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${
                  isUrgent
                    ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
                    : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                }`}>
                  {rec.priority || "P1 - URGENT"}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans mt-2">
                {rec.description}
              </p>

              {rec.command && (
                <div className="mt-4">
                  <div className="flex items-center justify-between bg-slate-950 px-3.5 py-1.5 rounded-t-xl border-t border-x border-white/10 text-[11px] font-mono text-slate-400">
                    <span>CLI Remediation Script</span>
                    <button
                      onClick={() => copyCommand(rec.command, `rec-${idx}`)}
                      className="text-cyan-400 hover:text-white flex items-center gap-1.5 cursor-pointer font-bold"
                    >
                      {copiedCmd === `rec-${idx}` ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedCmd === `rec-${idx}` ? "Copied" : "Copy Command"}</span>
                    </button>
                  </div>
                  <pre className="p-3.5 bg-slate-950/90 rounded-b-xl border border-white/10 text-xs font-mono text-emerald-300 overflow-x-auto">
                    <code>{rec.command}</code>
                  </pre>
                </div>
              )}

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">
                  Estimated Posture Improvement: <strong className="text-emerald-400">+15 Pts</strong>
                </span>
                <button
                  onClick={() => applyMitigation(rec.portNumber)}
                  className="px-3.5 py-1.5 rounded-xl bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-xs font-mono font-bold hover:bg-cyan-500/25 transition cursor-pointer"
                >
                  Apply Virtual Hardening
                </button>
              </div>
            </div>
          );
        })}

        {!defense?.recommendations?.length && (
          <div className="glass-panel p-12 text-center text-slate-500 font-mono text-xs">
            No defense playbooks pending. Run a scan to evaluate vulnerability surface.
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
          <span>Back to Threat Agent</span>
        </button>

        <button
          onClick={() => switchPage("risk")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/15 border border-cyan-400/30 text-xs font-mono font-bold text-cyan-300 hover:bg-cyan-500/25 transition cursor-pointer"
        >
          <span>Explore Quantitative Risk Matrix</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
