import {
  TerminalSquare,
  FileDown,
  ArrowLeft,
  ArrowUp,
} from "lucide-react";

export default function AuditPage({
  history,
  exportReport,
  switchPage,
}) {
  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="glass-panel p-6 border-cyan-500/30 shadow-2xl relative overflow-hidden flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold">
              SECTION 07 / 07
            </span>
            <span className="text-xs font-mono text-cyan-400 font-bold">
              PostgreSQL Ledger · Audit Logging
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wide mt-1.5 flex items-center gap-2">
            <TerminalSquare className="h-7 w-7 text-cyan-400" />
            Continuous Monitoring & Audit Evolution Timeline
          </h1>
          <p className="text-xs text-slate-300 mt-1 font-mono">
            Immutable audit records tracking network posture, open port counts, and threat evolution snapshots over time.
          </p>
        </div>

        <button
          onClick={exportReport}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 font-mono text-xs font-bold hover:bg-cyan-500/25 transition cursor-pointer shadow-md"
        >
          <FileDown className="h-4 w-4" />
          <span>Export Full JSON Report</span>
        </button>
      </div>

      {/* Audit History Ledger Table */}
      <div className="glass-panel p-6 border-white/10 shadow-2xl">
        <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
          <h2 className="text-base font-bold text-white tracking-wide">Historical Scan Snapshots</h2>
          <span className="text-xs font-mono text-slate-400">{history.length} Snapshots Logged</span>
        </div>

        <div className="rounded-xl border border-white/10 overflow-hidden bg-slate-950/60 shadow-xl">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-white/5 text-slate-400 border-b border-white/10">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Asset Host</th>
                <th className="p-3">IP Address</th>
                <th className="p-3">Open Ports</th>
                <th className="p-3">Threats</th>
                <th className="p-3">Calculated Risk</th>
                <th className="p-3 text-right">Defense Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {history.map((h) => (
                <tr key={h.id} className="hover:bg-white/[0.03] transition">
                  <td className="p-3 text-slate-400">
                    {h.scannedAt ? new Date(h.scannedAt).toLocaleString() : "--"}
                  </td>
                  <td className="p-3 text-white font-bold">{h.hostname || "localhost"}</td>
                  <td className="p-3 text-cyan-300 font-bold">{h.ipAddress}</td>
                  <td className="p-3 text-violet-300">{h.openPortCount} Ports</td>
                  <td className="p-3 text-amber-300">{h.threatCount} Threats</td>
                  <td className="p-3">
                    <span className="font-bold text-white">{h.riskScore}</span> ({h.riskLevel})
                  </td>
                  <td className="p-3 text-right text-emerald-300">{h.recommendationCount}</td>
                </tr>
              ))}
              {!history.length && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No scan history logged yet. Run a Recon scan to create the first snapshot.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Page Navigation Footer */}
      <div className="flex items-center justify-between border-t border-white/10 pt-4">
        <button
          onClick={() => switchPage("risk")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-xs font-mono text-slate-300 hover:text-white hover:bg-white/5 transition cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Risk Matrix</span>
        </button>

        <button
          onClick={() => switchPage("overview")}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-xs font-mono font-bold text-slate-950 hover:brightness-110 transition cursor-pointer shadow-lg shadow-cyan-950/40"
        >
          <ArrowUp className="h-4 w-4" />
          <span>Return to Executive Overview</span>
        </button>
      </div>
    </div>
  );
}
