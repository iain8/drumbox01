import { Component, h } from 'preact';
import Knob from '../controls/knob';

export default class Noise extends Component<any, any> {
  constructor(props) {
    super(props);

    this.handleNoiseAttackChange = this.handleNoiseAttackChange.bind(this);
    this.handleNoiseDecayChange = this.handleNoiseDecayChange.bind(this);
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
          onChange={ this.handleNoiseAttackChange }
          value={ data.options.noiseAttack * 1000 } />
        <Knob
          display='block'
          max={ 10000 }
          min={ 10 }
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
