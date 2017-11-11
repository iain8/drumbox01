/**
 * (A)ttack (D)ecay envelope generator
 */
export default class Env {
  public attack: number;
  public decay: number;
  private param: AudioParam;
  private context: AudioContext;
  private maxValue: number;
  private minValue: number;

  constructor(context: AudioContext) {
    this.context = context;
    this.attack = 0.1;
    this.decay = 0.5;
    this.maxValue = 1;
    this.min = 0.0001;
  }

  /**
   * Trigger an envelope
   * CAUTION: any 0 values passed to exponentialRamp cause FF errors
   */
  public trigger() {
    const now: number = this.context.currentTime;

    this.param.cancelScheduledValues(now);
    this.param.setValueAtTime(this.minValue, now);
    console.log('he attak', this.attack);
    this.param.linearRampToValueAtTime(this.maxValue, now + this.attack);

    this.param.exponentialRampToValueAtTime(this.minValue, now + this.attack + this.decay);
  }

  /**
   * Connect to an AudioParam of another node
   */
  public connect(param: AudioParam) {
    this.param = param;
  }

  set max(value: number) {
    this.maxValue = value > 0 ? value : 0.0001;
  }

  get max(): number {
    return this.maxValue;
  }

  set min(value: number) {
    this.minValue = value > 0 ? value : 0.0001;
  }

  get min(): number {
    return this.minValue;
  }
}
