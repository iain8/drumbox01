import BaseModule from './BaseModule';

/**
 * Amplifier module, wraps a GainNode
 */
export default class Amp extends BaseModule {
  public amplitude: AudioParam;
  public input: GainNode;
  public output: GainNode;

  private gain: GainNode;

  constructor(context: AudioContext) {
    super();

    this.gain = context.createGain();
    this.gain.gain.value = 0;
    this.amplitude = this.gain.gain;
    this.input = this.gain;
    this.output = this.gain;
  }

  public set level(level: number) {
    this.gain.gain.value = level;
  }
}
