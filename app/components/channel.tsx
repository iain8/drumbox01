import { Component, h } from 'preact';
import Knob from './controls/knob';
import Mixer from './channel/mixer';
import Noise from './channel/noise';
import Osc from './channel/osc';
import Amp from '../modules/amp';
import Filter from '../modules/filter';

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
    // this.noise.connect(this.noiseAmp);
    // this.noiseAmpEnv.connect(this.noiseAmp.amplitude);
    // this.noiseAmp.connect(this.preOutput);

    this.preOutput.connect(this.filter);
    this.filter.connect(this.postOutput);

    this.postOutput.connect(this.props.master);
  }

  public render(props) {
    const { active, context, data, index } = props;

    return ( // TODO: move active === index to parent
      <div class={ `channel ${ active === index ? 'active' : '' }` }>
        <Mixer data={ data } />
        <Osc
          context={ context }
          data={ data }
          index={ index }
          output={ this.preOutput } />
        <Noise data={ data } />
      </div>
    );
  }
}
