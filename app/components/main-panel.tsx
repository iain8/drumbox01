import { Component, h } from 'preact';
import { connect } from 'preact-redux';
import { getPreset } from '../state/actions/preset';
import Amp from '../modules/amp';
import Channels from './channels';
import Master from './master';
import Sequencer from './sequencer';

// TODO: put this somewhere
declare const webkitAudioContext: {
  new (): AudioContext;
};

class MainPanel extends Component<any, any> {
  private audioContext: AudioContext;
  private masterOutput: Amp;

  constructor(props) {
    super(props);

    this.audioContext = this.getContext();

    this.masterOutput = new Amp(this.audioContext);
    this.masterOutput.level = 1.0; // TODO: config
    this.masterOutput.connect(this.audioContext.destination);
  }

  public componentDidMount() {
    this.props.dispatch(getPreset(1));
  }

  public render(props: any) {
    const { beat, channels, playing, preset, sequences } = props;

    return (
      <div id='main-panel'>
        {
          preset
          ? <form onSubmit={ () => false } autocomplete='off'>
              <Master playing={ playing } preset={ preset } />
              <Channels
                beat={ beat }
                channels={ channels }
                context={ this.audioContext }
                master={ this.masterOutput }
                playing={ playing }
                sequences={ sequences } />

              <div class='container vertical-divider'></div>

              <div class='container' style='padding-left: 0; margin-left: -9px'>
                <Sequencer
                  beat={ beat }
                  patternLength={ preset.sequenceLength }
                  playing={ playing }
                  preset={ preset }
                  sequences={ sequences } />
              </div>
            </form>
          : ''
        }
      </div>
    );
  }

  private getContext(): AudioContext {
    return 'webkitAudioContext' in window ? new webkitAudioContext() : new AudioContext();
  }
}

const mapStateToProps = (props) => props;

export default connect(mapStateToProps)(MainPanel);
