/**
 * Noise generator, fills a buffer with random white noise
 */
export default class Noise {
  public input: AudioBufferSourceNode;
  public output: AudioBufferSourceNode;
  private channels: number = 1;
  private noise: AudioBufferSourceNode;

  constructor(context: AudioContext) {
    const size: number = 2 * context.sampleRate;
    const buffer: AudioBuffer = context.createBuffer(this.channels, size, context.sampleRate);
    const output: Float32Array = buffer.getChannelData(0);

    // white noise
    for (let i = 0; i < size; ++i) {
      output[i] = Math.random() * 2 - 1;
    }

    this.noise = context.createBufferSource();
    this.noise.buffer = buffer;
    this.noise.loop = true;

    this.input = this.noise;
    this.output = this.noise;
  }

  public connect(node: any) {
    if (node.hasOwnProperty('input')) {
      this.output.connect(node.input);
    } else {
      this.output.connect(node);
    }
  }

  /**
   * Start generating noise
   */
  public start() {
    this.noise.start(0);
  }
}
