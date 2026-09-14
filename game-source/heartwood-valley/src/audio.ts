/** A tiny original pentatonic tune. All notes are synthesized locally after a click. */
export class FarmAudio {
  private context: AudioContext | null = null;
  private timer = 0;
  private step = 0;
  enabled = false;
  private melody = [
    72, 76, 79, 76, 74, 72, 67, 0, 69, 72, 76, 79, 76, 74, 72, 0, 76, 79, 81,
    79, 76, 74, 72, 67, 69, 72, 74, 76, 74, 72, 67, 0,
  ];
  constructor() {
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) this.stopClock();
      else if (this.enabled) this.startClock();
    });
    window.addEventListener("pagehide", () => this.stopClock());
  }
  async toggle() {
    this.enabled = !this.enabled;
    try {
      if (this.enabled) {
        this.context ??= new AudioContext();
        await this.context.resume();
        if (this.enabled) this.startClock();
      } else this.stopClock();
    } catch {
      this.enabled = false;
      this.stopClock();
    }
    return this.enabled;
  }
  private note(
    midi: number,
    duration: number,
    volume: number,
    type: OscillatorType = "triangle",
    delay = 0,
  ) {
    if (!this.context || !midi) return;
    const now = this.context.currentTime + delay;
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    oscillator.type = type;
    oscillator.frequency.value = 440 * 2 ** ((midi - 69) / 12);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    oscillator.connect(gain);
    gain.connect(this.context.destination);
    oscillator.start(now);
    oscillator.stop(now + duration + 0.01);
  }
  private startClock() {
    this.stopClock();
    const tick = () => {
      this.note(this.melody[this.step % this.melody.length], 0.3, 0.026);
      if (this.step % 4 === 0)
        this.note([48, 53, 57, 55][Math.floor(this.step / 8) % 4], 0.75, 0.018);
      this.step++;
    };
    tick();
    this.timer = window.setInterval(tick, 280);
  }
  private stopClock() {
    clearInterval(this.timer);
    this.timer = 0;
  }
  chime() {
    if (this.enabled) {
      this.note(79, 0.2, 0.035, "sine");
      this.note(84, 0.3, 0.03, "sine", 0.1);
    }
  }
}
