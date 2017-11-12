import { Component, h } from 'preact';
import { connect } from 'preact-redux';
import { changeChannelParam } from '../../state/actions/channel';
import Amp from '../../modules/amp';
import Env from '../../modules/env';
import Knob from '../controls/knob';

interface INoiseProps {
  beat: number;
  context: AudioContext;
  data: any;
  index: number;
  onChange: ({}) => void;
  output: Amp;
  pattern: string;
  playing: boolean;
}

export default class Noise extends Component<INoiseProps, any> {
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
    this.env.attack = props.data.noiseAttack || 0.1; // TODO: all of this
    this.env.decay = props.data.noiseDecay || 0.5;
    this.env.max = props.data.noiseLevel || 0;

    this.noise.connect(this.amp.input);
    this.env.connect(this.amp.amplitude);
    this.amp.connect(props.output);

    this.handleParamChange = this.handleParamChange.bind(this);
  }

  public componentWillReceiveProps(props) {
    if (props.playing && !this.props.playing) {
      this.noise.start(0);
    }

    if (props.playing && props.pattern.charAt(props.beat) === '1') {
      this.env.trigger();
    }
  }

  public render() {
    const { data } = this.props;

    return (
      <div className='section'>
        <p>noise</p>
        <Knob
          display='block'
          max={ 10000 }
          min={ 0 }
          name='noiseAttack'
          onChange={ (val) => this.handleParamChange(val / 1000, 'noiseAttack') }
          value={ data.noiseAttack * 1000 } />
        <Knob
          display='block'
          max={ 10000 }
          min={ 10 }
          name='noiseDecay'
          onChange={ (val) => this.handleParamChange(val / 1000, 'noiseDecay') }
          value={ data.noiseDecay * 1000 } />
      </div>
    );
  }

  private handleParamChange(value: number, param: string) {
    this.props.onChange(changeChannelParam({
      index: this.props.index,
      param,
      value,
    }));
  }
}
