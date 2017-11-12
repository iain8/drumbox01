import { Component, h } from 'preact';
import { connect } from 'preact-redux';
import { changeChannelParam } from '../../state/actions/channel';
import Knob from '../controls/knob';

class Mixer extends Component<any, any> {
  constructor(props) {
    super(props);

    this.handleFilterFreqChange = this.handleFilterFreqChange.bind(this);
    this.handleFilterGainChange = this.handleFilterGainChange.bind(this);
    this.handleLevelChange = this.handleLevelChange.bind(this);
    this.handleNoiseLevelChange = this.handleNoiseLevelChange.bind(this);
    this.handleOscLevelChange = this.handleOscLevelChange.bind(this);
  }

  public render(props) {
    const { data } = props;

    console.log(data.options.level, props);

    return (
      <div className='section'>
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

  private handleLevelChange(level: number) {
    this.props.dispatch(changeChannelParam({
      index: this.props.index,
      param: 'level',
      value: level / 100,
    }));
  }

  private handleOscLevelChange(level: number) {
    this.props.dispatch(changeChannelParam({
      index: this.props.index,
      param: 'oscLevel',
      value: level / 100,
    }));
  }

  private handleNoiseLevelChange(level: number) {
    this.props.dispatch(changeChannelParam({
      index: this.props.index,
      param: 'noiseLevel',
      value: level / 100,
    }));
  }

  private handleFilterFreqChange(freq: number) {
    this.props.dispatch(changeChannelParam({
      index: this.props.index,
      param: 'channelFilterFreq',
      value: freq,
    }));
  }

  private handleFilterGainChange(gain: number) {
    this.props.dispatch(changeChannelParam({
      index: this.props.index,
      param: 'channelFilterGain',
      value: gain,
    }));
  }
}

const mapStateToProps = (state, props) => props;

export default connect(mapStateToProps)(Mixer);
