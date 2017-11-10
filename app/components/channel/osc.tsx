import { h } from 'preact';
import { connect } from 'preact-redux';
import BaseModule from './base';
import Knob from '../controls/knob';
import Selector from '../controls/selector';
import { changeWave } from '../../state/actions/channel';

class Osc extends BaseModule {
  public input: OscillatorNode;
  public output: OscillatorNode;
  public frequency: AudioParam;
  private oscillator: any;	// due to iOS noteOn()

  constructor(props) {
    super(props);

    const { frequency, wave } = props.data.options;

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
      oscAttack,
      oscDecay,
      pitchAttack,
      pitchDecay,
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
          selected={ wave || 'sine' /* TODO: update db */ } />
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
          value={ oscAttack * 1000 } />
        <Knob
          display='block'
          max={ 10000 }
          min={ 10 }
          name='decay'
          onChange={ this.handleOscDecayChange }
          value={ oscDecay * 1000 } />
        <Knob
          display='block'
          max={ 10000 }
          min={ 0 }
          name='attack'
          onChange={ this.handlePitchAttackChange }
          value={ pitchAttack * 1000 } />
        <Knob
          display='block'
          max={ 10000 }
          min={ 10 }
          name='decay'
          onChange={ this.handlePitchDecayChange }
          value={ pitchDecay * 1000 } />
      </div>
    );
  }

  private handleWaveChange(direction: string) {
    this.props.dispatch(changeWave({
      direction,
      index: this.props.index,
      wave: this.props.data.options.wave,
    }));
  }

  private handleFreqChange(value: number) {
    console.log(value);
  }

  private handleOscAttackChange(value: number) {
    console.log(value / 1000);
  }

  private handleOscDecayChange(value: number) {
    console.log(value / 1000);
  }

  private handlePitchAttackChange(value: number) {
    console.log(value / 1000);
  }

  private handlePitchDecayChange(value: number) {
    console.log(value / 1000);
  }
}

const mapStateToProps = (state, { context, data, index }) => ({
  context,
  data,
  index,
});

export default connect(mapStateToProps)(Osc);
