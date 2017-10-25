import BaseModule from './BaseModule';

/**
 * Filter module, wraps BiquadFilterNode
 */
export default class Filter extends BaseModule {
  public input: BiquadFilterNode;
  public output: BiquadFilterNode;
  private filter: BiquadFilterNode;

  constructor(context: AudioContext) {
    super();

    this.filter = context.createBiquadFilter();

    this.input = this.filter;
    this.output = this.filter;
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
