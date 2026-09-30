import {
  TerminalSquare,
  FileDown,
  ArrowLeft,
  ArrowUp,
  BookOpen,
} from "lucide-react";

export default function AuditPage({
  history,
  exportReport,
  switchPage,
}) {
  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Banner (Purple & Emerald - No Blue) */}
      <div className="card-purple p-6 rounded-3xl shadow-2xl relative overflow-hidden flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 font-mono text-xs font-bold">
              📜 ROBOT DIARY
            </span>
            <span className="text-xs font-mono text-emerald-300 font-bold">
              Safe Memory Records
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wide mt-1.5 flex items-center gap-2">
            <TerminalSquare className="h-7 w-7 text-purple-400" />
            Robot Diary - Everything Our Guardian Did 📜
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 mt-1 font-sans max-w-2xl leading-relaxed">
            This is our friendly robot's memory diary! Every time it checks your doors, catches an intruder, or puts on super locks, it writes an entry down here so you can look back anytime.
          </p>
        </div>

        <button
          onClick={exportReport}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-purple-500/20 border border-purple-400/40 text-purple-300 font-mono text-xs font-bold hover:bg-purple-500/30 transition cursor-pointer shadow-md"
        >
          <FileDown className="h-4 w-4" />
          <span>Save Diary (JSON File)</span>
        </button>
      </div>

      {/* Audit History Ledger Table */}
      <div className="glass-panel p-6 border-white/10 shadow-2xl">
        <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
          <h2 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-emerald-400" />
            <span>Checkup History Snapshots</span>
          </h2>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 font-bold">
            {history.length} CHECKUPS SAVED
          </span>
        </div>

        <div className="rounded-2xl border border-white/10 overflow-hidden bg-slate-950/60 shadow-xl">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-white/5 text-slate-400 border-b border-white/10">
              <tr>
                <th className="p-3">When</th>
                <th className="p-3">Device Name</th>
                <th className="p-3">IP Address</th>
                <th className="p-3">Doors Checked</th>
                <th className="p-3">Hazards</th>
                <th className="p-3">Safety Health</th>
                <th className="p-3 text-right">Locks Put On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {history.map((h) => (
                <tr key={h.id} className="hover:bg-white/[0.03] transition">
                  <td className="p-3 text-slate-400">
                    {h.scannedAt ? new Date(h.scannedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--"}
                  </td>
                  <td className="p-3 text-white font-bold">{h.hostname || "localhost"}</td>
                  <td className="p-3 text-emerald-300 font-bold">{h.ipAddress}</td>
                  <td className="p-3 text-purple-300">{h.openPortCount} Doors</td>
                  <td className="p-3 text-amber-300">{h.threatCount} Hazards</td>
                  <td className="p-3">
                    <span className="font-bold text-white">{Math.max(0, 100 - (h.riskScore || 50))}%</span> ({h.riskLevel})
                  </td>
                  <td className="p-3 text-right text-emerald-300 font-bold">{h.recommendationCount} Locks</td>
                </tr>
              ))}
              {!history.length && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No diary entries yet! Run a checkup from the Door Inspector to write the first one.
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
          <span>Back to Safety Score</span>
        </button>

        <button
          onClick={() => switchPage("overview")}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 text-xs font-mono font-black text-slate-950 hover:brightness-110 transition cursor-pointer shadow-lg shadow-emerald-950/40 uppercase tracking-wider"
        >
          <ArrowUp className="h-4 w-4 text-slate-950" />
          <span>Return to Robot Overview</span>
        </button>
      </div>
    </div>
  );
}
