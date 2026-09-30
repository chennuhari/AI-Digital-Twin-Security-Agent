import { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  X,
  Sparkles,
  ShieldCheck,
  Lock,
  Zap,
  HelpCircle,
  ChevronDown,
  Minimize2,
  Maximize2,
  RefreshCw,
  Award,
} from "lucide-react";
import { cyberAudio } from "../soundEffects";

// Knowledge base for instant intelligent responses (kid-friendly & cybersecurity expert)
const PRESET_PROMPTS = [
  {
    label: "Why is Door 3000 dangerous on Wi-Fi? 🚪",
    question: "Why is Door 3000 (developer port) dangerous on public Wi-Fi?",
  },
  {
    label: "Explain my score like I'm 7 years old 🤖",
    question: "Can you explain my Gold Star Safety Score in a simple story for a child?",
  },
  {
    label: "How does a hacker try to sneak in? 🕵️‍♂️",
    question: "How do sneaky intruders try to get into open network doors?",
  },
  {
    label: "What does the 1-Click Shield Lock do? 🛡️",
    question: "What actually happens when I click the Super Shield Lock button?",
  },
];

export default function AiSecurityCopilot({
  isOpen,
  onToggle,
  onApplyMitigation,
  currentAsset,
  healthScore = 78,
  activePorts = [],
}) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      time: "Just now",
      text: "👋 Hi there! I'm **TwinBot 🤖**, your AI Security Twin Copilot. I can explain any open doors, simulate pretend attacks, or show you how to earn a 100/100 Gold Star Safety Score! What would you like to explore?",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isMinimized]);

  function handleSend(textToSend = null) {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    cyberAudio.playBeep(580, 0.04);
    const userMsg = {
      id: Date.now(),
      sender: "user",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      text: text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    // AI reasoning simulation
    setTimeout(() => {
      const botResponse = generateCopilotResponse(text, currentAsset, healthScore, activePorts);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "bot",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          text: botResponse.text,
          action: botResponse.action,
        },
      ]);
      setIsTyping(false);
      cyberAudio.playSuccess();
    }, 650);
  }

  function generateCopilotResponse(q, asset, score, ports) {
    const query = q.toLowerCase();

    if (query.includes("3000") || query.includes("developer")) {
      return {
        text: `🚪 **Door 3000 (Developer Testing Port)** is usually opened when programmers build apps on their computer. \n\nOn home or coffee shop Wi-Fi, anyone connected to the same router can peek into this window without needing a password! \n\n💡 **Easy Fix**: We can snap a Super Padlock on this door right now so only your local computer can see it.`,
        action: {
          label: "🔒 Lock Door 3000 Now",
          onClick: () => {
            onApplyMitigation?.(3000);
            cyberAudio.playSuccess();
          },
        },
      };
    }

    if (query.includes("7 years old") || query.includes("kid") || query.includes("story") || query.includes("score")) {
      return {
        text: `🌟 **Here is the story:**\n\nImagine your computer is a big **Robotic Treehouse** with **${ports.length || 5} doors**! \n\nRight now, your Treehouse has a safety score of **${score}/100 Gold Stars ⭐**! \n\nSome doors were left unlocked for friendly games (like sharing music or printing homework). But sneaky squirrels (bad actors) might wander in through unlocked doors. \n\nWhen we click **1-Click Shield Locks**, we put giant shiny padlocks on all the doors so only YOU have the keys! 🗝️`,
      };
    }

    if (query.includes("sneak") || query.includes("hacker") || query.includes("intruder") || query.includes("attack")) {
      return {
        text: `🕵️‍♂️ **How Sneaky Intruders Try to Peek In:**\n\n1. **The Scout 🔍**: They send tiny polite 'knock-knock' packets (Nmap sweeps) to find any open door.\n2. **The Trickster 🎭**: If Door 8080 or Door 3000 is open, they try sending pretend instructions (like SQL injection or code execution).\n3. **The Safe Twin Advantage 🤖**: Because you are using this Digital Twin, they are only playing in a pretend sandbox clone—your real laptop never gets touched!`,
      };
    }

    if (query.includes("shield") || query.includes("lock") || query.includes("mitigation")) {
      return {
        text: `🛡️ **The Super Shield Padlocks:**\n\nWhen you activate a Shield Lock, our **AI Defense Agent** virtually configures the firewall rules (aligned with **CIS Controls v8**). \n\nIt closes untrusted communication channels, binds databases strictly to localhost (\`127.0.0.1\`), and turns your Gold Star rating all the way up to **99/100 ⭐**!`,
        action: {
          label: "⚡ Boost Score to 99 Gold Stars",
          onClick: () => {
            onApplyMitigation?.("all");
            cyberAudio.playSuccess();
          },
        },
      };
    }

    if (query.includes("wifi") || query.includes("home") || query.includes("safe")) {
      return {
        text: `📶 **Top 3 Tips for Super-Safe Home Wi-Fi:**\n\n1. **Change the Default Router Password**: Never keep 'admin' as the password on your Wi-Fi box!\n2. **Turn on WPA3 / WPA2 Encryption**: Keeps neighbors from listening to your web traffic.\n3. **Keep Your Robot Twin Active**: Scan regularly to make sure no new hidden doors opened up!`,
      };
    }

    // Default intelligent assistant response
    return {
      text: `🤖 **TwinBot Analysis:**\n\nI checked target \`${asset?.ipAddress || "127.0.0.1"}\`. Your device currently has **${ports.length || 5} digital communication doors** active. \n\nWould you like me to run a full simulated security checkup, lock exposed doors, or explain how your digital twin protects your real computer?`,
    };
  }

  if (!isOpen) return null;

  return (
    <div
      className={`fixed z-50 transition-all duration-300 ${
        isMinimized
          ? "bottom-5 right-5 w-72"
          : "bottom-5 right-4 sm:right-6 w-[94vw] sm:w-[420px] max-w-[440px]"
      }`}
    >
      <div className="rounded-3xl border border-emerald-500/40 bg-slate-950/95 shadow-2xl backdrop-blur-2xl overflow-hidden flex flex-col max-h-[82vh] border-b-2 border-b-emerald-400">
        {/* Header Bar */}
        <div className="p-3.5 px-4 bg-gradient-to-r from-emerald-950/80 via-slate-900 to-purple-950/80 border-b border-white/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-slate-950 shadow-md shadow-emerald-950/50">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-white text-sm">TwinBot AI</span>
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-[10px] font-mono text-emerald-300">
                Safe Robot Twin Copilot &bull; Online
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-slate-400">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1.5 hover:text-white rounded-lg hover:bg-white/10 transition cursor-pointer"
              title={isMinimized ? "Expand" : "Minimize"}
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </button>
            <button
              onClick={onToggle}
              className="p-1.5 hover:text-white rounded-lg hover:bg-white/10 transition cursor-pointer"
              title="Close Copilot"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Minimized Quick Bar */}
        {isMinimized ? (
          <div
            onClick={() => setIsMinimized(false)}
            className="p-3 text-xs text-emerald-300 font-mono text-center cursor-pointer hover:bg-white/5 transition flex items-center justify-center gap-2"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Click to expand TwinBot chat</span>
          </div>
        ) : (
          <>
            {/* Chat Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 min-h-[260px] max-h-[380px] text-xs font-sans">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[88%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-line ${
                      m.sender === "user"
                        ? "bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-br-none shadow-md shadow-purple-950/40"
                        : "bg-slate-900 border border-white/10 text-slate-200 rounded-bl-none shadow-md"
                    }`}
                  >
                    {m.text}

                    {/* Interactive Action Button embedded in Bot message */}
                    {m.action && (
                      <div className="mt-3 pt-2.5 border-t border-white/10">
                        <button
                          onClick={m.action.onClick}
                          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-[11px] font-mono flex items-center gap-1.5 cursor-pointer shadow-md transition"
                        >
                          <Zap className="h-3.5 w-3.5 fill-slate-950" />
                          <span>{m.action.label}</span>
                        </button>
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 mt-1 px-1">
                    {m.time}
                  </span>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-slate-400 text-xs font-mono p-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>TwinBot is thinking...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestion Chips */}
            <div className="px-3 py-2 border-t border-white/5 bg-slate-900/50 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {PRESET_PROMPTS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(p.question)}
                  className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 border border-white/10 text-[10px] whitespace-nowrap font-mono transition cursor-pointer shrink-0"
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 border-t border-white/10 bg-slate-900/90 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask TwinBot anything in plain English..."
                className="flex-1 bg-slate-950 border border-white/15 focus:border-emerald-400 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 outline-none transition font-sans"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="h-9 w-9 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-40 text-slate-950 flex items-center justify-center cursor-pointer transition shadow-md shrink-0"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
