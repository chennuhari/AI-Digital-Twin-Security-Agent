import { useState, useEffect } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  Server,
  Radar,
  Flame,
  Activity,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Zap,
  Smartphone,
  CheckCircle2,
  Lock,
  Search,
  Compass,
  Cpu,
} from "lucide-react";
import { getVisitorDeviceInfo, fetchVisitorIp } from "../deviceUtils";

export default function OverviewPage({
  assets,
  ports,
  threats,
  risk,
  defense,
  assetId,
  setAssetId,
  loadDashboard,
  loadEnvironmentGraph,
  showAllAssets,
  handleSelectAssetByIp,
  switchPage,
  scanVisitorDevice,
  onOpenWholeDeviceScanner,
  plainEnglishMode = true,
}) {
  const [visitorInfo, setVisitorInfo] = useState(null);
  const [visitorIp, setVisitorIp] = useState("Detecting IP...");
  const [searchIpQuery, setSearchIpQuery] = useState("");

  useEffect(() => {
    const info = getVisitorDeviceInfo();
    setVisitorInfo(info);
    fetchVisitorIp().then((ip) => setVisitorIp(ip));
  }, []);

  const filteredFleetAssets = assets.filter((a) => {
    if (!searchIpQuery) return true;
    const q = searchIpQuery.toLowerCase();
    return (
      (a.ipAddress && a.ipAddress.toLowerCase().includes(q)) ||
      (a.hostname && a.hostname.toLowerCase().includes(q)) ||
      (a.operatingSystem && a.operatingSystem.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Friendly Hero Banner (Emerald & Purple & Amber) */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-slate-950/95 via-slate-900/90 to-purple-950/40 p-7 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-2xl">
            {/* Kid-Friendly Trust Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-mono text-[11px] font-bold">
                🛡️ 100% SAFE ROBOT TWIN
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-300 font-mono text-[11px] font-bold">
                ⭐ GUARDIAN HERO ACTIVE
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 font-mono text-[10px] font-bold">
                ✨ EASY PLAIN ENGLISH
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Friendly Device Guardian <br />
              <span className="bg-gradient-to-r from-emerald-400 via-amber-300 to-purple-400 bg-clip-text text-transparent">
                Safety Command Center 🤖
              </span>
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-200 leading-relaxed font-sans">
              Think of this system like a magical robot twin of your phone or laptop. It plays in a safe toy world to test if any sneaky internet bad guys could peek inside—and puts super locks on your doors so you stay 100% safe!
            </p>
          </div>

          <div className="flex flex-col gap-2.5 shrink-0 w-full sm:w-auto">
            {/* Primary 1-Click Scan Button */}
            <button
              onClick={() => {
                if (onOpenWholeDeviceScanner) onOpenWholeDeviceScanner();
                else if (scanVisitorDevice) scanVisitorDevice();
              }}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 flex items-center justify-center gap-2 text-xs font-mono font-black uppercase tracking-wider cursor-pointer shadow-xl shadow-emerald-950/50 transition transform hover:-translate-y-0.5"
            >
              <Smartphone className="h-4 w-4 text-slate-950" />
              <span>📱 Check My Device (Phone / PC)</span>
            </button>

            <button
              onClick={() => switchPage("diagram")}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-400 hover:to-violet-500 text-white flex items-center justify-center gap-2 text-xs font-mono font-black uppercase tracking-wider cursor-pointer shadow-lg shadow-purple-950/50 transition transform hover:-translate-y-0.5"
            >
              <Compass className="h-4 w-4" />
              <span>🧭 Explore 3D Safe Twin World</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3 Super Easy Steps for Kids & Beginners */}
      <div className="p-6 rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/30 via-slate-900/90 to-purple-950/30 backdrop-blur-md shadow-xl">
        <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
          <Sparkles className="h-5 w-5 text-amber-400 shrink-0" />
          <span>💡 How Your Device Stays Safe in 3 Simple Steps:</span>
        </div>
        <div className="mt-4 grid sm:grid-cols-3 gap-3.5 text-xs text-slate-200 font-sans">
          <div className="p-4 rounded-2xl card-purple">
            <span className="font-bold text-purple-300 text-sm block mb-1">🚪 1. Inspect The Doors</span>
            We check if your phone has any digital doors or windows left unlocked on public Wi-Fi. (No personal photos or secrets are ever touched!)
          </div>
          <div className="p-4 rounded-2xl card-amber">
            <span className="font-bold text-amber-300 text-sm block mb-1">🕵️‍♂️ 2. Catch Sneaky Intruders</span>
            Our friendly detective robot simulates what a bad guy might try, safely inside a virtual toy copy so your real phone is never harmed.
          </div>
          <div className="p-4 rounded-2xl card-emerald">
            <span className="font-bold text-emerald-300 text-sm block mb-1">🔒 3. Put Super Locks On</span>
            Tap <strong>&ldquo;1-Click Shield &amp; Harden&rdquo;</strong> to put digital padlocks on all open doors and celebrate with a 100% Gold Star score! ⭐
          </div>
        </div>
      </div>

      {/* Visitor Device Telemetry Widget (Emerald & Purple Card) */}
      <div className="rounded-3xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/50 via-slate-900/95 to-purple-950/50 p-5 shadow-2xl backdrop-blur-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-purple-600 flex items-center justify-center text-slate-950 font-black shrink-0 shadow-lg shadow-emerald-950/60 text-xl">
            📱
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-emerald-400/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-mono font-bold uppercase">
                YOUR REAL DEVICE
              </span>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 font-semibold">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                Live &amp; Protected 🟢
              </span>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs font-mono text-slate-300">
              <span className="text-white font-bold">{visitorInfo?.deviceModel || "Workstation"}</span>
              <span>·</span>
              <span className="text-purple-300">{visitorInfo?.os || "OS"}</span>
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
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 flex items-center gap-2 text-xs font-mono font-black uppercase tracking-wider cursor-pointer shadow-lg shadow-emerald-950/50 transition transform hover:-translate-y-0.5"
          >
            <Zap className="h-4 w-4 fill-slate-950" />
            <span>Check My Device Safety</span>
          </button>
        </div>
      </div>

      {/* 4 Friendly KPI Score Cards (Purple, Amber, Rose, Emerald) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Safe Robot Twins */}
        <div className="card-purple p-5 rounded-3xl relative overflow-hidden group hover:border-purple-400 transition">
          <div className="flex items-center justify-between text-xs font-mono text-purple-300 font-bold">
            <span>SAFE DIGITAL COPIES 🤖</span>
            <Server className="h-4 w-4 text-purple-400" />
          </div>
          <div className="mt-3 text-3xl font-black font-mono text-white tracking-tight">
            {assets.length} <span className="text-xs font-normal text-slate-400">Robots</span>
          </div>
          <p className="mt-1 text-xs text-slate-300">Protected in our safe virtual playground</p>
        </div>

        {/* Card 2: Doors Left Open */}
        <div className="card-amber p-5 rounded-3xl relative overflow-hidden group hover:border-amber-400 transition">
          <div className="flex items-center justify-between text-xs font-mono text-amber-300 font-bold">
            <span>DOORS LEFT OPEN 🚪</span>
            <Radar className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-3 text-3xl font-black font-mono text-amber-300 tracking-tight">
            {ports.length} <span className="text-xs font-normal text-slate-400">Doors</span>
          </div>
          <p className="mt-1 text-xs text-slate-300">Digital doorways that need padlocks</p>
        </div>

        {/* Card 3: Sneaky Hazards */}
        <div className="card-rose p-5 rounded-3xl relative overflow-hidden group hover:border-rose-400 transition">
          <div className="flex items-center justify-between text-xs font-mono text-rose-300 font-bold">
            <span>SNEAKY HAZARDS ⚠️</span>
            <Flame className="h-4 w-4 text-rose-400" />
          </div>
          <div className="mt-3 text-3xl font-black font-mono text-rose-400 tracking-tight">
            {threats.length} <span className="text-xs font-normal text-slate-400">Hazards</span>
          </div>
          <p className="mt-1 text-xs text-slate-300">Tricks an intruder might try to use</p>
        </div>

        {/* Card 4: Super Shields Ready */}
        <div className="card-emerald p-5 rounded-3xl relative overflow-hidden group hover:border-emerald-400 transition">
          <div className="flex items-center justify-between text-xs font-mono text-emerald-300 font-bold">
            <span>SUPER SHIELDS READY 🛡️</span>
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-3 text-3xl font-black font-mono text-emerald-400 tracking-tight">
            {defense?.recommendations?.length || 0} <span className="text-xs font-normal text-slate-400">Locks</span>
          </div>
          <p className="mt-1 text-xs text-slate-300">1-click locks ready to protect your device</p>
        </div>
      </div>

      {/* 4 Friendly AI Robot Helpers Matrix */}
      <div>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
            <Cpu className="h-5 w-5 text-emerald-400" />
            Your 4 Friendly AI Robot Protectors
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 font-mono">
            Each robot helper has a special superpower to keep your computer or phone safe
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Agent 1: Scout Detective (Amber) */}
          <div
            onClick={() => switchPage("recon")}
            className="card-amber p-5 rounded-3xl hover:border-amber-400 transition cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="p-2.5 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 group-hover:scale-110 transition text-lg">
                  🔍
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">
                  SCOUTING
                </span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition">1. Scout Detective</h3>
              <p className="mt-1.5 text-xs text-slate-300 leading-relaxed font-sans">
                Walks around your device checking which digital doors and windows are unlocked.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-amber-300 font-bold">
              <span>Inspect Doors &rarr;</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Agent 2: Intruder Detector (Rose) */}
          <div
            onClick={() => switchPage("threat")}
            className="card-rose p-5 rounded-3xl hover:border-rose-400 transition cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="p-2.5 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 group-hover:scale-110 transition text-lg">
                  🕵️‍♂️
                </span>
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold">
                  DETECTING
                </span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-rose-300 transition">2. Intruder Detector</h3>
              <p className="mt-1.5 text-xs text-slate-300 leading-relaxed font-sans">
                Tests how a sneaky hacker would try to step inside, so we can stop them before they do!
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-rose-300 font-bold">
              <span>Catch Intruders &rarr;</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Agent 3: Super Guardian (Emerald) */}
          <div
            onClick={() => switchPage("defense")}
            className="card-emerald p-5 rounded-3xl hover:border-emerald-400 transition cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="p-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 group-hover:scale-110 transition text-lg">
                  🛡️
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                  PROTECTING
                </span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition">3. Super Guardian</h3>
              <p className="mt-1.5 text-xs text-slate-300 leading-relaxed font-sans">
                Installs strong digital padlocks on all open doors with 1 click to block anyone out.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-emerald-300 font-bold">
              <span>Lock All Doors &rarr;</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Agent 4: Safety Score Judge (Purple) */}
          <div
            onClick={() => switchPage("risk")}
            className="card-purple p-5 rounded-3xl hover:border-purple-400 transition cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="p-2.5 rounded-2xl bg-purple-500/20 border border-purple-500/40 text-purple-300 group-hover:scale-110 transition text-lg">
                  ⭐
                </span>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-mono font-bold">
                  JUDGING
                </span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition">4. Safety Score Judge</h3>
              <p className="mt-1.5 text-xs text-slate-300 leading-relaxed font-sans">
                Gives your device a safety score from 0 to 100 and celebrates when you reach top safety!
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-purple-300 font-bold">
              <span>View Gold Star Score &rarr;</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition" />
            </div>
          </div>
        </div>
      </div>

      {/* Monitored Safe Robot Twins Fleet */}
      <div className="glass-panel p-6 border-white/10 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
              <Server className="h-5 w-5 text-emerald-400" />
              Your Safe Robot Device Fleet 🖥️📱
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">
              Click any device below to explore its safe 3D world and test doors
            </p>
          </div>

          {/* IP Search Filter */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Find a device IP..."
              value={searchIpQuery}
              onChange={(e) => setSearchIpQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-2xl border border-white/10 bg-slate-900/90 text-xs font-mono text-white placeholder-slate-500 outline-none focus:border-emerald-400 transition"
            />
          </div>
        </div>

        {/* Quick IP Select Chips */}
        <div className="flex flex-wrap items-center gap-1.5 mb-5 text-xs font-mono">
          <span className="text-slate-400 text-[11px] mr-1">Quick Devices:</span>
          {assets.slice(0, 8).map((a) => (
            <button
              key={a.id}
              onClick={() => handleSelectAssetByIp(a)}
              className={`px-3 py-1 rounded-xl border transition cursor-pointer flex items-center gap-1.5 ${
                a.id === assetId && !showAllAssets
                  ? "bg-emerald-500/20 border-emerald-400/60 text-emerald-300 font-bold"
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
                className={`p-5 rounded-3xl border transition cursor-pointer group relative overflow-hidden flex flex-col justify-between ${
                  isCur
                    ? "bg-gradient-to-br from-emerald-950/40 via-slate-900/90 to-purple-950/40 border-emerald-400/60 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                    : "bg-slate-900/60 border-white/10 hover:border-emerald-500/40 hover:bg-slate-900/90"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono font-bold">
                      DEVICE #{a.id}
                    </span>
                    {a.isCrownJewel && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] font-mono font-bold">
                        ⭐ CROWN JEWEL
                      </span>
                    )}
                  </div>

                  <div className="mt-3">
                    <div className="text-xl font-bold text-white font-mono group-hover:text-emerald-300 transition">
                      {a.ipAddress}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5 font-sans">
                      {a.hostname || "Safe Device Twin"} · {a.operatingSystem || "Device OS"}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-3 text-xs font-mono text-slate-300">
                    <span className="flex items-center gap-1 text-emerald-300">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      Priority: {a.criticality || "NORMAL"}
                    </span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                  <span className="text-emerald-400 font-bold group-hover:underline flex items-center gap-1">
                    <span>Inspect 3D Twin &amp; Doors</span>
                  </span>
                  <ChevronRight className="h-4 w-4 text-emerald-400 group-hover:translate-x-1 transition" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
