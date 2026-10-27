// Web Audio API Synthesizer - 100% offline, zero external dependencies, friendly & cheerful for kids

class SoundManager {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;

  constructor() {
    const saved = localStorage.getItem('eco_sound_enabled');
    this.enabled = saved !== null ? saved === 'true' : true;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setEnabled(val: boolean) {
    this.enabled = val;
    localStorage.setItem('eco_sound_enabled', String(val));
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  // Happy success chord (C5 -> E5 -> G5 -> C6)
  public playSuccess() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + idx * 0.07);

        gain.gain.setValueAtTime(0.001, this.ctx!.currentTime + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.2, this.ctx!.currentTime + idx * 0.07 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx!.currentTime + idx * 0.07 + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(this.ctx!.currentTime + idx * 0.07);
        osc.stop(this.ctx!.currentTime + idx * 0.07 + 0.38);
      });
    } catch {
      // Audio not permitted yet
    }
  }

  // Gentle boing when an item is placed in the wrong bin (encouraging, not harsh)
  public playGentleHint() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, this.ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime);
      osc.stop(this.ctx.currentTime + 0.3);
    } catch {}
  }

  // Cheerful pop sound on click or pickup
  public playPop() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime);
      osc.stop(this.ctx.currentTime + 0.1);
    } catch {}
  }

  // Trash drop sound
  public playDrop() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(260, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, this.ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.16);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime);
      osc.stop(this.ctx.currentTime + 0.18);
    } catch {}
  }

  // Twinkle / star sparkle sound
  public playSparkle() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      [880, 1174.66, 1396.91, 1760].forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + idx * 0.05);

        gain.gain.setValueAtTime(0.08, this.ctx!.currentTime + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + idx * 0.05 + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(this.ctx!.currentTime + idx * 0.05);
        osc.stop(this.ctx!.currentTime + idx * 0.05 + 0.22);
      });
    } catch {}
  }

  // Victory fanfare on game completion
  public playFanfare() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const notes = [
        { f: 523.25, t: 0.0 },
        { f: 659.25, t: 0.12 },
        { f: 783.99, t: 0.24 },
        { f: 1046.5, t: 0.4 },
        { f: 880.0,  t: 0.6 },
        { f: 1046.5, t: 0.8 },
      ];
      notes.forEach(({ f, t }) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, this.ctx!.currentTime + t);

        gain.gain.setValueAtTime(0.2, this.ctx!.currentTime + t);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + t + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(this.ctx!.currentTime + t);
        osc.stop(this.ctx!.currentTime + t + 0.38);
      });
    } catch {}
  }
}

export const sounds = new SoundManager();

// Web Speech helper for Eco voice narration for children
export function speakText(text: string): boolean {
  if (!('speechSynthesis' in window)) return false;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-CO';
    utterance.rate = 0.95;
    utterance.pitch = 1.15; // slightly cheerful, friendly pitch for kids

    // Try finding a Spanish voice
    const voices = window.speechSynthesis.getVoices();
    const esVoice = voices.find(v => v.lang.startsWith('es'));
    if (esVoice) {
      utterance.voice = esVoice;
    }
    window.speechSynthesis.speak(utterance);
    return true;
  } catch {
    return false;
  }
}

export function stopSpeaking() {
  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {}
  }
}
