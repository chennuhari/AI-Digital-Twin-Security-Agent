// Web Audio API Synthesizer for Cyber Digital Twin
class CyberAudio {
  constructor() {
    this.ctx = null;
    this.enabled = localStorage.getItem("digitalTwinSound") !== "false";
  }

  init() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem("digitalTwinSound", String(this.enabled));
    if (this.enabled) {
      this.playBeep(880, 0.08);
    }
    return this.enabled;
  }

  playBeep(freq = 440, duration = 0.06, type = "sine") {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === "suspended") this.ctx.resume();

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Ignore audio policy blocks
    }
  }

  playScan() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.3);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {}
  }

  playAlert() {
    if (!this.enabled) return;
    try {
      this.playBeep(620, 0.12, "triangle");
      setTimeout(() => this.playBeep(480, 0.18, "sawtooth"), 120);
    } catch (e) {}
  }

  playSuccess() {
    if (!this.enabled) return;
    try {
      this.playBeep(523.25, 0.08);
      setTimeout(() => this.playBeep(659.25, 0.08), 80);
      setTimeout(() => this.playBeep(783.99, 0.14), 160);
    } catch (e) {}
  }
}

export const cyberAudio = new CyberAudio();
