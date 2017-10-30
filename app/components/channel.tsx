import { Component, h } from 'preact';
import Knob from './controls/knob';
import Mixer from './channel/mixer';
import Osc from './channel/osc';

export default class Channel extends Component<any, any> {
  constructor(props) {
    super();

    this.state = {
      active: true,
      filterFreq: 100,
      filterGain: 100,
      frequency: 100,
      level: 100,
      noiseAttack: 100,
      noiseDecay: 100,
      noiseLevel: 100,
      oscAttack: 100,
      oscDecay: 100,
      oscLevel: 100,
      pitchAttack: 100,
      pitchDecay: 100,
      wave: 'sine',
      waves: {
        sine: 'sine',
        square: 'sqr',
        sawtooth: 'saw',
        triangle: 'tri',
      },
    };
  }

  render() {
    return (
      <div class={ `channel ${ this.props.active === this.props.index ? 'active' : '' }` }>
        <Mixer data={ this.props.data } />
        <Osc
          data={ this.props.data }
          waves={ this.state.waves } />
        <div class="section">
          <p>noise</p>
          <Knob
            display='block'
            onChange={ () => {} }
            value={ this.state.noiseAttack } />
          <Knob
            display='block'
            onChange={ () => {} }
            value={ this.state.noiseDecay } />
        </div>
      </div>
    );
  }
}
