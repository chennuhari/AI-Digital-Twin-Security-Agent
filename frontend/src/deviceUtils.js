// Visitor device telemetry & public network fingerprinting
export function getVisitorDeviceInfo() {
  if (typeof window === "undefined" || !window.navigator) {
    return {
      os: "Windows Workstation",
      browser: "Chrome",
      deviceType: "Desktop",
      platform: "Win32",
      cores: 8,
      screen: "1920x1080",
    };
  }

  const ua = navigator.userAgent || "";
  let os = "Windows Workstation";
  if (/Windows NT 10.0/i.test(ua)) os = "Windows 11 / 10 Workstation";
  else if (/Windows/i.test(ua)) os = "Windows Workstation";
  else if (/Mac OS X/i.test(ua)) os = "macOS Workstation";
  else if (/Android/i.test(ua)) os = "Android Mobile";
  else if (/iPhone|iPad|iPod/i.test(ua)) os = "Apple iOS Mobile";
  else if (/Linux/i.test(ua)) os = "Linux Workstation";

  let browser = "Web Browser";
  if (/Edg\//i.test(ua)) browser = "Microsoft Edge";
  else if (/Chrome\//i.test(ua)) browser = "Google Chrome";
  else if (/Safari\//i.test(ua) && !/Chrome/i.test(ua)) browser = "Apple Safari";
  else if (/Firefox\//i.test(ua)) browser = "Mozilla Firefox";

  const isMobile = /Mobi|Android/i.test(ua);

  return {
    os,
    browser,
    deviceType: isMobile ? "Mobile Device" : "Desktop Workstation",
    platform: navigator.platform || "x86_64",
    cores: navigator.hardwareConcurrency || 4,
    screen: `${window.screen?.width || 1920}x${window.screen?.height || 1080}`,
    language: navigator.language || "en-US",
  };
}

export async function fetchVisitorIp() {
  try {
    const res = await fetch("https://api.ipify.org?format=json", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (data && data.ip) return data.ip;
    }
  } catch (e) {
    // Fallback to random realistic client IP if blocked by adblockers
  }
  return "192.168.1.105";
}
