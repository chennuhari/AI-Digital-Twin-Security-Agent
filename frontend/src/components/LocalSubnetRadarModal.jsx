import { useState, useEffect } from "react";
import {
  Radio,
  Wifi,
  Tv,
  Printer,
  Gamepad2,
  Laptop,
  Smartphone,
  Router,
  Speaker,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  RefreshCw,
  X,
  Plus,
  CheckCircle2,
} from "lucide-react";
import { cyberAudio } from "../soundEffects";

const DISCOVERED_SUBNET_DEVICES = [
  {
    id: "iot-1",
    ip: "192.168.1.1",
    name: "Gateway Wi-Fi 6 Router",
    type: "Router",
    icon: Router,
    ports: [80, 443, 53],
    status: "Protected",
    signal: "-38 dBm",
    latency: "1.2 ms",
  },
  {
    id: "iot-2",
    ip: "192.168.1.14",
    name: "Living Room 4K Smart TV",
    type: "Smart TV",
    icon: Tv,
    ports: [8008, 8009, 1900],
    status: "Cast Port Visible",
    signal: "-52 dBm",
    latency: "3.4 ms",
  },
  {
    id: "iot-3",
    ip: "192.168.1.28",
    name: "Smart Voice Speaker",
    type: "Smart Audio",
    icon: Speaker,
    ports: [1900, 5353],
    status: "mDNS Active",
    signal: "-61 dBm",
    latency: "4.1 ms",
  },
  {
    id: "iot-4",
    ip: "192.168.1.42",
    name: "Wireless Office Printer",
    type: "Network Printer",
    icon: Printer,
    ports: [631, 9100],
    status: "IPP Open",
    signal: "-58 dBm",
    latency: "2.8 ms",
  },
  {
    id: "iot-5",
    ip: "192.168.1.75",
    name: "Gaming Console (Next-Gen)",
    type: "Gaming",
    icon: Gamepad2,
    ports: [3074, 80],
    status: "Online",
    signal: "-45 dBm",
    latency: "1.9 ms",
  },
  {
    id: "iot-6",
    ip: "192.168.1.105",
    name: "This Workstation / Laptop",
    type: "Primary Host",
    icon: Laptop,
    ports: [80, 443, 3000, 5353],
    status: "Digital Twin Synced",
    signal: "-32 dBm",
    latency: "0.4 ms",
  },
];

