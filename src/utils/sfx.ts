// Procedural Web Audio SFX & Frequency Analyzer for Singularity OS

class SoundEngine {
  private ctx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private biquadFilter: BiquadFilterNode | null = null;
  private freqData: Uint8Array<ArrayBuffer> | null = null;
  private sourceConnected = false;
  private isMuted = false;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public initAudioElement(audioEl: HTMLAudioElement) {
    const ctx = this.getContext();
    if (!ctx || this.sourceConnected) return;

    try {
      const source = ctx.createMediaElementSource(audioEl);
      this.analyser = ctx.createAnalyser();
      this.analyser.fftSize = 128;
      this.analyser.smoothingTimeConstant = 0.8;
      this.freqData = new Uint8Array(this.analyser.frequencyBinCount);

      this.biquadFilter = ctx.createBiquadFilter();
      this.biquadFilter.type = 'lowpass';
      this.biquadFilter.frequency.setValueAtTime(20000, ctx.currentTime);
      this.biquadFilter.Q.setValueAtTime(1, ctx.currentTime);

      source.connect(this.biquadFilter);
      this.biquadFilter.connect(this.analyser);
      this.analyser.connect(ctx.destination);
      this.sourceConnected = true;
    } catch {
      // Audio element already connected or cross-origin restriction
    }
  }

  public getAudioFrequencies(): { bass: number; mid: number; high: number } {
    if (!this.analyser || !this.freqData) {
      return { bass: 0, mid: 0, high: 0 };
    }

    this.analyser.getByteFrequencyData(this.freqData);

    // Bass bins (approx 0-150Hz in 64-bin FFT)
    let bassSum = 0;
    const bassCount = 6;
    for (let i = 0; i < bassCount; i++) {
      bassSum += this.freqData[i];
    }
    const bass = bassSum / (bassCount * 255);

    // Mid bins (approx 150-1500Hz)
    let midSum = 0;
    const midCount = 18;
    for (let i = bassCount; i < bassCount + midCount; i++) {
      midSum += this.freqData[i];
    }
    const mid = midSum / (midCount * 255);

    // High bins
    let highSum = 0;
    const highCount = 20;
    for (let i = bassCount + midCount; i < bassCount + midCount + highCount; i++) {
      highSum += this.freqData[i];
    }
    const high = highSum / (highCount * 255);

    return { bass, mid, high };
  }

  public setRedshiftFilter(active: boolean) {
    const ctx = this.getContext();
    if (!ctx || !this.biquadFilter) return;

    const now = ctx.currentTime;
    this.biquadFilter.frequency.cancelScheduledValues(now);
    this.biquadFilter.Q.cancelScheduledValues(now);

    if (active) {
      // Gravitational Redshift: Muffle into sub-bass with resonance
      this.biquadFilter.frequency.setTargetAtTime(280, now, 0.4);
      this.biquadFilter.Q.setTargetAtTime(4.5, now, 0.4);
    } else {
      // Return to full spectrum
      this.biquadFilter.frequency.setTargetAtTime(20000, now, 0.5);
      this.biquadFilter.Q.setTargetAtTime(1.0, now, 0.5);
    }
  }

  public playHoverSound() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1320, now + 0.04);

      gain.gain.setValueAtTime(0.025, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {}
  }

  public playClickSound() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1800, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.035);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.045);
    } catch {}
  }

  public playWarpDiveSound() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // Sub-bass sweep
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(28, now + 1.2);

      // Lowpass filter sweep
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(80, now + 1.2);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 1.5);
    } catch {}
  }

  public playWarpExitSound() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.6);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.75);
    } catch {}
  }
}

export const soundEngine = new SoundEngine();
