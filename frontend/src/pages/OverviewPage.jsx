import {
  ShieldCheck,
  ShieldAlert,
  Flame,
  Activity,
  Radar,
  Server,
  ArrowRight,
  Search,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Compass,
  Cpu,
} from "lucide-react";

export default function OverviewPage({
  assets,
  ports,
  threats,
  defense,
  risk,
  filteredFleetAssets,
  searchIpQuery,
  setSearchIpQuery,
  assetId,
  showAllAssets,
  handleSelectAssetByIp,
  switchPage,
}) {
  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Executive Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-slate-950/95 via-slate-900/90 to-blue-950/30 p-7 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-950/60 px-3.5 py-1.5 text-xs font-mono uppercase tracking-widest text-cyan-300">
              <ShieldCheck className="h-4 w-4 text-cyan-400" />
              Autonomous AI Cybersecurity Platform
            </div>
            <h1 className="mt-3 text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Enterprise Digital Twin <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                Security Command Center
              </span>
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
              Continuous reconnaissance, graph-theoretic threat modeling, and proactive mitigation across physical and cloud network infrastructures. Select any IP address to generate its isolated 3D digital twin.
            </p>
          </div>

          <div className="flex flex-col gap-2.5 shrink-0">
            <button
              onClick={() => switchPage("diagram")}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-mono text-xs font-black uppercase tracking-wider hover:brightness-110 transition cursor-pointer shadow-lg shadow-cyan-950/50"
            >
              <Compass className="h-4 w-4" />
              <span>Open 3D Twin Diagram</span>
            </button>
            <button
              onClick={() => switchPage("recon")}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-cyan-500/40 bg-cyan-500/10 text-cyan-300 font-mono text-xs font-bold hover:bg-cyan-500/20 transition cursor-pointer"
            >
              <Radar className="h-4 w-4 text-cyan-400" />
              <span>Launch Reconnaissance</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Executive KPI Hero Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 border-cyan-500/20 relative overflow-hidden group hover:border-cyan-400/50 transition">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>MONITORED TWINS</span>
            <Server className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="mt-3 text-3xl font-black font-mono text-white tracking-tight">
            {assets.length} <span className="text-xs font-normal text-slate-400">Hosts</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">Synchronized in PostgreSQL & Neo4j</p>
        </div>

        <div className="glass-panel p-5 border-sky-500/20 relative overflow-hidden group hover:border-sky-400/50 transition">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>EXPOSED SOCKETS</span>
            <Radar className="h-4 w-4 text-sky-400" />
          </div>
          <div className="mt-3 text-3xl font-black font-mono text-sky-300 tracking-tight">
            {ports.length} <span className="text-xs font-normal text-slate-400">Ports</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">Active attack surface listening services</p>
        </div>

        <div className="glass-panel p-5 border-rose-500/20 relative overflow-hidden group hover:border-rose-400/50 transition">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>ACTIVE THREATS</span>
            <Flame className="h-4 w-4 text-rose-400" />
          </div>
          <div className="mt-3 text-3xl font-black font-mono text-rose-400 tracking-tight">
            {threats.length} <span className="text-xs font-normal text-slate-400">CVEs</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">Exploit vectors identified by Threat Agent</p>
        </div>

        <div className="glass-panel p-5 border-emerald-500/20 relative overflow-hidden group hover:border-emerald-400/50 transition">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>DEFENSE MITIGATIONS</span>
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-3 text-3xl font-black font-mono text-emerald-400 tracking-tight">
            {defense?.recommendations?.length || 0} <span className="text-xs font-normal text-slate-400">Playbooks</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">CIS/NIST aligned hardening playbooks</p>
        </div>
      </div>

      {/* 4 Autonomous AI Security Agents Matrix */}
      <div>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
            <Cpu className="h-5 w-5 text-cyan-400" />
            Autonomous AI Security Agents Matrix
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 font-mono">
            Intelligent proactive agents performing continuous multi-layer defense
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Agent 1: Recon */}
          <div
            onClick={() => switchPage("recon")}
            className="glass-panel p-5 border-cyan-500/25 hover:border-cyan-400/60 transition cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 group-hover:scale-110 transition">
                  <Radar className="h-5 w-5" />
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 text-[10px] font-mono font-bold">
                  ACTIVE
                </span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition">Recon Agent</h3>
              <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                Autonomous Nmap discovery engine detecting listening ports, OS fingerprints, and service banners.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-cyan-400">
              <span>Open Console</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Agent 2: Threat */}
          <div
            onClick={() => switchPage("threat")}
            className="glass-panel p-5 border-rose-500/25 hover:border-rose-400/60 transition cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 group-hover:scale-110 transition">
                  <Flame className="h-5 w-5" />
                </span>
                <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 text-[10px] font-mono font-bold">
                  SIMULATING
                </span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-rose-300 transition">Threat Agent</h3>
              <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                Graph-theoretic attack simulator calculating multi-hop kill chains targeting crown jewels.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-rose-400">
              <span>Inspect Attack Paths</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Agent 3: Defense */}
          <div
            onClick={() => switchPage("defense")}
            className="glass-panel p-5 border-emerald-500/25 hover:border-emerald-400/60 transition cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 group-hover:scale-110 transition">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 text-[10px] font-mono font-bold">
                  READY
                </span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition">Defense Agent</h3>
              <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                Generates prioritized CIS/NIST remediation playbooks and 1-click virtual hardening.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-emerald-400">
              <span>View Playbooks</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Agent 4: Risk */}
          <div
            onClick={() => switchPage("risk")}
            className="glass-panel p-5 border-amber-500/25 hover:border-amber-400/60 transition cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 group-hover:scale-110 transition">
                  <Activity className="h-5 w-5" />
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 text-[10px] font-mono font-bold">
                  EVALUATING
                </span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition">Risk Agent</h3>
              <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                Quantitative risk assessment engine weighing asset criticality, CVSS severity, and exposure depth.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-amber-400">
              <span>Risk Heatmap</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition" />
            </div>
          </div>
        </div>
      </div>

      {/* Monitored Digital Twin Fleet Inventory (With IP Filtering & 1-Click Dedicated Twin Open) */}
      <div className="glass-panel p-6 border-white/10 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
              <Server className="h-5 w-5 text-cyan-400" />
              Monitored Fleet Digital Twins
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">
              Click any device to open its dedicated IP page and isolated 3D constellation
            </p>
          </div>

          {/* IP Search Filter */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by IP address..."
              value={searchIpQuery}
              onChange={(e) => setSearchIpQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-white/10 bg-slate-900/90 text-xs font-mono text-white placeholder-slate-500 outline-none focus:border-cyan-400 transition"
            />
          </div>
        </div>

        {/* Quick IP Select Chips */}
        <div className="flex flex-wrap items-center gap-1.5 mb-5 text-xs font-mono">
          <span className="text-slate-500 text-[11px] mr-1">Quick Select IP:</span>
          {assets.slice(0, 8).map((a) => (
            <button
              key={a.id}
              onClick={() => handleSelectAssetByIp(a)}
              className={`px-2.5 py-1 rounded-lg border transition cursor-pointer flex items-center gap-1.5 ${
                a.id === assetId && !showAllAssets
                  ? "bg-cyan-500/20 border-cyan-400/60 text-cyan-300 font-bold"
                  : "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10"
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {a.ipAddress}
            </button>
          ))}
        </div>

        {/* Fleet Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFleetAssets.map((a) => {
            const isCur = a.id === assetId && !showAllAssets;
            return (
              <div
                key={a.id}
                onClick={() => handleSelectAssetByIp(a)}
                className={`p-5 rounded-2xl border transition cursor-pointer group relative overflow-hidden flex flex-col justify-between ${
                  isCur
                    ? "bg-gradient-to-br from-cyan-950/40 via-slate-900/90 to-slate-950 border-cyan-400/60 shadow-[0_0_20px_rgba(0,240,255,0.15)]"
                    : "bg-slate-900/60 border-white/10 hover:border-cyan-500/40 hover:bg-slate-900/90"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono font-bold">
                      ASSET #{a.id}
                    </span>
                    {a.isCrownJewel && (
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] font-mono font-bold">
                        CROWN JEWEL
                      </span>
                    )}
                  </div>

                  <div className="mt-3">
                    <div className="text-xl font-bold text-white font-mono group-hover:text-cyan-300 transition">
                      {a.ipAddress}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {a.hostname || "Production Host"} · {a.operatingSystem || "Linux / Windows"}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-3 text-xs font-mono text-slate-300">
                    <span className="flex items-center gap-1 text-cyan-300">
                      <CheckCircle2 className="h-3 w-3 text-cyan-400" />
                      Criticality: {a.criticality || "HIGH"}
                    </span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                  <span className="text-cyan-400 font-bold group-hover:underline flex items-center gap-1">
                    <span>Open 3D Twin & Telemetry</span>
                  </span>
                  <ChevronRight className="h-4 w-4 text-cyan-400 group-hover:translate-x-1 transition" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
