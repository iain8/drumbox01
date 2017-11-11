import { Component, h } from 'preact';
import Knob from '../controls/knob';
import Amp from '../../modules/amp';
import Env from '../../modules/env';

export default class Noise extends Component<any, any> {
  public input: AudioBufferSourceNode;
  public output: AudioBufferSourceNode;
  private amp: Amp;
  private env: Env;
  private channels: number = 1;
  private noise: AudioBufferSourceNode;

  constructor(props) {
    super(props);

    const { context } = props;

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

    this.amp = new Amp(context);

    this.env = new Env(context);
    this.env.attack = props.data.options.noiseAttack || 0.1; // TODO: all of this
    this.env.decay = props.data.options.noiseDecay || 0.5;
    this.env.max = props.data.options.noiseLevel || 1.0;

    this.noise.connect(this.amp.input);
    this.env.connect(this.amp.amplitude);
    this.amp.connect(props.output);

    this.handleNoiseAttackChange = this.handleNoiseAttackChange.bind(this);
    this.handleNoiseDecayChange = this.handleNoiseDecayChange.bind(this);

    this.state = { playing: false };
  }

  public componentWillReceiveProps(props) {
    if (props.playing && !this.state.playing) {
      this.noise.start(0);

      this.setState({ playing: true });
    } else if (!props.playing && this.state.playing) {
      // TODO: do a stop
      this.setState({ playing: false });
    }

    if (props.beat !== this.state.beat) {
      this.env.trigger();
    }
  }

  public render() {
    const { data } = this.props;

    return (
      <div class="section">
        <p>noise</p>
        <Knob
          display='block'
          max={ 10000 }
          min={ 0 }
          name='attack'
          onChange={ this.handleNoiseAttackChange }
          value={ data.options.noiseAttack * 1000 } />
        <Knob
          display='block'
          max={ 10000 }
          min={ 10 }
          name='decay'
          onChange={ this.handleNoiseDecayChange }
          value={ data.options.noiseDecay * 1000 } />
      </div>
    );
  }

  private handleNoiseAttackChange(value: number) {
    console.log(value / 1000);
  }

  private handleNoiseDecayChange(value: number) {
    console.log(value / 1000);
  }
}
