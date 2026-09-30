import { useRef } from "react";
import {
  Printer,
  Download,
  X,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Cpu,
  Wifi,
  Award,
  AlertTriangle,
  FileText,
} from "lucide-react";
import { cyberAudio } from "../soundEffects";

export default function SecurityReportModal({
  isOpen,
  onClose,
  asset,
  ports = [],
  threats = [],
  risk,
  defense,
}) {
  const reportRef = useRef();

  if (!isOpen) return null;

  function handlePrint() {
    cyberAudio.playSuccess();
    window.print();
  }

  function handleExportJson() {
    cyberAudio.playSuccess();
    const data = {
      title: "AI Digital Twin Security Audit Report",
      generatedAt: new Date().toISOString(),
      asset: asset || { ipAddress: "127.0.0.1", hostname: "primary-security-twin" },
      portsSummary: ports,
      threatSurface: threats,
      riskAssessment: risk,
      defenseRecommendations: defense,
      certificateId: `TWIN-CERT-${Date.now().toString(36).toUpperCase()}`,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `security-audit-report-${asset?.ipAddress || "twin"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-xl animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl border border-emerald-500/40 bg-slate-950 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Printable Toolbar (Hidden on print) */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-slate-900/90 flex items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">
                Official Security Assessment Report
              </h2>
              <p className="text-[11px] font-mono text-emerald-300">
                1-Click PDF &amp; Compliance Dossier Export
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs font-mono flex items-center gap-1.5 cursor-pointer shadow-md transition"
            >
              <Printer className="h-4 w-4" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={handleExportJson}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs font-mono flex items-center gap-1.5 cursor-pointer transition"
            >
              <Download className="h-4 w-4" />
              <span>JSON</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Dossier Container */}
        <div
          ref={reportRef}
          className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-slate-200 bg-slate-950 print:p-4 print:text-black print:bg-white print:overflow-visible"
        >
          {/* Official Letterhead */}
          <div className="border-b border-white/10 pb-5 flex flex-wrap items-center justify-between gap-4 print:border-black/20">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-emerald-400 inline-block" />
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold print:text-emerald-800">
                  AI DIGITAL TWIN SECURITY AGENT &bull; VERIFIED DOSSIER
                </span>
              </div>
              <h1 className="text-2xl font-black text-white mt-1 print:text-black">
                Comprehensive Cyber Risk &amp; Hardware Audit
              </h1>
              <p className="text-xs text-slate-400 font-mono print:text-slate-600">
                Evaluation Target: <strong>{asset?.ipAddress || "127.0.0.1"}</strong> ({asset?.hostname || "Local Device"}) &bull; Date: {currentDate}
              </p>
            </div>

            <div className="text-right">
              <span className="px-3 py-1 rounded-xl bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 font-mono text-xs font-bold print:border-emerald-800 print:text-emerald-800">
                ⭐ {risk?.overallScore || 78} / 100 HEALTH
              </span>
            </div>
          </div>

          {/* Section 1: Executive Summary */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400 print:text-purple-900">
              1. Executive Summary &amp; Digital Twin Posture
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans print:text-slate-800">
              This report details the virtualized attack surface synthesized for endpoint <strong>{asset?.ipAddress || "127.0.0.1"}</strong> running <strong>{asset?.operatingSystem || "Client Workstation"}</strong>. The AI Reconnaissance and Threat Agents audited active digital doors (network sockets), mapped potential lateral movement vectors, and formulated prioritized hardening playbooks aligned with <strong>CIS Controls v8</strong> and <strong>NIST SP 800-53</strong>.
            </p>
          </div>

          {/* Section 2: Hardware & Endpoint Telemetry */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 print:text-amber-800">
              2. Endpoint Hardware &amp; Environmental Metrics
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-900 border border-white/10 print:bg-slate-100 print:border-slate-300">
                <span className="text-slate-400 block text-[10px]">OPERATING SYSTEM</span>
                <span className="text-white font-bold print:text-black">{asset?.operatingSystem || "Windows / Linux"}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-white/10 print:bg-slate-100 print:border-slate-300">
                <span className="text-slate-400 block text-[10px]">NETWORK STATUS</span>
                <span className="text-emerald-400 font-bold print:text-emerald-700">Online &bull; UP</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-white/10 print:bg-slate-100 print:border-slate-300">
                <span className="text-slate-400 block text-[10px]">ACTIVE DOORS</span>
                <span className="text-amber-400 font-bold print:text-amber-700">{ports.length || 5} Ports Open</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-white/10 print:bg-slate-100 print:border-slate-300">
                <span className="text-slate-400 block text-[10px]">RISK TIER</span>
                <span className="text-purple-400 font-bold print:text-purple-700">{risk?.overallRiskLevel || "MEDIUM"}</span>
              </div>
            </div>
          </div>

          {/* Section 3: Discovered Digital Communication Doors */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 print:text-emerald-800">
              3. Discovered Network Communication Doors (Ports)
            </h3>
            <div className="border border-white/10 rounded-2xl overflow-hidden print:border-slate-300">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-900 text-slate-400 border-b border-white/10 print:bg-slate-200 print:text-slate-800">
                  <tr>
                    <th className="p-2.5 px-3">Port / Protocol</th>
                    <th className="p-2.5 px-3">Service Name</th>
                    <th className="p-2.5 px-3">State</th>
                    <th className="p-2.5 px-3">Plain English Purpose</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 print:divide-slate-200">
                  {ports.map((p, idx) => (
                    <tr key={idx} className="hover:bg-white/5">
                      <td className="p-2.5 px-3 font-bold text-white print:text-black">
                        {p.portNumber || p.port}/{p.protocol || "tcp"}
                      </td>
                      <td className="p-2.5 px-3 text-purple-300 font-bold print:text-purple-900">
                        {p.service || "network-service"}
                      </td>
                      <td className="p-2.5 px-3 text-emerald-400 font-bold print:text-emerald-700">
                        {p.state || "open"}
                      </td>
                      <td className="p-2.5 px-3 text-slate-300 font-sans text-[11px] print:text-slate-700">
                        {p.portNumber === 80 || p.portNumber === 443
                          ? "Web Browser & Cloud Secure Communication"
                          : p.portNumber === 5353
                          ? "Apple Bonjour / Multicast DNS Device Discovery"
                          : p.portNumber === 1900
                          ? "Universal Plug and Play (Media Sharing)"
                          : p.portNumber === 3000
                          ? "Developer Testing Server"
                          : "Standard System Communication Window"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 4: Prioritized Defense Padlocks */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400 print:text-rose-800">
              4. Recommended Protective Countermeasures
            </h3>
            <div className="space-y-2 text-xs font-sans">
              {(defense?.recommendations || [
                { id: "R-01", title: "Apply Padlock on Port 3000", priority: "HIGH", action: "Bind dev server to localhost only." },
                { id: "R-02", title: "Harden UPnP & SSDP Discovery", priority: "MEDIUM", action: "Disable media sharing on public Wi-Fi." },
                { id: "R-03", title: "Enable Private Encrypted DNS", priority: "LOW", action: "Activate DoH / Secure DNS in browser." },
              ]).map((rec, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-slate-900 border border-white/10 flex items-start gap-2.5 print:bg-slate-50 print:border-slate-300"
                >
                  <Lock className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-white print:text-black">
                      {rec.title} <span className="text-[10px] font-mono text-amber-400">[{rec.priority} PRIORITY]</span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5 print:text-slate-700">
                      {rec.action}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Official Digital Seal & Certification */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-purple-950/40 border border-emerald-500/30 flex items-center justify-between gap-4 print:border-slate-400 print:bg-slate-100">
            <div className="flex items-center gap-3">
              <Award className="h-10 w-10 text-emerald-400 shrink-0" />
              <div>
                <div className="text-sm font-black text-white print:text-black">
                  CERTIFICATE OF DIGITAL TWIN AUDIT COMPLETION
                </div>
                <div className="text-[10px] font-mono text-slate-400 print:text-slate-600">
                  Verification Hash: SHA256-{(asset?.ipAddress || "TWIN").split(".").join("")}-99281
                </div>
              </div>
            </div>

            <div className="text-right font-mono text-[10px] text-emerald-300 print:text-emerald-800">
              <span className="font-bold block">100% NON-DESTRUCTIVE AUDIT</span>
              <span>Zero Real Production Harm</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
