import { Component, h } from 'preact';
import { connect } from 'preact-redux';
import { changeChannelParam } from '../../state/actions/channel';
import Knob from '../controls/knob';

export default class Mixer extends Component<any, any> {
  constructor(props) {
    super(props);

    this.handleParamChange = this.handleParamChange.bind(this);
  }

  public render(props) {
    const { data } = props;

    return (
      <div className='section'>
        <p>mixer</p>
        <Knob
          display='block'
          max={ 100 }
          min={ 0 }
          name='level'
          onChange={ (val) => this.handleParamChange(val / 100, 'level') }
          value={ data.level * 100 } />
        <Knob
          display='block'
          max={ 100 }
          min={ 0 }
          name='oscLevel'
          onChange={ (val) => this.handleParamChange(val / 100, 'oscLevel') }
          value={ data.oscLevel * 100 } />
        <Knob
          display='block'
          max={ 100 }
          min={ 0 }
          name='noiseLevel'
          onChange={ (val) => this.handleParamChange(val / 100, 'noiseLevel') }
          value={ data.noiseLevel * 100 } />
        <Knob
          display='block'
          max={ 22500 }
          min={ 10 }
          name='channelFilterFreq'
          onChange={ (val) => this.handleParamChange(val, 'channelFilterFreq') }
          value={ data.channelFilterFreq } />
        <Knob
          display='block'
          max={ 40 }
          min={ -40 }
          name='channelFilterGain'
          onChange={ (val) => this.handleParamChange(val, 'channelFilterGain') }
          value={ data.channelFilterGain } />
      </div>
    );
  }

  private handleParamChange(value: number, param: string) {
    this.props.onChange(changeChannelParam({
      index: this.props.index,
      param,
      value,
    }));
  }
}
