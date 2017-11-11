/**
 * Amplifier module, wraps a GainNode
 */
export default class Amp {
  public amplitude: AudioParam;
  public input: GainNode;
  public output: GainNode;

  private gain: GainNode;

  constructor(context: AudioContext) {
    this.gain = context.createGain();
    this.gain.gain.value = 0;
    this.amplitude = this.gain.gain;
    this.input = this.gain;
    this.output = this.gain;
  }

  public connect(node: any) {
    if (node.hasOwnProperty('input')) {
      this.output.connect(node.input);
    } else {
      this.output.connect(node);
    }
  }

  public set level(level: number) {
    this.gain.gain.value = level;
  }
}
