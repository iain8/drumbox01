import { Component, h } from 'preact';
import { connect } from 'preact-redux';
import * as channelActions from '../../state/actions/channel';
import Amp from '../../modules/amp';
import Env from '../../modules/env';
import Knob from '../controls/knob';
import Selector from '../controls/selector';

interface IOscProps {
  beat: number;
  context: AudioContext;
  data: any; // TODO: definition
  dispatch?: ({}) => void;
  index: number;
  output: Amp;
  pattern: string;
  playing: boolean;
}

class Osc extends Component<IOscProps, any> {
  public input: OscillatorNode;
  public output: OscillatorNode;
  public frequency: AudioParam;
  private oscillator: any;	// due to iOS noteOn()
  private amp: Amp;
  private pitchEnvelope: Env;
  private ampEnvelope: Env;

  constructor(props) {
    super(props);

    const { context, output } = props;

    this.oscillator = context.createOscillator();

    this.input = this.oscillator;
    this.output = this.oscillator;

    this.amp = new Amp(context);
    this.pitchEnvelope = new Env(context);
    this.ampEnvelope = new Env(context);

    this.updateNodes(props);

    this.amp.connect(output);
    this.oscillator.connect(this.amp.input);
    this.pitchEnvelope.connect(this.oscillator.frequency);
    this.ampEnvelope.connect(this.amp.amplitude);

    this.handleFreqChange = this.handleFreqChange.bind(this);
    this.handleWaveChange = this.handleWaveChange.bind(this);
    this.handleOscAttackChange = this.handleOscAttackChange.bind(this);
    this.handleOscDecayChange = this.handleOscDecayChange.bind(this);
    this.handlePitchAttackChange = this.handlePitchAttackChange.bind(this);
    this.handlePitchDecayChange = this.handlePitchDecayChange.bind(this);
  }

  public connect(node: any) {
    if (node.hasOwnProperty('input')) {
      this.output.connect(node.input);
    } else {
      this.output.connect(node);
    }
  }

  public componentWillReceiveProps(props) {
    this.updateNodes(props);

    if (props.playing && !this.props.playing) {
      this.oscillator.start ? this.oscillator.start(0) : this.oscillator.noteOn(0);
    }

    if (props.playing && props.pattern.charAt(props.beat) === '1') {
      this.ampEnvelope.trigger();
      this.pitchEnvelope.trigger();
    }
  }

  public render(props) {
    const {
      frequency,
      oscAmpAttack,
      oscAmpDecay,
      oscPitchAttack,
      oscPitchDecay,
      wave,
    } = props.data;

    const waves = ['sine', 'sqr', 'saw', 'tri']; // TODO: omg

    return (
      <div className='section'>
        <p>osc</p>
        <Selector
          onNext={ () => this.handleWaveChange('next') }
          onPrev={ () => this.handleWaveChange('prev') }
          options={ waves }
          selected={ wave } />
        <Knob
          display='block'
          max={ 2000 }
          min={ 20 }
          name='freq'
          onChange={ this.handleFreqChange }
          value={ frequency } />
        <Knob
          display='block'
          max={ 10000 }
          min={ 0 }
          name='attack'
          onChange={ this.handleOscAttackChange }
          value={ oscAmpAttack * 1000 } />
        <Knob
          display='block'
          max={ 10000 }
          min={ 10 }
          name='decay'
          onChange={ this.handleOscDecayChange }
          value={ oscAmpDecay * 1000 } />
        <Knob
          display='block'
          max={ 10000 }
          min={ 0 }
          name='attack'
          onChange={ this.handlePitchAttackChange }
          value={ oscPitchAttack * 1000 } />
        <Knob
          display='block'
          max={ 10000 }
          min={ 10 }
          name='decay'
          onChange={ this.handlePitchDecayChange }
          value={ oscPitchDecay * 1000 } />
      </div>
    );
  }

  private updateNodes(props) {
    const {
      frequency,
      oscAmpAttack,
      oscAmpDecay,
      oscLevel,
      oscPitchAttack,
      oscPitchDecay,
      wave,
    } = props.data;

    this.oscillator.frequency.value = frequency || 440;
    this.frequency = this.oscillator.frequency;

    this.pitchEnvelope.attack = oscPitchAttack || 0.1;
    this.pitchEnvelope.decay = oscPitchDecay || 0.5;
    this.pitchEnvelope.max = frequency || 440;

    this.ampEnvelope.attack = oscAmpAttack || 0.2;
    this.ampEnvelope.decay = oscAmpDecay || 0.8;
    this.ampEnvelope.max = oscLevel || 1.0;

    this.oscillator.type = wave;
  }

  private handleWaveChange(direction: string) {
    this.props.dispatch(channelActions.changeWave({
      direction,
      index: this.props.index,
      wave: this.props.data.wave,
    }));
  }

  private handleFreqChange(frequency: number) {
    this.props.dispatch(channelActions.changeChannelParam({
      index: this.props.index,
      param: 'frequency',
      value: frequency,
    }));
  }

  private handleOscAttackChange(attack: number) {
    this.props.dispatch(channelActions.changeChannelParam({
      index: this.props.index,
      param: 'oscAmpAttack',
      value: attack / 1000,
    }));
  }

  private handleOscDecayChange(decay: number) {
    this.props.dispatch(channelActions.changeChannelParam({
      index: this.props.index,
      param: 'oscAmpDecay',
      value: decay / 1000,
    }));
  }

  private handlePitchAttackChange(attack: number) {
    this.props.dispatch(channelActions.changeChannelParam({
      index: this.props.index,
      param: 'oscPitchAttack',
      value: attack / 1000,
    }));
  }

  private handlePitchDecayChange(decay: number) {
    this.props.dispatch(channelActions.changeChannelParam({
      index: this.props.index,
      param: 'oscPitchDecay',
      value: decay / 1000,
    }));
  }
}

const mapStateToProps = (state, props: IOscProps) => props;

export default connect(mapStateToProps)(Osc);
