import { useState } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  Copy,
  Check,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Lock,
  Smartphone,
  Info,
} from "lucide-react";
import { cyberAudio } from "../soundEffects";

export default function DefensePage({
  defense,
  applyMitigation,
  ports,
  busy,
  switchPage,
  plainEnglishMode = true,
  setPlainEnglishMode,
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
              SECTION 06 / 08
            </span>
            <span className="text-xs font-mono text-emerald-400 font-bold">
              {plainEnglishMode ? "Easy Fixes · One-Click Protection" : "CIS Controls v8 · NIST SP 800-53"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wide mt-1.5 flex items-center gap-2">
            <ShieldCheck className="h-7 w-7 text-emerald-400" />
            {plainEnglishMode ? "Defense Agent & 1-Click Fixes" : "Autonomous Defense Agent & Mitigation Playbooks"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 font-sans">
            {plainEnglishMode
              ? "Apply digital locks to your digital twin to eliminate attack surfaces and watch your security score improve."
              : "Automated recommendations, firewall rule scripts, and 1-click virtual hardening to proactively eliminate attack surface exposure."}
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
            onClick={() => applyMitigation(ports[0]?.portNumber || 80)}
            disabled={busy || !ports.length}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 font-mono text-xs font-bold hover:brightness-110 transition cursor-pointer shadow-lg shadow-emerald-950/40"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>{plainEnglishMode ? "Fix Top Priority Risk" : "Apply Priority Remediation"}</span>
          </button>
        </div>
      </div>

      {/* Plain English Guide Box */}
      {plainEnglishMode && (
        <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 backdrop-blur-md flex items-start gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-emerald-300">
              💡 What does &ldquo;Virtual Hardening&rdquo; mean for a normal user?
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed font-sans">
              A <strong>Digital Twin</strong> lets you test defensive changes in a safe virtual copy first.
              When you click <strong>&ldquo;Lock This Door&rdquo;</strong>, our AI virtually blocks the port on your twin
              and recalculates your risk score. This confirms the fix stops hackers <em>before</em> you ever change a setting on your real phone or computer!
            </p>
          </div>
        </div>
      )}

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

              {/* Plain English Real-Life Tip */}
              {plainEnglishMode && (
                <div className="mt-3 p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-xs text-cyan-200 font-sans flex items-start gap-2">
                  <Smartphone className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <strong>Action for your real device:</strong> If this is your personal phone or computer,
                    turn off unused network file sharing, disable &ldquo;nearby sharing / discovery&rdquo; when in public places,
                    and always connect through a trusted VPN.
                  </div>
                </div>
              )}

              {rec.command && !plainEnglishMode && (
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

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-mono text-slate-400">
                  Estimated Posture Improvement: <strong className="text-emerald-400">+15 Pts</strong>
                </span>
                <button
                  onClick={() => applyMitigation(rec.portNumber)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 border border-cyan-400/40 text-cyan-300 hover:text-white text-xs font-mono font-bold hover:bg-cyan-500/30 transition cursor-pointer flex items-center gap-1.5"
                >
                  <Lock className="h-3.5 w-3.5 text-cyan-400" />
                  <span>{plainEnglishMode ? "Lock This Door (Apply Fix)" : "Apply Virtual Hardening"}</span>
                </button>
              </div>
            </div>
          );
        })}

        {!defense?.recommendations?.length && (
          <div className="glass-panel p-12 text-center text-slate-500 font-sans text-xs">
            No defense playbooks needed. Your digital twin shows that your security posture is healthy!
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
          <span>See Simple Risk Score</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
