import { Component, h } from 'preact';
import { connect } from 'preact-redux';
import Amp from '../modules/amp';
import Filter from '../modules/filter';
import Knob from './controls/knob';
import Mixer from './channel/mixer';
import Noise from './channel/noise';
import Osc from './channel/osc';

class Channel extends Component<any, any> {
  private filter: Filter;
  private preOutput: Amp;
  private postOutput: Amp;

  constructor(props) {
    super(props);

    this.handleParamChange = this.handleParamChange.bind(this);
  }

  public componentWillMount() {
    const { context } = this.props;

    this.preOutput = new Amp(context);
    this.preOutput.level = 1.0;

    this.postOutput = new Amp(context);
    this.postOutput.level = this.props.level || 1.0; // TODO: yeah

    this.filter = new Filter(context);
    this.filter.frequency = this.props.channelFilterFreq || 500;
    this.filter.gain = this.props.channelFilterGain || 0;
    this.filter.type = 'peaking'; // TODO: uh
  }

  public componentDidMount() {
    this.preOutput.connect(this.filter);
    this.filter.connect(this.postOutput);

    this.postOutput.connect(this.props.master);
  }

  public render(props) {
    const { active, beat, channel, context, pattern, playing, name } = props;

    return ( // TODO: move active === index to parent
      <div class={ `channel ${ active ? 'active' : '' }` }>
        <Mixer
          data={ channel }
          index={ name }
          onChange={ this.handleParamChange } />
        <Osc
          beat={ beat }
          context={ context }
          data={ channel }
          onChange={ this.handleParamChange }
          output={ this.preOutput }
          pattern={ pattern }
          playing={ playing } />
        <Noise
          beat={ beat }
          context={ context }
          data={ channel }
          index={ name }
          onChange={ this.handleParamChange }
          output={ this.preOutput }
          pattern={ pattern }
          playing={ playing } />
      </div>
    );
  }

  private handleParamChange(action) {
    this.props.dispatch(action);
  }
}

const mapStateToProps = (initialState, props) =>
  (state) => ({
    channel: state.channels[props.name],
  });

export default connect(mapStateToProps)(Channel);
