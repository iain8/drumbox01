import BaseModule from './BaseModule';

/**
 * Oscillator module, wraps an OscillatorNode
 */
export default class Osc extends BaseModule {
  public input: OscillatorNode;
  public output: OscillatorNode;
  public frequency: AudioParam;
  private oscillator: any;	// due to iOS noteOn()

  constructor(context: AudioContext) {
    super();

    this.oscillator = context.createOscillator();
    this.oscillator.type = 'sine';
    this.oscillator.frequency.value = 440;
    this.input = this.oscillator;
    this.output = this.oscillator;
    this.frequency = this.oscillator.frequency;
  }

  /**
   * Start oscillator oscillating
   */
  public start() {
    this.oscillator.start ? this.oscillator.start(0) : this.oscillator.noteOn(0);
  }

  get type(): string {
    return this.oscillator.type;
  }

  set type(type: string) {
    this.oscillator.type = type;
  }

  get frequencyValue() {
    return this.frequency.value;
  }

  set frequencyValue(frequency: number) {
    this.frequency.value = frequency;
  }
}
