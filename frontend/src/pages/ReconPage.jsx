import {
  Radar,
  Server,
  TerminalSquare,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Laptop,
} from "lucide-react";
import { cyberAudio } from "../soundEffects";
import { fetchVisitorIp } from "../deviceUtils";

export default function ReconPage({
  scanTarget,
  setScanTarget,
  scanProfile,
  setScanProfile,
  triggerReconScan,
  scanVisitorDevice,
  reconTerminalLogs,
  busy,
  ports,
  selectedAsset,
  applyMitigation,
  switchPage,
}) {
  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="glass-panel p-6 border-cyan-500/30 shadow-2xl relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold">
                SECTION 03 / 07
              </span>
              <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Nmap 7.991 Engine Ready
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wide mt-1.5 flex items-center gap-2">
              <Radar className="h-7 w-7 text-cyan-400" />
              Autonomous Reconnaissance Agent
            </h1>
            <p className="text-xs text-slate-300 mt-1 font-mono">
              High-speed active socket discovery, TCP syn probes, OS fingerprinting, and dynamic twin registration.
            </p>
          </div>

          <button
            type="button"
            onClick={scanVisitorDevice}
            disabled={busy}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-emerald-400/40 bg-emerald-950/40 text-emerald-300 text-xs font-mono font-bold hover:bg-emerald-900/50 transition cursor-pointer shadow-lg"
          >
            <Laptop className="h-4 w-4 text-emerald-400" />
            <span>Scan My Current Device Twin</span>
          </button>
        </div>

        {/* Target Input & Scan Controls */}
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[240px] max-w-md">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                Target IP Address / Subnet
              </label>
              <button
                type="button"
                onClick={async () => {
                  const ip = await fetchVisitorIp();
                  setScanTarget(ip);
                }}
                className="text-[10px] font-mono text-cyan-300 hover:text-cyan-200 underline cursor-pointer"
              >
                Use My IP
              </button>
            </div>
            <input
              type="text"
              value={scanTarget}
              onChange={(e) => setScanTarget(e.target.value)}
              placeholder="e.g. 127.0.0.1 or 192.168.1.1"
              className="w-full px-3.5 py-2 rounded-xl border border-white/10 bg-slate-900/90 text-xs font-mono text-white placeholder-slate-500 outline-none focus:border-cyan-400 transition"
            />
          </div>

          <div className="w-48">
            <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
              Nmap Profile Preset
            </label>
            <select
              value={scanProfile}
              onChange={(e) => setScanProfile(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-white/10 bg-slate-900/90 text-xs font-mono text-slate-200 outline-none focus:border-cyan-400 transition cursor-pointer"
            >
              <option value="-sT -T4">Standard TCP (-sT -T4)</option>
              <option value="-A -T4">Aggressive Probe (-A -T4)</option>
              <option value="-F -T4">Fast Top 100 (-F -T4)</option>
              <option value="-sS -O">Stealth OS SYN (-sS -O)</option>
            </select>
          </div>

          <div className="self-end flex items-center gap-2">
            <button
              onClick={() => triggerReconScan()}
              disabled={busy}
              className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-lg ${
                busy
                  ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 hover:brightness-110 shadow-cyan-950/40"
              }`}
            >
              {busy ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Radar className="h-4 w-4" />}
              <span>{busy ? "Sweep in Progress..." : "Execute Reconnaissance Sweep"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Discovered Sockets Table & Live Terminal Console */}
      <div className="grid lg:grid-cols-[1.3fr_.7fr] gap-6">
        {/* Left: Discovered Open Ports & Listening Sockets */}
        <div className="glass-panel p-6 border-white/10 shadow-2xl">
          <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
            <div>
              <h2 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
                <Server className="h-4 w-4 text-cyan-400" />
                Listening Sockets & Discovered Services
              </h2>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                {ports.length} open ports detected on target {selectedAsset.ipAddress}
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 font-bold">
              {ports.length} ACTIVE
            </span>
          </div>

          <div className="rounded-xl border border-white/10 overflow-hidden bg-slate-950/60 shadow-xl">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-white/5 text-slate-400 border-b border-white/10">
                <tr>
                  <th className="p-3">Port / Protocol</th>
                  <th className="p-3">Service Name</th>
                  <th className="p-3">Socket State</th>
                  <th className="p-3">Daemon Product</th>
                  <th className="p-3 text-right">Defense Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {ports.map((p) => (
                  <tr key={p.id} className="hover:bg-white/[0.03] transition">
                    <td className="p-3 font-bold text-cyan-300">{p.portNumber}/{p.protocol}</td>
                    <td className="p-3 text-white font-bold">{p.serviceName || "unknown"}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                        {p.state}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400 max-w-xs truncate">{p.product || "Standard System Daemon"}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => applyMitigation(p.portNumber)}
                        className="px-2.5 py-1 rounded-lg bg-cyan-400/15 border border-cyan-400/30 text-cyan-300 hover:bg-cyan-400/25 transition cursor-pointer text-[11px] font-bold"
                      >
                        Harden
                      </button>
                    </td>
                  </tr>
                ))}
                {!ports.length && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">
                      No open ports detected. Run a scan above to discover sockets.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Live Streaming Cyber Terminal Console */}
        <div className="glass-panel p-5 border-cyan-500/20 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                <TerminalSquare className="h-4 w-4" />
                Live Recon Console
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
                      ? "text-cyan-300"
                      : "text-slate-400"
                  }
                >
                  {log}
                </div>
              ))}
              {!reconTerminalLogs.length && (
                <div className="text-slate-600 italic">
                  [SYSTEM IDLE] Waiting for reconnaissance execution... Enter IP address above and click Execute.
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span>Target Host: {selectedAsset.hostname || "localhost"}</span>
            <span className="text-cyan-400">{selectedAsset.ipAddress}</span>
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
          <span>Back to 3D Diagram</span>
        </button>

        <button
          onClick={() => switchPage("threat")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/15 border border-cyan-400/30 text-xs font-mono font-bold text-cyan-300 hover:bg-cyan-500/25 transition cursor-pointer"
        >
          <span>Explore Threat Agent & Kill Chains</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
