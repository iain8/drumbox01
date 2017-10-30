import { Component, h } from 'preact';
import Knob from './controls/knob';

export default class Channel extends Component<any, any> {
  constructor() {
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
      <div class={ `channel ${ this.state.active ? 'active' : '' }` }>
        <div class="section">
          <p>mixer</p>
          <Knob
            display='block'
            onChange={ () => {} }
            value={ this.state.level } />
          <Knob
            display='block'
            onChange={ () => {} }
            value={ this.state.oscLevel } />
          <Knob
            display='block'
            onChange={ () => {} }
            value={ this.state.noiseLevel } />
          <Knob
            display='block'
            onChange={ () => {} }
            value={ this.state.filterFreq } />
          <Knob
            display='block'
            onChange={ () => {} }
            value={ this.state.filterGain } />
        </div>
        <div class="section">
          <p>osc</p>
          <div class="wave">
            <a href="#" class="prev"></a>
            <ul>
              {
                Object.keys(this.state.waves).forEach((key) => {
                  return (
                    <li class={ this.state.wave === key ? 'active' : '' } data-wave={ key }>
                      { this.state.waves[key] }
                    </li>
                  );
                })
              }
            </ul>
            <a href="#" class="next"></a>
          </div>
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