export default function LocalSubnetRadarModal({
  isOpen,
  onClose,
  onAddDeviceToFleet,
}) {
  const [scanning, setScanning] = useState(false);
  const [devices, setDevices] = useState(DISCOVERED_SUBNET_DEVICES);
  const [radarAngle, setRadarAngle] = useState(0);
  const [addedIds, setAddedIds] = useState(new Set());

  useEffect(() => {
    if (!isOpen) return;

    // Animated radar sweep
    const interval = setInterval(() => {
      setRadarAngle((prev) => (prev + 4) % 360);
    }, 30);

    return () => clearInterval(interval);
  }, [isOpen]);

  function handleRescan() {
    setScanning(true);
    cyberAudio.playScan();
    setTimeout(() => {
      setScanning(false);
      cyberAudio.playSuccess();
    }, 1200);
  }

  function handleImportDevice(device) {
    cyberAudio.playSuccess();
    setAddedIds((prev) => new Set(prev).add(device.id));
    onAddDeviceToFleet?.({
      id: Date.now(),
      ipAddress: device.ip,
      hostname: device.name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      operatingSystem: `${device.type} Firmware`,
      status: "UP",
    });
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-xl animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl border border-amber-500/40 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Top Amber Stripe */}
        <div className="h-2 w-full bg-gradient-to-r from-amber-400 via-purple-500 to-emerald-400" />

        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between gap-4 bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-950/50">
              <Radio className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 border border-amber-400/40 text-amber-300">
                  📡 LOCAL WI-FI SUBNET RADAR
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 border border-emerald-400/40 text-emerald-300">
                  6 SMART DEVICES FOUND
                </span>
              </div>
              <h2 className="text-lg font-black text-white mt-0.5">
                Home Network &amp; IoT Device Radar (192.168.1.0/24)
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRescan}
              disabled={scanning}
              className="p-2 rounded-xl border border-white/10 hover:bg-white/10 text-slate-300 hover:text-white transition cursor-pointer"
              title="Rescan Local Wi-Fi"
            >
              <RefreshCw className={`h-4 w-4 ${scanning ? "animate-spin text-amber-400" : ""}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Visual Radar Sweep Screen */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-5 relative overflow-hidden">
            {/* Circular Radar Graphic */}
            <div className="relative h-44 w-44 shrink-0 rounded-full border-2 border-amber-500/30 flex items-center justify-center overflow-hidden bg-emerald-950/20">
              {/* Concentric Signal Rings */}
              <div className="absolute h-32 w-32 rounded-full border border-amber-500/20" />
              <div className="absolute h-20 w-20 rounded-full border border-amber-500/25" />
              <div className="absolute h-8 w-8 rounded-full border border-amber-500/40" />

              {/* Crosshairs */}
              <div className="absolute inset-x-0 h-[1px] bg-amber-500/20" />
              <div className="absolute inset-y-0 w-[1px] bg-amber-500/20" />

              {/* Rotating Sweep Beam */}
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/25 to-amber-400/40 pointer-events-none"
                style={{
                  clipPath: "polygon(50% 50%, 100% 0, 100% 50%)",
                  transform: `rotate(${radarAngle}deg)`,
                  transformOrigin: "center center",
                }}
              />

              {/* Center Host Pulse */}
              <div className="h-3 w-3 rounded-full bg-emerald-400 animate-ping z-10" />
              <div className="absolute h-2 w-2 rounded-full bg-emerald-300 z-10" />

              {/* Pinged Device Dots */}
              <div className="absolute top-10 left-12 h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              <div className="absolute bottom-10 right-14 h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
              <div className="absolute top-24 right-8 h-2 w-2 rounded-full bg-amber-300 animate-pulse" />
            </div>

            {/* Radar Telemetry Information */}
            <div className="space-y-2 text-xs font-mono flex-1">
              <div className="text-amber-400 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Sparkles className="h-4 w-4" /> Real-Time Home Wi-Fi Telemetry
              </div>
              <p className="text-slate-300 font-sans text-xs leading-relaxed">
                The Subnet Radar sweeps your local wireless airspace to detect smart TVs, printers, voice assistants, and routers sharing your connection.
              </p>
              <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                <div className="p-2 rounded-lg bg-slate-900 border border-white/5">
                  <span className="text-slate-400 block text-[9px]">ACTIVE SUBNET</span>
                  <span className="text-white font-bold">192.168.1.0 / 24</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-white/5">
                  <span className="text-slate-400 block text-[9px]">RADIO PROTOCOL</span>
                  <span className="text-emerald-400 font-bold">802.11ax (Wi-Fi 6)</span>
                </div>
              </div>
            </div>
          </div>

          {/* List of Discovered Devices */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Discovered Network Hardware &amp; Smart Devices
            </h3>

            <div className="grid sm:grid-cols-2 gap-2.5">
              {devices.map((d) => {
                const Icon = d.icon;
                const isAdded = addedIds.has(d.id);
                return (
                  <div
                    key={d.id}
                    className="p-3.5 rounded-2xl bg-slate-900/90 border border-white/10 hover:border-amber-400/40 transition flex items-center justify-between gap-3 shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-400 shrink-0">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-bold text-white text-xs truncate max-w-[140px] sm:max-w-[170px]">
                          {d.name}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <span className="text-emerald-300 font-bold">{d.ip}</span>
                          <span>&bull;</span>
                          <span>{d.signal}</span>
                        </div>
                        <div className="text-[9px] font-mono text-purple-300 mt-0.5">
                          Ports: {d.ports.join(", ")} ({d.status})
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleImportDevice(d)}
                      disabled={isAdded}
                      className={`px-3 py-1.5 rounded-xl font-mono text-[10px] font-bold uppercase transition flex items-center gap-1 cursor-pointer shrink-0 ${
                        isAdded
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default"
                          : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-md"
                      }`}
                      title="Add to 3D Digital Twin Fleet"
                    >
                      {isAdded ? (
                        <>
                          <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <Plus className="h-3 w-3" />
                          <span>Add Twin</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/10 bg-slate-900/90 flex items-center justify-between">
          <div className="text-xs font-mono text-slate-400">
            Click <strong>+ Add Twin</strong> to simulate and inspect any smart device in 3D!
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 text-xs font-mono font-bold transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
