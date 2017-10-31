import { Component, h } from 'preact';
import Knob from '../controls/knob';

export default class Mixer extends Component<any, any> {
  constructor(props) {
    super(props);

    this.handleFilterFreqChange = this.handleFilterFreqChange.bind(this);
    this.handleFilterGainChange = this.handleFilterGainChange.bind(this);
    this.handleLevelChange = this.handleLevelChange.bind(this);
    this.handleNoiseLevelChange = this.handleNoiseLevelChange.bind(this);
    this.handleOscLevelChange = this.handleOscLevelChange.bind(this);
  }

  public render() {
    const { data } = this.props;

    return (
      <div class="section">
        <p>mixer</p>
        <Knob
          display='block'
          max={ 100 }
          min={ 0 }
          name='level'
          onChange={ this.handleLevelChange }
          value={ data.options.level * 100 } />
        <Knob
          display='block'
          max={ 100 }
          min={ 0 }
          name='osc'
          onChange={ this.handleOscLevelChange }
          value={ data.options.oscLevel * 100 } />
        <Knob
          display='block'
          max={ 100 }
          min={ 0 }
          name='noise'
          onChange={ this.handleNoiseLevelChange }
          value={ data.options.noiseLevel } />
        <Knob
          display='block'
          max={ 22500 }
          min={ 10 }
          name='freq'
          onChange={ this.handleFilterFreqChange }
          value={ data.options.channelFilterFreq } />
        <Knob
          display='block'
          max={ 40 }
          min={ -40 }
          name='gain'
          onChange={ this.handleFilterGainChange }
          value={ data.options.channelFilterGain } />
      </div>
    );
  }

  private handleLevelChange(value: number) {
    console.log(value / 100);
  }

  private handleOscLevelChange(value: number) {
    console.log(value / 100);
  }

  private handleNoiseLevelChange(value: number) {
    console.log(value / 100);
  }

  private handleFilterFreqChange(value: number) {
    console.log(value);
  }

  private handleFilterGainChange(value: number) {
    console.log(value);
  }
}
