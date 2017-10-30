import { Component, h } from 'preact';
import Knob from '../controls/knob';
import Selector from '../controls/selector';

export default class Osc extends Component<any, any> {
  render() {
    const { data } = this.props;

    return (
      <div class="section">
        <p>osc</p>
        <Selector
          options={ this.props.waves } 
          selected={ data.options.wave } />
        <Knob
          display='block'
          onChange={ () => {} }
          value={ this.state.frequency } />
        <Knob
          display='block'
          onChange={ () => {} }
          value={ this.state.oscAttack } />
        <Knob
          display='block'
          onChange={ () => {} }
          value={ this.state.oscDecay } />
        <Knob
          display='block'
          onChange={ () => {} }
          value={ this.state.pitchAttack } />
        <Knob
          display='block'
          onChange={ () => {} }
          value={ this.state.pitchDecay } />
      </div>
    );
  }
}
