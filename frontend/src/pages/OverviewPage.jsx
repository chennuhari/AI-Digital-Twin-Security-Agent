import { useState, useEffect } from "react";
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
  Sparkles,
  Smartphone,
  Star,
  Zap,
} from "lucide-react";
import { getVisitorDeviceInfo, fetchVisitorIp } from "../deviceUtils";

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
  scanVisitorDevice,
  onOpenWholeDeviceScanner,
  plainEnglishMode = true,
}) {
  const [visitorInfo, setVisitorInfo] = useState(null);
  const [visitorIp, setVisitorIp] = useState("Detecting IP...");
  const [scanningMyDevice, setScanningMyDevice] = useState(false);

  useEffect(() => {
    const info = getVisitorDeviceInfo();
    setVisitorInfo(info);
    fetchVisitorIp().then((ip) => setVisitorIp(ip));
  }, []);

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Executive Hero Banner (Amazon & Flipkart Vibrant Colors) */}
      <div className="relative overflow-hidden rounded-3xl border border-blue-500/30 bg-gradient-to-br from-slate-950/95 via-slate-900/90 to-blue-950/40 p-7 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-2xl">
            {/* Vibrant E-Commerce Trust Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="badge-flipkart-assured">
                🛡️ FLIPKART ASSURED TWIN
              </span>
              <span className="badge-amazon-choice">
                AMAZON&apos;S <span className="accent">CHOICE</span> SECURITY
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-mono text-[10px] font-bold">
                ⭐ 4.9/5 RATED DEFENSE
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Enterprise Digital Twin <br />
              <span className="bg-gradient-to-r from-[#2874F0] via-[#FF9900] to-[#10B981] bg-clip-text text-transparent">
                Security Command Center
              </span>
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
              Continuous reconnaissance, graph-theoretic threat modeling, and proactive mitigation across physical and cloud network infrastructures. Select any IP address or deep-scan your current device to generate an isolated 3D digital twin.
            </p>
          </div>

          <div className="flex flex-col gap-2.5 shrink-0 w-full sm:w-auto">
            {/* Primary Amazon Amber 1-Click Scan Button */}
            <button
              onClick={() => {
                if (onOpenWholeDeviceScanner) onOpenWholeDeviceScanner();
                else if (scanVisitorDevice) scanVisitorDevice();
              }}
              className="btn-amazon-primary px-6 py-3.5 flex items-center justify-center gap-2 text-xs font-mono font-black uppercase tracking-wider cursor-pointer shadow-xl"
            >
              <Smartphone className="h-4 w-4 text-slate-950" />
              <span>📱 Scan Whole Device (Phone/PC)</span>
            </button>

            <button
              onClick={() => switchPage("diagram")}
              className="btn-flipkart-primary px-6 py-3 flex items-center justify-center gap-2 text-xs font-mono font-black uppercase tracking-wider cursor-pointer shadow-lg"
            >
              <Compass className="h-4 w-4" />
              <span>Open 3D Twin Diagram</span>
            </button>
          </div>
        </div>
      </div>

      {/* Plain English Guide for Non-Technical Users */}
      {plainEnglishMode && (
        <div className="p-5 rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-950/30 via-slate-900/80 to-amber-950/20 backdrop-blur-md shadow-xl">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
            <Sparkles className="h-4 w-4 text-amber-400 shrink-0" />
            <span>💡 How this system works in 3 Easy Steps (Plain English):</span>
          </div>
          <div className="mt-3 grid sm:grid-cols-3 gap-3 text-xs text-slate-300 font-sans">
            <div className="p-3.5 rounded-xl card-flipkart">
              <span className="font-bold text-blue-400 block mb-1">1. Scan &amp; Discover</span>
              Tap <strong>&ldquo;Scan Whole Device&rdquo;</strong> to inspect phone hardware, Wi-Fi speed, and open digital doors. We create a safe 3D virtual copy.
            </div>
            <div className="p-3.5 rounded-xl card-amazon">
              <span className="font-bold text-amber-400 block mb-1">2. Simulate Attacks</span>
              Our AI simulates how an internet intruder would try to break into your virtual copy, without touching or risking your real phone.
            </div>
            <div className="p-3.5 rounded-xl card-emerald">
              <span className="font-bold text-emerald-400 block mb-1">3. 1-Click Hardening</span>
              Click <strong>&ldquo;1-Click Shield &amp; Harden&rdquo;</strong> to lock vulnerable ports, stop local eavesdropping, and raise your score to 100%!
            </div>
          </div>
        </div>
      )}

      {/* Visitor Device Threat Telemetry Widget (Vibrant E-Commerce Card) */}
      <div className="rounded-2xl border border-blue-500/40 bg-gradient-to-r from-blue-950/50 via-slate-900/95 to-amber-950/40 p-5 shadow-2xl backdrop-blur-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#2874F0] to-[#FF9900] flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-950/60">
            <Smartphone className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="badge-flipkart-assured">
                AI DEVICE SCANNER
              </span>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live Client Telemetry
              </span>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs font-mono text-slate-300">
              <span className="text-white font-bold">{visitorInfo?.deviceModel || "Workstation"}</span>
              <span>·</span>
              <span className="text-blue-300">{visitorInfo?.os || "OS"}</span>
              <span>·</span>
              <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-emerald-300 font-bold">
                IP: {visitorIp}
              </span>
              <span className="text-slate-400 text-[11px] hidden sm:inline">({visitorInfo?.screen})</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              if (onOpenWholeDeviceScanner) onOpenWholeDeviceScanner();
              else if (scanVisitorDevice) scanVisitorDevice();
            }}
            className="btn-amazon-primary px-5 py-2.5 flex items-center gap-2 text-xs font-mono font-black uppercase tracking-wider cursor-pointer shadow-lg"
          >
            <Zap className="h-4 w-4 fill-slate-950" />
            <span>Deep Scan Whole Device</span>
          </button>
        </div>
      </div>

      {/* 4 Executive KPI Hero Cards (Flipkart Blue, Amazon Orange, Rose, Emerald) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-flipkart p-5 rounded-2xl relative overflow-hidden group hover:border-blue-400 transition">
          <div className="flex items-center justify-between text-xs font-mono text-blue-300 font-bold">
            <span>MONITORED TWINS</span>
            <Server className="h-4 w-4 text-blue-400" />
          </div>
          <div className="mt-3 text-3xl font-black font-mono text-white tracking-tight">
            {assets.length} <span className="text-xs font-normal text-slate-400">Hosts</span>
          </div>
          <p className="mt-1 text-xs text-slate-300">Synchronized in PostgreSQL &amp; Neo4j</p>
        </div>

        <div className="card-amazon p-5 rounded-2xl relative overflow-hidden group hover:border-amber-400 transition">
          <div className="flex items-center justify-between text-xs font-mono text-amber-300 font-bold">
            <span>EXPOSED SOCKETS</span>
            <Radar className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-3 text-3xl font-black font-mono text-amber-300 tracking-tight">
            {ports.length} <span className="text-xs font-normal text-slate-400">Ports</span>
          </div>
          <p className="mt-1 text-xs text-slate-300">Active attack surface listening services</p>
        </div>

        <div className="card-rose p-5 rounded-2xl relative overflow-hidden group hover:border-rose-400 transition">
          <div className="flex items-center justify-between text-xs font-mono text-rose-300 font-bold">
            <span>ACTIVE THREATS</span>
            <Flame className="h-4 w-4 text-rose-400" />
          </div>
          <div className="mt-3 text-3xl font-black font-mono text-rose-400 tracking-tight">
            {threats.length} <span className="text-xs font-normal text-slate-400">CVEs</span>
          </div>
          <p className="mt-1 text-xs text-slate-300">Exploit vectors identified by Threat Agent</p>
        </div>

        <div className="card-emerald p-5 rounded-2xl relative overflow-hidden group hover:border-emerald-400 transition">
          <div className="flex items-center justify-between text-xs font-mono text-emerald-300 font-bold">
            <span>DEFENSE MITIGATIONS</span>
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-3 text-3xl font-black font-mono text-emerald-400 tracking-tight">
            {defense?.recommendations?.length || 0} <span className="text-xs font-normal text-slate-400">Playbooks</span>
          </div>
          <p className="mt-1 text-xs text-slate-300">CIS/NIST aligned hardening playbooks</p>
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
          {/* Agent 1: Recon (Flipkart Blue) */}
          <div
            onClick={() => switchPage("recon")}
            className="card-flipkart p-5 rounded-2xl hover:border-blue-400 transition cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="p-2 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-300 group-hover:scale-110 transition">
                  <Radar className="h-5 w-5" />
                </span>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-mono font-bold">
                  ACTIVE 7.99
                </span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition">Recon Agent</h3>
              <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
                Autonomous discovery engine detecting listening ports, OS fingerprints, and exposed digital doors.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-blue-400">
              <span>Launch Discovery</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Agent 2: Threat (Crimson Rose) */}
          <div
            onClick={() => switchPage("threat")}
            className="card-rose p-5 rounded-2xl hover:border-rose-400 transition cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="p-2 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 group-hover:scale-110 transition">
                  <Flame className="h-5 w-5" />
                </span>
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold">
                  SIMULATING
                </span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-rose-300 transition">Threat Agent</h3>
              <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
                Graph-theoretic attack simulator calculating multi-hop kill chains targeting crown jewels.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-rose-400">
              <span>Inspect Attack Paths</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Agent 3: Defense (Emerald Green) */}
          <div
            onClick={() => switchPage("defense")}
            className="card-emerald p-5 rounded-2xl hover:border-emerald-400 transition cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 group-hover:scale-110 transition">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                  READY
                </span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition">Defense Agent</h3>
              <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
                Generates prioritized CIS/NIST remediation playbooks and 1-click virtual hardening.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-emerald-400">
              <span>View Playbooks</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Agent 4: Risk (Royal Purple) */}
          <div
            onClick={() => switchPage("risk")}
            className="card-purple p-5 rounded-2xl hover:border-purple-400 transition cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 group-hover:scale-110 transition">
                  <Activity className="h-5 w-5" />
                </span>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-mono font-bold">
                  EVALUATING
                </span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition">Risk Agent</h3>
              <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
                Quantitative risk assessment engine weighing asset criticality, CVSS severity, and exposure depth.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-purple-400">
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
