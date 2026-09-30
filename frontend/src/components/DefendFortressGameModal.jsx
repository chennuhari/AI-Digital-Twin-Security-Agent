import { useState, useEffect, useRef } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  Unlock,
  Zap,
  Award,
  Trophy,
  Flame,
  RefreshCw,
  X,
  Sparkles,
  Heart,
  Timer,
  CheckCircle2,
} from "lucide-react";
import { cyberAudio } from "../soundEffects";

const INTRUDER_TYPES = [
  { name: "Ransomware Gremlin", emoji: "👾", speed: 1.2, threat: "Trying to scramble files!" },
  { name: "Sneaky Spy Bug", emoji: "🕷️", speed: 1.5, threat: "Trying to peek at passwords!" },
  { name: "Trojan Trickster", emoji: "🐴", speed: 1.0, threat: "Pretending to be a video game!" },
  { name: "Ghost Hacker", emoji: "👻", speed: 1.8, threat: "Trying to sneak into dev ports!" },
];

export default function DefendFortressGameModal({ isOpen, onClose }) {
  const [gameState, setGameState] = useState("ready"); // "ready" | "playing" | "victory" | "gameover"
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [lives, setLives] = useState(3);

  // 4 Digital Doors
  const [doors, setDoors] = useState([
    { id: 80, name: "Web Door (Port 80)", locked: false, intruderProgress: 0, intruder: null },
    { id: 3000, name: "Developer Window (Port 3000)", locked: false, intruderProgress: 0, intruder: null },
    { id: 22, name: "Terminal Gate (Port 22)", locked: false, intruderProgress: 0, intruder: null },
    { id: 5353, name: "Wi-Fi Radar (Port 5353)", locked: false, intruderProgress: 0, intruder: null },
  ]);

  const gameLoopRef = useRef(null);

  // Reset & Start Game
  function startGame() {
    setGameState("playing");
    setScore(0);
    setStreak(0);
    setTimeLeft(30);
    setLives(3);
    setDoors([
      { id: 80, name: "Web Door (Port 80)", locked: false, intruderProgress: 10, intruder: INTRUDER_TYPES[0] },
      { id: 3000, name: "Developer Window (Port 3000)", locked: false, intruderProgress: 25, intruder: INTRUDER_TYPES[1] },
      { id: 22, name: "Terminal Gate (Port 22)", locked: false, intruderProgress: 5, intruder: INTRUDER_TYPES[2] },
      { id: 5353, name: "Wi-Fi Radar (Port 5353)", locked: false, intruderProgress: 0, intruder: null },
    ]);
    cyberAudio.playSuccess();
  }

  // Game Loop
  useEffect(() => {
    if (gameState !== "playing") return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameState("victory");
          cyberAudio.playSuccess();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const intruderTick = setInterval(() => {
      setDoors((prevDoors) => {
        let lifeLost = false;

        const updated = prevDoors.map((door) => {
          // If door is locked, intruder was blocked
          if (door.locked) {
            return {
              ...door,
              intruderProgress: Math.max(0, door.intruderProgress - 8),
              locked: door.intruderProgress <= 5 ? false : true, // automatically unlock for next wave
              intruder: door.intruderProgress <= 5 ? null : door.intruder,
            };
          }

          // If no intruder currently on this door, randomly spawn one
          if (!door.intruder) {
            if (Math.random() < 0.25) {
              const randomIntruder = INTRUDER_TYPES[Math.floor(Math.random() * INTRUDER_TYPES.length)];
              return { ...door, intruder: randomIntruder, intruderProgress: 5 };
            }
            return door;
          }

          // Move intruder closer to the gate
          const newProgress = door.intruderProgress + (door.intruder.speed || 1) * 3;
          if (newProgress >= 100) {
            // Intruder breached!
            lifeLost = true;
            cyberAudio.playAlert();
            return { ...door, intruderProgress: 0, intruder: null };
          }

          return { ...door, intruderProgress: newProgress };
        });

        if (lifeLost) {
          setLives((l) => {
            const nextL = l - 1;
            if (nextL <= 0) {
              setGameState("gameover");
              cyberAudio.playAlert();
            }
            return Math.max(0, nextL);
          });
          setStreak(0);
        }

        return updated;
      });
    }, 200);

    return () => {
      clearInterval(timer);
      clearInterval(intruderTick);
    };
  }, [gameState]);

  // Click to Lock a Door
  function handleLockDoor(doorId) {
    if (gameState !== "playing") return;

    setDoors((prev) =>
      prev.map((d) => {
        if (d.id === doorId) {
          if (d.intruder && !d.locked) {
            // Success block!
            setScore((s) => s + 100 + streak * 20);
            setStreak((st) => st + 1);
            cyberAudio.playBeep(640 + streak * 40, 0.08);
            return { ...d, locked: true };
          }
          return { ...d, locked: true };
        }
        return d;
      })
    );
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-xl animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl border border-purple-500/40 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 shadow-2xl overflow-hidden my-auto flex flex-col">
        {/* Playful Top Strip */}
        <div className="h-2 w-full bg-gradient-to-r from-purple-400 via-emerald-400 to-amber-400" />

        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between gap-4 bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white shadow-lg shadow-purple-950/50">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 border border-amber-400/40 text-amber-300">
                  🎮 CYBER GUARDIAN ACADEMY
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 border border-emerald-400/40 text-emerald-300">
                  ⭐ 100% KID-SAFE
                </span>
              </div>
              <h2 className="text-lg font-black text-white mt-0.5">
                🏰 Defend Your Digital Fortress
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
        <div className="p-4 sm:p-6 space-y-5">
          {/* READY STATE */}
          {gameState === "ready" && (
            <div className="py-8 text-center space-y-5">
              <div className="text-6xl animate-bounce">🏰🤖</div>
              <div className="max-w-md mx-auto space-y-2">
                <h3 className="text-xl font-black text-white">
                  Protect Your Robot Treehouse!
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  Sneaky tricksters (bugs and spy bots) are marching toward your open digital doors!
                  Click the <strong>Shield Padlocks 🔒</strong> to lock each door before they get in.
                </p>
              </div>

              <div className="flex justify-center gap-6 text-xs font-mono text-slate-400 pt-2">
                <div className="flex items-center gap-1.5">
                  <Timer className="h-4 w-4 text-amber-400" /> 30-Second Round
                </div>
                <div className="flex items-center gap-1.5">
                  <Heart className="h-4 w-4 text-rose-400" /> 3 Fortress Shields
                </div>
                <div className="flex items-center gap-1.5">
                  <Award className="h-4 w-4 text-emerald-400" /> Earn Gold Medal
                </div>
              </div>

              <div className="pt-3">
                <button
                  onClick={startGame}
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-purple-600 hover:from-emerald-400 hover:to-purple-500 text-slate-950 font-black text-sm font-mono uppercase tracking-wider shadow-xl shadow-emerald-950/50 cursor-pointer active:scale-95 transition"
                >
                  🚀 Start Game Now!
                </button>
              </div>
            </div>
          )}

          {/* PLAYING STATE */}
          {gameState === "playing" && (
            <div className="space-y-4">
              {/* Score HUD */}
              <div className="p-3 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-3">
                  <span className="text-amber-400 font-bold flex items-center gap-1">
                    <Trophy className="h-4 w-4" /> Score: {score}
                  </span>
                  {streak > 1 && (
                    <span className="text-purple-300 font-bold px-2 py-0.5 rounded bg-purple-500/20 border border-purple-400/30 animate-pulse">
                      🔥 {streak}x Combo!
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-rose-400 font-bold">
                    {[...Array(3)].map((_, i) => (
                      <Heart
                        key={i}
                        className={`h-4 w-4 ${
                          i < lives ? "fill-rose-500 text-rose-500" : "text-slate-700"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5 text-white font-bold bg-white/10 px-3 py-1 rounded-xl">
                    <Timer className="h-3.5 w-3.5 text-amber-400" /> {timeLeft}s
                  </div>
                </div>
              </div>

              {/* 4 Interactive Gates */}
              <div className="grid sm:grid-cols-2 gap-3">
                {doors.map((d) => (
                  <div
                    key={d.id}
                    className={`p-4 rounded-2xl border transition-all duration-200 relative overflow-hidden ${
                      d.locked
                        ? "bg-emerald-950/40 border-emerald-500/50 shadow-md shadow-emerald-950/40"
                        : d.intruderProgress > 60
                        ? "bg-rose-950/40 border-rose-500/50 animate-pulse"
                        : "bg-slate-900/90 border-white/10"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-white font-mono">
                        {d.name}
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          d.locked
                            ? "bg-emerald-500/20 text-emerald-300"
                            : "bg-amber-500/20 text-amber-300"
                        }`}
                      >
                        {d.locked ? "LOCKED & SAFE 🔒" : "OPEN DOOR 🚪"}
                      </span>
                    </div>

                    {/* Intruder Distance Bar */}
                    <div className="my-3 space-y-1">
                      <div className="flex justify-between text-[10px] font-mono text-slate-400">
                        <span>
                          {d.intruder
                            ? `${d.intruder.emoji} ${d.intruder.name}`
                            : "Quiet... No intruders"}
                        </span>
                        <span>{Math.round(d.intruderProgress)}% distance</span>
                      </div>
                      <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-white/10">
                        <div
                          className={`h-full rounded-full transition-all duration-150 ${
                            d.locked
                              ? "bg-emerald-400"
                              : d.intruderProgress > 60
                              ? "bg-rose-500"
                              : "bg-amber-400"
                          }`}
                          style={{ width: `${d.intruderProgress}%` }}
                        />
                      </div>
                    </div>

                    {/* Lock Button */}
                    <button
                      onClick={() => handleLockDoor(d.id)}
                      disabled={d.locked}
                      className={`w-full py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md ${
                        d.locked
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default"
                          : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950"
                      }`}
                    >
                      {d.locked ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                          <span>Door Protected!</span>
                        </>
                      ) : (
                        <>
                          <Lock className="h-4 w-4 fill-slate-950" />
                          <span>Snap Padlock 🔒</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VICTORY STATE */}
          {gameState === "victory" && (
            <div className="py-6 text-center space-y-4">
              <div className="text-6xl animate-bounce">🏆🎉</div>
              <div>
                <h3 className="text-2xl font-black text-white">
                  Victory! You Defended the Fortress!
                </h3>
                <p className="text-xs text-emerald-300 font-mono mt-1">
                  ⭐ Final Score: {score} Points &bull; 0 Intruders Breached!
                </p>
              </div>

              {/* Certificate Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-purple-950/60 border border-emerald-400/40 max-w-md mx-auto text-center space-y-2 shadow-xl">
                <div className="inline-flex p-2 rounded-xl bg-amber-400/20 text-amber-300">
                  <Award className="h-8 w-8" />
                </div>
                <div className="text-sm font-black text-white">
                  CERTIFIED JUNIOR DIGITAL GUARDIAN
                </div>
                <p className="text-[11px] text-slate-300 font-sans">
                  This device is officially certified for outstanding fortress defense and proactive padlock response.
                </p>
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={startGame}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs font-mono uppercase cursor-pointer hover:bg-emerald-400 transition"
                >
                  Play Again 🔄
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-white/10 text-white font-bold text-xs font-mono uppercase cursor-pointer hover:bg-white/20 transition"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          )}

          {/* GAMEOVER STATE */}
          {gameState === "gameover" && (
            <div className="py-8 text-center space-y-4">
              <div className="text-6xl">💥🛡️</div>
              <h3 className="text-xl font-black text-rose-400">
                The Intruders Slipped In!
              </h3>
              <p className="text-xs text-slate-300 max-w-sm mx-auto font-sans">
                A door was left open too long! Don't worry—in your Digital Twin sandbox, real devices are always safe. Try again to stop them!
              </p>
              <div className="pt-2">
                <button
                  onClick={startGame}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs font-mono uppercase cursor-pointer hover:from-purple-500 hover:to-pink-500 transition shadow-lg shadow-purple-950/50"
                >
                  Try Again 🔄
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
