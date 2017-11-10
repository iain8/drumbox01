import { h } from 'preact';
import { connect } from 'preact-redux';
import BaseModule from './base';
import Knob from '../controls/knob';
import Selector from '../controls/selector';
import * as channelActions from '../../state/actions/channel';

class Osc extends BaseModule {
  public input: OscillatorNode;
  public output: OscillatorNode;
  public frequency: AudioParam;
  private oscillator: any;	// due to iOS noteOn()

  constructor(props) {
    super(props);

    const { frequency, wave } = props.data.options;

    // TODO: where is my oscamp?

    this.oscillator = props.context.createOscillator();
    this.oscillator.type = wave;
    this.oscillator.frequency.value = frequency;
    this.input = this.oscillator;
    this.output = this.oscillator;
    this.frequency = this.oscillator.frequency;

    this.handleFreqChange = this.handleFreqChange.bind(this);
    this.handleWaveChange = this.handleWaveChange.bind(this);
    this.handleOscAttackChange = this.handleOscAttackChange.bind(this);
    this.handleOscDecayChange = this.handleOscDecayChange.bind(this);
    this.handlePitchAttackChange = this.handlePitchAttackChange.bind(this);
    this.handlePitchDecayChange = this.handlePitchDecayChange.bind(this);
  }

  public render(props) {
    const {
      frequency,
      oscAmpAttack,
      oscAmpDecay,
      oscPitchAttack,
      oscPitchDecay,
      wave,
    } = this.props.data.options;

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

  private handleWaveChange(direction: string) {
    this.props.dispatch(channelActions.changeWave({
      direction,
      index: this.props.index,
      wave: this.props.data.options.wave,
    }));
  }

  private handleFreqChange(frequency: number) {
    this.props.dispatch(channelActions.changeOscParam({
      index: this.props.index,
      param: 'frequency',
      value: frequency,
    }));
  }

  private handleOscAttackChange(attack: number) {
    this.props.dispatch(channelActions.changeOscParam({
      index: this.props.index,
      param: 'oscAmpAttack',
      value: attack / 1000,
    }));
  }

  private handleOscDecayChange(decay: number) {
    this.props.dispatch(channelActions.changeOscParam({
      index: this.props.index,
      param: 'oscAmpDecay',
      value: decay / 1000,
    }));
  }

  private handlePitchAttackChange(attack: number) {
    this.props.dispatch(channelActions.changeOscParam({
      index: this.props.index,
      param: 'oscPitchAttack',
      value: attack / 1000,
    }));
  }

  private handlePitchDecayChange(decay: number) {
    this.props.dispatch(channelActions.changeOscParam({
      index: this.props.index,
      param: 'oscPitchDecay',
      value: decay / 1000,
    }));
  }
}

const mapStateToProps = (state, { context, data, index }) => ({
  context,
  data,
  index,
});

export default connect(mapStateToProps)(Osc);
