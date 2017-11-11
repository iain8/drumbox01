import { Component, h } from 'preact';
import { connect } from 'preact-redux';
import { changeChannelParam } from '../../state/actions/channel';
import Amp from '../../modules/amp';
import Env from '../../modules/env';
import Knob from '../controls/knob';

interface INoiseProps {
  context: AudioContext;
  data: any;
  dispatch: ({}) => void;
  index: number;
}

class Noise extends Component<INoiseProps, any> {
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

  private handleNoiseAttackChange(attack: number) {
    this.props.dispatch(changeChannelParam({
      index: this.props.index,
      param: 'noiseAttack',
      value: attack / 1000,
    }));
  }

  private handleNoiseDecayChange(decay: number) {
    this.props.dispatch(changeChannelParam({
      index: this.props.index,
      param: 'noiseDecay',
      value: decay / 1000,
    }));
  }
}

const mapStateToProps = (state, props) => props;

export default connect(mapStateToProps)(Noise);
