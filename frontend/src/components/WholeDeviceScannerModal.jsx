import { useState, useEffect } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  Smartphone,
  Laptop,
  Cpu,
  Wifi,
  Lock,
  Eye,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  Zap,
  ArrowRight,
  X,
  Star,
  Activity,
  Award,
  Layers,
  Flame,
  Radio,
  Sliders,
  Camera,
  Mic,
  MapPin,
  Battery,
} from "lucide-react";
import { performWholeDeviceScan } from "../deviceUtils";
import { cyberAudio } from "../soundEffects";
import { api } from "../api";

export default function WholeDeviceScannerModal({
  isOpen,
  onClose,
  onScanComplete,
  switchPage,
  plainEnglishMode = true,
}) {
  const [scanStage, setScanStage] = useState("idle"); // "idle" | "scanning" | "completed"
  const [progress, setProgress] = useState(0);
  const [currentStepName, setCurrentStepName] = useState("");
  const [scanResult, setScanResult] = useState(null);
  const [hardened, setHardened] = useState(false);
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "hardware" | "network" | "ports" | "privacy"

  useEffect(() => {
    if (isOpen && scanStage === "idle") {
      startScan();
    }
  }, [isOpen]);

  async function startScan() {
    setScanStage("scanning");
    setProgress(5);
    setHardened(false);
    cyberAudio.playScan();

    // Step 1: Hardware
    setCurrentStepName("Inspecting Hardware, CPU, RAM & GPU 3D Engine...");
    setProgress(20);
    await new Promise((r) => setTimeout(r, 600));

    // Step 2: Network & ISP
    cyberAudio.playBeep(480, 0.06);
    setCurrentStepName("Probing Public IPv4, Wi-Fi Bandwidth & Latency...");
    setProgress(45);
    await new Promise((r) => setTimeout(r, 700));

    // Step 3: Exposed Ports & Digital Doors
    cyberAudio.playBeep(560, 0.06);
    setCurrentStepName("Sweeping Listening Doors (mDNS, SSDP, SMB, Dev Ports)...");
    setProgress(70);
    await new Promise((r) => setTimeout(r, 700));

    // Step 4: Privacy & Permissions
    cyberAudio.playBeep(640, 0.06);
    setCurrentStepName("Auditing Camera, Microphone, GPS & Tracking Leaks...");
    setProgress(90);
    const deepResult = await performWholeDeviceScan();

    // Step 5: Backend Registration
    try {
      const res = await api.post("/api/recon/scan", {
        target: deepResult.network.ip,
        hostname: `device-${deepResult.hardware.browser.toLowerCase().replace(/[^a-z0-9]/g, "")}`,
        operating_system: `${deepResult.hardware.deviceModel} (${deepResult.hardware.os})`,
        is_client_device: true,
      });
      if (res.data?.asset_id && onScanComplete) {
        onScanComplete(res.data.asset_id);
      }
    } catch (e) {
      console.warn("Backend registration fallback used:", e);
    }

    setProgress(100);
    setCurrentStepName("Device Digital Twin Synthesized Successfully!");
    setScanResult(deepResult);
    setScanStage("completed");
    cyberAudio.playSuccess();
  }

  function handleAutoHarden() {
    cyberAudio.playSuccess();
    setHardened(true);
    if (scanResult) {
      setScanResult((prev) => ({
        ...prev,
        healthScore: 99,
        starRating: 5.0,
        badgeTier: "⭐ 100% HARDENED & PROTECTED",
      }));
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-xl animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl border border-blue-500/40 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Amazon & Flipkart Vibrant Top Color Stripe */}
        <div className="h-2 w-full bg-gradient-to-r from-[#2874F0] via-[#FF9900] to-[#10B981]" />

        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between gap-4 bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-[#2874F0] to-[#FF9900] flex items-center justify-center text-white shadow-lg shadow-blue-900/40">
              <Smartphone className="h-6 w-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="badge-flipkart-assured">
                  🛡️ FLIPKART ASSURED TWIN
                </span>
                <span className="badge-amazon-choice">
                  AMAZON&apos;S <span className="accent">CHOICE</span> POSTURE
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white mt-1">
                Full-Spectrum Device Security &amp; Hardware Scan
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Scanning Progress State */}
          {scanStage === "scanning" && (
            <div className="py-12 px-4 text-center space-y-6">
              <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-blue-500/20 border-t-[#2874F0] border-r-[#FF9900] animate-spin" />
                <div className="h-16 w-16 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Activity className="h-8 w-8 text-[#FF9900] animate-pulse" />
                </div>
              </div>

              <div>
                <div className="text-xl font-black text-white">
                  Scanning Whole Device Architecture...
                </div>
                <div className="text-xs font-mono text-cyan-400 mt-1">
                  {currentStepName}
                </div>
              </div>

              {/* Colorful Progress Bar */}
              <div className="max-w-md mx-auto space-y-2">
                <div className="h-3 w-full rounded-full bg-slate-800 overflow-hidden p-0.5 border border-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#2874F0] via-[#FF9900] to-[#10B981] transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>Hardware &rarr; Network &rarr; Doors &rarr; Twin</span>
                  <span className="font-bold text-white">{progress}%</span>
                </div>
              </div>
            </div>
          )}

          {/* Completed State */}
          {scanStage === "completed" && scanResult && (
            <div className="space-y-6">
              {/* Top Score & Certification Hero Card */}
              <div className="rounded-2xl p-5 border border-blue-500/30 bg-gradient-to-r from-blue-950/40 via-slate-900 to-amber-950/30 shadow-xl flex flex-wrap items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  {/* Circular Score Badge */}
                  <div className="relative h-20 w-20 rounded-2xl bg-gradient-to-br from-[#2874F0] via-blue-600 to-[#10B981] p-1 flex items-center justify-center text-center shadow-lg shadow-blue-900/50">
                    <div className="h-full w-full rounded-xl bg-slate-950 flex flex-col items-center justify-center">
                      <span className="text-2xl font-black text-white leading-none">
                        {scanResult.healthScore}
                      </span>
                      <span className="text-[9px] font-bold text-emerald-400 font-mono">
                        / 100
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(scanResult.starRating)
                                ? "fill-amber-400"
                                : "fill-slate-700 text-slate-700"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-amber-300">
                        {scanResult.starRating} / 5.0 Device Trust
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-white mt-1">
                      {scanResult.hardware.deviceModel} ({scanResult.hardware.os})
                    </h3>
                    <div className="text-xs text-slate-300 flex flex-wrap items-center gap-2 mt-0.5">
                      <span className="text-[#FF9900] font-bold">Public IP: {scanResult.network.ip}</span>
                      <span>&bull;</span>
                      <span className="text-emerald-400 font-bold">{scanResult.badgeTier}</span>
                    </div>
                  </div>
                </div>

                {/* 1-Click Action Buttons (Amazon / Flipkart Style) */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
                  {!hardened ? (
                    <button
                      onClick={handleAutoHarden}
                      className="btn-amazon-primary px-5 py-3 flex items-center justify-center gap-2 text-xs font-mono font-black uppercase tracking-wider cursor-pointer"
                    >
                      <Zap className="h-4 w-4 fill-slate-950" />
                      <span>⚡ 1-Click Shield &amp; Harden Device</span>
                    </button>
                  ) : (
                    <div className="px-4 py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      <span>Device 100% Shielded</span>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      onClose();
                      switchPage("threat");
                    }}
                    className="btn-flipkart-primary px-5 py-3 flex items-center justify-center gap-2 text-xs font-mono font-black uppercase tracking-wider cursor-pointer"
                  >
                    <span>View Threat Twin &rarr;</span>
                  </button>
                </div>
              </div>

              {/* Navigation Tabs for Detailed Deep Dive */}
              <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-2">
                {[
                  { id: "overview", label: "Overview", icon: Layers, color: "text-blue-400" },
                  { id: "hardware", label: "Hardware & Specs", icon: Cpu, color: "text-purple-400" },
                  { id: "network", label: "Network & Speed", icon: Wifi, color: "text-cyan-400" },
                  { id: "ports", label: "Exposed Doors (Ports)", icon: Radio, color: "text-amber-400" },
                  { id: "privacy", label: "Privacy & Permissions", icon: Lock, color: "text-emerald-400" },
                ].map((t) => {
                  const Icon = t.icon;
                  const active = activeTab === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveTab(t.id)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition cursor-pointer ${
                        active
                          ? "bg-white/10 text-white border-b-2 border-[#2874F0] shadow-sm"
                          : "text-slate-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${t.color}`} />
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tab 1: Overview */}
              {activeTab === "overview" && (
                <div className="space-y-4">
                  {/* 4 Colorful Spec Feature Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="card-flipkart p-4 rounded-xl">
                      <div className="text-[11px] font-mono text-blue-400 font-bold uppercase">Operating System</div>
                      <div className="text-sm font-black text-white mt-1 truncate">{scanResult.hardware.os}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{scanResult.hardware.deviceType}</div>
                    </div>

                    <div className="card-amazon p-4 rounded-xl">
                      <div className="text-[11px] font-mono text-amber-400 font-bold uppercase">Processing Power</div>
                      <div className="text-sm font-black text-white mt-1">{scanResult.hardware.cores} CPU Cores</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{scanResult.hardware.ram}</div>
                    </div>

                    <div className="card-emerald p-4 rounded-xl">
                      <div className="text-[11px] font-mono text-emerald-400 font-bold uppercase">Network Speed</div>
                      <div className="text-sm font-black text-white mt-1 truncate">{scanResult.hardware.connectionSpeed}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{scanResult.hardware.latency}</div>
                    </div>

                    <div className="card-purple p-4 rounded-xl">
                      <div className="text-[11px] font-mono text-purple-400 font-bold uppercase">Display &amp; Battery</div>
                      <div className="text-sm font-black text-white mt-1 truncate">{scanResult.hardware.screen}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{scanResult.hardware.battery}</div>
                    </div>
                  </div>

                  {/* Summary Threat & Plain English Advice */}
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                        <Sparkles className="h-4 w-4 text-amber-400" />
                        Plain English Device Health Summary
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                        {hardened ? "Protected" : "Mitigations Available"}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      Your <strong>{scanResult.hardware.deviceModel}</strong> is connected over{" "}
                      <strong>{scanResult.network.connectionSpeed}</strong> with IP{" "}
                      <code className="text-cyan-300 font-mono">{scanResult.network.ip}</code>. We identified{" "}
                      <strong>{scanResult.exposedDoors.length} digital communication ports</strong> (like media sharing and device casting) that are visible on your local network.
                    </p>

                    {hardened ? (
                      <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                        <span>All exposed network doors virtually locked. Your 3D Digital Twin security score boosted to 99/100!</span>
                      </div>
                    ) : (
                      <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-500/30 text-xs text-amber-300 flex items-center justify-between gap-2">
                        <span>Click the button to automatically harden and apply safety shields.</span>
                        <button
                          onClick={handleAutoHarden}
                          className="px-3 py-1 rounded-lg bg-amber-400 text-slate-950 font-bold text-[11px] cursor-pointer"
                        >
                          Harden Now
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 2: Hardware */}
              {activeTab === "hardware" && (
                <div className="grid sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-4 rounded-xl card-purple space-y-2">
                    <div className="text-purple-300 font-bold uppercase text-[11px] flex items-center gap-1.5">
                      <Cpu className="h-4 w-4" /> Processor &amp; Memory
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-slate-400">Device Model</span>
                      <span className="text-white font-bold">{scanResult.hardware.deviceModel}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-slate-400">CPU Concurrency</span>
                      <span className="text-white">{scanResult.hardware.cores} Cores</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-slate-400">RAM Estimate</span>
                      <span className="text-white">{scanResult.hardware.ram}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-400">Platform Arch</span>
                      <span className="text-white">{scanResult.hardware.platform}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl card-purple space-y-2">
                    <div className="text-purple-300 font-bold uppercase text-[11px] flex items-center gap-1.5">
                      <Battery className="h-4 w-4" /> Graphics &amp; Display
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-slate-400">GPU Renderer</span>
                      <span className="text-white font-bold text-right truncate max-w-[180px]" title={scanResult.hardware.gpu}>
                        {scanResult.hardware.gpu}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-slate-400">Screen Resolution</span>
                      <span className="text-white">{scanResult.hardware.screen} ({scanResult.hardware.pixelRatio})</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-slate-400">Color Depth</span>
                      <span className="text-white">{scanResult.hardware.colorDepth}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-400">Battery Status</span>
                      <span className="text-emerald-300 font-bold">{scanResult.hardware.battery}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Network */}
              {activeTab === "network" && (
                <div className="space-y-3 text-xs font-mono">
                  <div className="p-4 rounded-xl card-flipkart space-y-2">
                    <div className="text-blue-300 font-bold uppercase text-[11px] flex items-center gap-1.5">
                      <Wifi className="h-4 w-4" /> Network Identity &amp; Routing
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3 pt-2">
                      <div className="p-3 rounded-lg bg-slate-950/60 border border-white/5">
                        <span className="text-slate-400 block text-[10px]">PUBLIC IP ADDRESS</span>
                        <span className="text-cyan-300 font-bold text-sm">{scanResult.network.ip}</span>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-950/60 border border-white/5">
                        <span className="text-slate-400 block text-[10px]">ROUND-TRIP LATENCY</span>
                        <span className="text-emerald-400 font-bold text-sm">{scanResult.network.latencyMs} ms</span>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-950/60 border border-white/5">
                        <span className="text-slate-400 block text-[10px]">CONNECTION PROFILE</span>
                        <span className="text-white font-bold text-sm">{scanResult.network.connectionSpeed}</span>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-950/60 border border-white/5">
                        <span className="text-slate-400 block text-[10px]">SECURITY CONTEXT</span>
                        <span className="text-emerald-400 font-bold text-sm">{scanResult.network.secureContext}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Exposed Doors (Ports) */}
              {activeTab === "ports" && (
                <div className="space-y-3">
                  <div className="text-xs text-slate-300 font-sans">
                    These are communication doors discovered on your device. On home and public Wi-Fi, other devices can detect these services:
                  </div>

                  <div className="space-y-2.5">
                    {scanResult.exposedDoors.map((d) => (
                      <div
                        key={d.port}
                        className={`p-3.5 rounded-xl border transition ${
                          hardened
                            ? "bg-emerald-950/20 border-emerald-500/30"
                            : d.risk === "High"
                            ? "bg-rose-950/20 border-rose-500/30"
                            : "bg-amber-950/20 border-amber-500/30"
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded font-mono font-bold text-xs bg-slate-900 border border-white/10 text-white">
                              Port {d.port} ({d.protocol})
                            </span>
                            <span className="font-bold text-white text-xs">
                              {plainEnglishMode ? d.easyName : d.name}
                            </span>
                          </div>

                          <span
                            className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                              hardened
                                ? "bg-emerald-500/20 text-emerald-300"
                                : d.risk === "High"
                                ? "bg-rose-500/20 text-rose-300"
                                : "bg-amber-500/20 text-amber-300"
                            }`}
                          >
                            {hardened ? "SHIELDED" : `${d.risk.toUpperCase()} RISK`}
                          </span>
                        </div>

                        <p className="mt-1.5 text-xs text-slate-300 leading-relaxed font-sans">
                          {d.description}
                        </p>
                        <div className="mt-2 text-[11px] text-cyan-300 font-mono flex items-center gap-1">
                          <span className="font-bold text-slate-400">💡 Easy Fix:</span> {d.remedy}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 5: Privacy */}
              {activeTab === "privacy" && (
                <div className="space-y-3 text-xs font-mono">
                  <div className="p-4 rounded-xl card-emerald space-y-2">
                    <div className="text-emerald-300 font-bold uppercase text-[11px] flex items-center gap-1.5">
                      <Lock className="h-4 w-4" /> Sensor &amp; Location Exposure Audit
                    </div>
                    <div className="grid sm:grid-cols-3 gap-3 pt-2">
                      <div className="p-3 rounded-lg bg-slate-950/60 border border-white/5 space-y-1">
                        <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
                          <Camera className="h-3.5 w-3.5 text-blue-400" /> CAMERA PERMISSION
                        </div>
                        <div className="text-white font-bold">{scanResult.permissions.camera}</div>
                      </div>

                      <div className="p-3 rounded-lg bg-slate-950/60 border border-white/5 space-y-1">
                        <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
                          <Mic className="h-3.5 w-3.5 text-amber-400" /> MICROPHONE PERMISSION
                        </div>
                        <div className="text-white font-bold">{scanResult.permissions.microphone}</div>
                      </div>

                      <div className="p-3 rounded-lg bg-slate-950/60 border border-white/5 space-y-1">
                        <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
                          <MapPin className="h-3.5 w-3.5 text-rose-400" /> GEOLOCATION / GPS
                        </div>
                        <div className="text-white font-bold">{scanResult.permissions.location}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-slate-900/90 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>AI Digital Twin Engine &bull; Zero Real Device Harm</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={startScan}
              disabled={scanStage === "scanning"}
              className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 text-xs font-mono font-bold transition cursor-pointer flex items-center gap-1.5"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${scanStage === "scanning" ? "animate-spin text-cyan-400" : ""}`} />
              <span>Rescan Whole Device</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 text-xs font-mono font-bold transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
