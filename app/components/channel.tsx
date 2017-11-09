import { Component, h } from 'preact';
import Knob from './controls/knob';
import Mixer from './channel/mixer';
import Noise from './channel/noise';
import Osc from './channel/osc';

export default class Channel extends Component<any, any> {
  private defaults = {
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
  };

  constructor(props) {
    super();

    this.state = {
      waves: ['sine', 'sqr', 'saw', 'tri'],
    };
  }

  render(props) {
    const { active, context, data, index } = props;

    return ( // TODO: move active === index to parent
      <div class={ `channel ${ active === index ? 'active' : '' }` }>
        <Mixer data={ data } />
        <Osc
          context={ context }
          data={ data }
          waves={ this.state.waves } />
        <Noise data={ data } />
      </div>
    );
  }
}
