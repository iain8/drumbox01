/**
 * Filter module, wraps BiquadFilterNode
 */
export default class Filter {
  public input: BiquadFilterNode;
  public output: BiquadFilterNode;
  private filter: BiquadFilterNode;

  constructor(context: AudioContext) {
    this.filter = context.createBiquadFilter();

    this.input = this.filter;
    this.output = this.filter;
  }

  public connect(node: any) {
    if (node.hasOwnProperty('input')) {
      this.output.connect(node.input);
    } else {
      this.output.connect(node);
    }
  }

  get gain(): number {
    return this.filter.gain.value;
  }

  set gain(value: number) {
    this.filter.gain.value = value;
  }

  get frequency() {
    return this.filter.frequency.value;
  }

  set frequency(value: number) {
    this.filter.frequency.value = value;
  }

  set type(value: BiquadFilterType) {
    this.filter.type = value;
  }
}
