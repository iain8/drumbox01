import { Component, h } from 'preact';
import Amp from '../modules/amp';
import Filter from '../modules/filter';
import Knob from './controls/knob';
import Mixer from './channel/mixer';
import Noise from './channel/noise';
import Osc from './channel/osc';

export default class Channel extends Component<any, any> {
  private filter: Filter;
  private preOutput: Amp;
  private postOutput: Amp;

  constructor(props) {
    super(props);

    const { context } = props;

    this.preOutput = new Amp(context);
    this.preOutput.level = 1.0;

    this.postOutput = new Amp(context);
    this.postOutput.level = props.outputLevel || 1.0; // TODO: yeah

    this.filter = new Filter(context);
    this.filter.frequency = props.channelFilterFreq || 500;
    this.filter.gain = props.channelFilterGain || 0;
    this.filter.type = 'peaking'; // TODO: uh
  }

  public componentDidMount() {
    this.preOutput.connect(this.filter);
    this.filter.connect(this.postOutput);

    this.postOutput.connect(this.props.master);
  }

  public render(props) {
    const { active, beat, context, data, index, pattern, playing, start } = props;

    return ( // TODO: move active === index to parent
      <div class={ `channel ${ active === index ? 'active' : '' }` }>
        <Mixer
          data={ data }
          index={ index } />
        <Osc
          beat={ beat }
          context={ context }
          data={ data }
          index={ index }
          output={ this.preOutput }
          pattern={ pattern }
          playing={ playing }
          start={ start } />
        <Noise
          beat={ beat }
          context={ context }
          data={ data }
          index={ index }
          output={ this.preOutput }
          pattern={ pattern }
          playing={ playing }
          start={ start } />
      </div>
    );
  }
}
