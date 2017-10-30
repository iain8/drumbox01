import { Component, h } from 'preact';
import Knob from '../controls/knob';
import Selector from '../controls/selector';

export default class Osc extends Component<any, any> {
  constructor(props) {
    super(props);

    this.handleFreqChange = this.handleFreqChange.bind(this);
    this.handleWaveChange = this.handleWaveChange.bind(this);
    this.handleOscAttackChange = this.handleOscAttackChange.bind(this);
    this.handleOscDecayChange = this.handleOscDecayChange.bind(this);
    this.handlePitchAttackChange = this.handlePitchAttackChange.bind(this);
    this.handlePitchDecayChange = this.handlePitchDecayChange.bind(this);
  }

  public render() {
    const { data } = this.props;

    return (
      <div class="section">
        <p>osc</p>
        <Selector
          onChange={ this.handleWaveChange }
          options={ this.props.waves } 
          selected={ data.options.wave } />
        <Knob
          display='block'
          max={ 2000 }
          min={ 20 }
          onChange={ this.handleFreqChange }
          value={ data.options.frequency } />
        <Knob
          display='block'
          max={ 10000 }
          min={ 0 }
          onChange={ this.handleOscAttackChange }
          value={ data.options.oscAttack * 1000 } />
        <Knob
          display='block'
          max={ 10000 }
          min={ 10 }
          onChange={ this.handleOscDecayChange }
          value={ data.options.oscDecay * 1000 } />
        <Knob
          display='block'
          max={ 10000 }
          min={ 0 }
          onChange={ this.handlePitchAttackChange }
          value={ data.options.pitchAttack * 1000 } />
        <Knob
          display='block'
          max={ 10000 }
          min={ 10 }
          onChange={ this.handlePitchDecayChange }
          value={ data.options.pitchDecay * 1000 } />
      </div>
    );
  }

  private handleWaveChange() {
    // TODO
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
