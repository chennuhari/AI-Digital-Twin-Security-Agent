import { useState } from "react";
import {
  Radar,
  Server,
  RefreshCw,
  TerminalSquare,
  ShieldCheck,
  Smartphone,
  Laptop,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Lock,
} from "lucide-react";
import { fetchVisitorIp } from "../deviceUtils";

export default function ReconPage({
  scanTarget,
  setScanTarget,
  scanProfile,
  setScanProfile,
  triggerReconScan,
  scanVisitorDevice,
  onOpenWholeDeviceScanner,
  reconTerminalLogs,
  busy,
  ports,
  selectedAsset,
  applyMitigation,
  switchPage,
}) {
  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Banner (Warm Amber & Emerald - No Blue) */}
      <div className="card-amber p-6 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 font-mono text-[11px] font-bold">
                🚪 DOOR INSPECTOR DETECTIVE
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-mono text-[11px] font-bold">
                ⚡ SAFE ROBOT COPY
              </span>
              <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Detector Ready
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wide mt-1 flex items-center gap-2">
              <Radar className="h-7 w-7 text-amber-400" />
              Scout Detective - Checking Every Digital Door 🚪
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 mt-2 font-sans max-w-2xl leading-relaxed">
              Just like your house has front doors and windows, your phone or computer has little digital doors (called ports). Our friendly Scout Detective knocks gently on each door to see if any are left unlocked!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                if (onOpenWholeDeviceScanner) onOpenWholeDeviceScanner();
                else if (scanVisitorDevice) scanVisitorDevice();
              }}
              disabled={busy}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 flex items-center gap-2 text-xs font-mono font-black uppercase tracking-wider cursor-pointer shadow-lg shadow-emerald-950/40 transition"
            >
              <Smartphone className="h-4 w-4 text-slate-950" />
              <span>📱 Scan Whole Device</span>
            </button>

            <button
              type="button"
              onClick={scanVisitorDevice}
              disabled={busy}
              className="px-4 py-2.5 rounded-xl border border-purple-400/40 bg-purple-950/40 text-purple-300 text-xs font-mono font-bold hover:bg-purple-900/50 transition cursor-pointer shadow-lg"
            >
              <Laptop className="h-4 w-4 text-purple-400" />
              <span>Quick Twin Sync</span>
            </button>
          </div>
        </div>

        {/* Target Input & Scan Controls */}
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[240px] max-w-md">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-mono text-slate-300 uppercase tracking-wider">
                Target Device Address
              </label>
              <button
                type="button"
                onClick={async () => {
                  const ip = await fetchVisitorIp();
                  setScanTarget(ip);
                }}
                className="text-[10px] font-mono text-amber-300 hover:text-amber-200 underline cursor-pointer"
              >
                Use My Device IP
              </button>
            </div>
            <input
              type="text"
              value={scanTarget}
              onChange={(e) => setScanTarget(e.target.value)}
              placeholder="e.g. 127.0.0.1 or 192.168.1.1"
              className="w-full px-3.5 py-2 rounded-xl border border-white/10 bg-slate-900/90 text-xs font-mono text-white placeholder-slate-500 outline-none focus:border-amber-400 transition"
            />
          </div>

          <div className="w-48">
            <label className="block text-[11px] font-mono text-slate-300 uppercase tracking-wider mb-1">
              Inspection Mode
            </label>
            <select
              value={scanProfile}
              onChange={(e) => setScanProfile(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-white/10 bg-slate-900/90 text-xs font-mono text-slate-200 outline-none focus:border-amber-400 transition cursor-pointer"
            >
              <option value="-sT -T4">Standard Checkup (Friendly)</option>
              <option value="-A -T4">Super Deep Detective</option>
              <option value="-F -T4">Super Fast Checkup</option>
              <option value="-sS -O">Sneak Peek Probe</option>
            </select>
          </div>

          <div className="self-end flex items-center gap-2">
            <button
              onClick={() => triggerReconScan()}
              disabled={busy}
              className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-lg ${
                busy
                  ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 hover:brightness-110 shadow-amber-950/40"
              }`}
            >
              {busy ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Radar className="h-4 w-4" />}
              <span>{busy ? "Checking Doors..." : "🚀 Start Door Inspection"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Discovered Doors Table & Live Friendly Terminal */}
      <div className="grid lg:grid-cols-[1.3fr_.7fr] gap-6">
        {/* Left: Open Doors Found */}
        <div className="glass-panel p-6 border-white/10 shadow-2xl">
          <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
            <div>
              <h2 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
                <Server className="h-4 w-4 text-amber-400" />
                Open Digital Doors Found 🚪
              </h2>
              <p className="text-xs text-slate-400 mt-0.5 font-sans">
                {ports.length} doors are currently unlocked on device {selectedAsset.ipAddress}
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 font-bold">
              {ports.length} DOORS OPEN
            </span>
          </div>

          <div className="rounded-xl border border-white/10 overflow-hidden bg-slate-950/60 shadow-xl">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-white/5 text-slate-400 border-b border-white/10">
                <tr>
                  <th className="p-3">Door Number</th>
                  <th className="p-3">What Lives Here</th>
                  <th className="p-3">Door Status</th>
                  <th className="p-3">Program Name</th>
                  <th className="p-3 text-right">Lock Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {ports.map((p) => (
                  <tr key={p.id} className="hover:bg-white/[0.03] transition">
                    <td className="p-3 font-bold text-amber-300">Door #{p.portNumber} ({p.protocol})</td>
                    <td className="p-3 text-white font-bold">{p.serviceName || "Internet App"}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                        {p.state === "open" ? "🚪 Unlocked" : p.state}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400 max-w-xs truncate">{p.product || "Standard System App"}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => applyMitigation(p.portNumber)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 hover:bg-emerald-500/25 transition cursor-pointer text-[11px] font-bold flex items-center gap-1 ml-auto"
                      >
                        <Lock className="h-3 w-3" />
                        <span>Lock 🔒</span>
                      </button>
                    </td>
                  </tr>
                ))}
                {!ports.length && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400">
                      All doors are safely closed or no scan has been run yet. Click "Start Door Inspection" above!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Live Detective Diary Log */}
        <div className="glass-panel p-5 border-purple-500/20 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
              <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-widest flex items-center gap-1.5">
                <TerminalSquare className="h-4 w-4" />
                Detective Live Diary 📜
              </span>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            </div>

            <div className="h-80 overflow-y-auto rounded-xl bg-slate-950 p-3.5 font-mono text-[11px] text-slate-300 border border-white/5 space-y-1.5 shadow-inner">
              {reconTerminalLogs.map((log, idx) => (
                <div
                  key={idx}
                  className={
                    log.includes("[ERROR]")
                      ? "text-rose-400"
                      : log.includes("complete") || log.includes("committed")
                      ? "text-emerald-400 font-bold"
                      : log.includes("SYN") || log.includes("Nmap")
                      ? "text-purple-300"
                      : "text-slate-400"
                  }
                >
                  {log}
                </div>
              ))}
              {!reconTerminalLogs.length && (
                <div className="text-slate-500 italic">
                  [DETECTIVE SLEEPING] Ready to inspect! Enter an IP address above and click Start Door Inspection.
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span>Device Name: {selectedAsset.hostname || "localhost"}</span>
            <span className="text-emerald-400">{selectedAsset.ipAddress}</span>
          </div>
        </div>
      </div>

      {/* Page Navigation Footer */}
      <div className="flex items-center justify-between border-t border-white/10 pt-4">
        <button
          onClick={() => switchPage("diagram")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-xs font-mono text-slate-300 hover:text-white hover:bg-white/5 transition cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to 3D Playground</span>
        </button>

        <button
          onClick={() => switchPage("threat")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/15 border border-amber-400/30 text-xs font-mono font-bold text-amber-300 hover:bg-amber-500/25 transition cursor-pointer"
        >
          <span>Catch Sneaky Intruders Next 🕵️</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
