// Plain English translations and explanations for non-technical users & evaluators

export const threatTranslations = {
  5353: {
    simpleTitle: "Phone / Device Broadcasting Name (mDNS)",
    simpleExplanation: "Your phone is broadcasting its model name, operating system, and presence to everyone on the same Wi-Fi network (similar to Apple AirPlay or Bonjour).",
    danger: "Strangers at cafes, airports, or hotels can identify your exact phone model and track when you join or leave the network.",
    fix: "Turn off 'Device Discovery' or 'AirDrop / Nearby Share' when connected to public Wi-Fi."
  },
  1900: {
    simpleTitle: "Smart Device Plug-and-Play (SSDP / UPnP)",
    simpleExplanation: "Your device is continuously looking for smart TVs, gaming consoles, and printers on the network without asking you first.",
    danger: "Attackers on public Wi-Fi can send spoofed network packets to trick your phone or crash media apps.",
    fix: "Disable UPnP or public media sharing in your network settings."
  },
  137: {
    simpleTitle: "Local Device Name Sharing (NetBIOS)",
    simpleExplanation: "An older network feature that announces your computer/phone's internal nickname to everyone on the local network.",
    danger: "Hackers can see your machine name and attempt to intercept your login credentials through relay attacks.",
    fix: "Disable NetBIOS over TCP/IP in your Wi-Fi adapter settings."
  },
  53: {
    simpleTitle: "Unencrypted Website Lookups (Cleartext DNS)",
    simpleExplanation: "When you browse the web, your device asks the network for website directions without locking or encrypting the question.",
    danger: "Anyone monitoring the Wi-Fi can see every domain and website name you visit, even while using private browsing.",
    fix: "Turn on 'Secure DNS' (DNS over HTTPS) in your phone's browser or Wi-Fi settings."
  },
  3000: {
    simpleTitle: "Test Web Server Left Open (Port 3000)",
    simpleExplanation: "A developer tool or test web app is running in the background on your device without a password.",
    danger: "Anyone on your network can type your IP into their browser and view your unreleased project or internal data.",
    fix: "Shut down unused background developer servers or restrict them to 127.0.0.1 (localhost only)."
  },
  80: {
    simpleTitle: "Unencrypted Web Traffic (HTTP)",
    simpleExplanation: "Data is traveling across the internet like a postcard that anyone along the route can read.",
    danger: "Eavesdroppers on the same Wi-Fi can see passwords or inject fake pop-ups into pages you visit.",
    fix: "Always make sure websites use HTTPS (look for the green or solid padlock icon)."
  },
  443: {
    simpleTitle: "Encrypted Web Traffic (HTTPS)",
    simpleExplanation: "Standard secure web encryption. Good baseline protection, but requires up-to-date security certificates.",
    danger: "If certificates expire or use old algorithms, attackers might try to downgrade the connection.",
    fix: "Keep web certificates renewed and enforce modern TLS 1.3 encryption."
  },
  22: {
    simpleTitle: "Remote Control Doorway (SSH)",
    simpleExplanation: "A remote access doorway that lets an authorized person log in and control this device from another room or city.",
    danger: "Automated bots on the internet try thousands of common passwords per minute to break into exposed SSH doors.",
    fix: "Disable password-based logins; require cryptographic private SSH keys instead."
  },
  23: {
    simpleTitle: "Ancient Unprotected Terminal (Telnet)",
    simpleExplanation: "An antique connection protocol from the 1980s that has zero encryption.",
    danger: "High risk: every username and password typed is transmitted in plain text across the network.",
    fix: "Immediately shut down Telnet and switch to modern encrypted SSH."
  },
  21: {
    simpleTitle: "Legacy File Transfer (FTP)",
    simpleExplanation: "An older file upload and download service without built-in encryption.",
    danger: "Files and passwords can be captured out of the air by network sniffers.",
    fix: "Upgrade to Secure FTP (SFTP) or encrypted cloud file storage."
  },
  445: {
    simpleTitle: "Shared Folders & Files (SMB)",
    simpleExplanation: "Windows file-sharing service used to access shared folders, printers, and company drives.",
    danger: "Historically the primary target for ransomware (like WannaCry) to hop between computers automatically.",
    fix: "Never expose port 445 to the public internet; keep Windows security patches updated."
  },
  3306: {
    simpleTitle: "Database Filing Cabinet Open (MySQL)",
    simpleExplanation: "A database containing user records, tables, and sensitive info is directly reachable over the network.",
    danger: "Hackers can attempt brute-force password guessing to download or wipe out your entire database.",
    fix: "Lock MySQL so it only listens on 127.0.0.1 or behind a secure private VPN."
  },
  5432: {
    simpleTitle: "Database Filing Cabinet Open (PostgreSQL)",
    simpleExplanation: "Your main database server is exposed and accepting connection attempts from any device.",
    danger: "An attacker could dump company data or execute malicious database injection queries.",
    fix: "Restrict database access to only trusted application servers."
  },
  8080: {
    simpleTitle: "Secondary Web Service / Proxy",
    simpleExplanation: "An alternative web server port, frequently used for admin consoles or internal APIs.",
    danger: "Often left unmonitored or unpatched, offering a backdoor into the system.",
    fix: "Place behind an authenticated gateway with rate-limiting and strong passwords."
  }
};

export function getPlainEnglishThreat(portNumber, category, description) {
  const match = threatTranslations[portNumber];
  if (match) return match;

  return {
    simpleTitle: `${category ? category.replace(/_/g, " ") : "Exposed Service"} (Port ${portNumber || "Unknown"})`,
    simpleExplanation: description || "This digital doorway is listening for connection requests from other devices.",
    danger: "Attackers scanning the network can see this doorway and try to find loopholes to sneak into your system.",
    fix: "Lock or close this port in your firewall unless strictly necessary."
  };
}

export const killChainTranslations = [
  {
    original: "Initial Ingress",
    simpleName: "Step 1: Finding an Unlocked Door",
    simpleDesc: "The attacker scans the network looking for any device with exposed or forgotten ports."
  },
  {
    original: "Lateral Movement",
    simpleName: "Step 2: Looking Around Inside",
    simpleDesc: "Once inside one device, the attacker tries to hop onto other phones, laptops, or printers on the same Wi-Fi."
  },
  {
    original: "Privilege Escalation",
    simpleName: "Step 3: Becoming the Boss",
    simpleDesc: "The attacker tricks the system into giving them Administrator/Root superpowers to bypass restrictions."
  },
  {
    original: "Data Exfiltration",
    simpleName: "Step 4: Stealing the Goods",
    simpleDesc: "The attacker downloads private files, passwords, or customer records and transfers them to their own servers."
  }
];
