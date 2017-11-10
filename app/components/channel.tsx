import { Component, h } from 'preact';
import Knob from './controls/knob';
import Mixer from './channel/mixer';
import Noise from './channel/noise';
import Osc from './channel/osc';

export default class Channel extends Component<any, any> { // TODO: SFC
  render(props) {
    const { active, context, data, index } = props;

    return ( // TODO: move active === index to parent
      <div class={ `channel ${ active === index ? 'active' : '' }` }>
        <Mixer data={ data } />
        <Osc
          context={ context }
          data={ data }
          index={ index } />
        <Noise data={ data } />
      </div>
    );
  }
}
