import { Component, h } from 'preact';
import { connect } from 'preact-redux';
import { getPreset } from '../state/actions/preset';
import Channels from './channels';
import Master from './master';
import Sequencer from './sequencer';

// TODO: put this somewhere
declare const webkitAudioContext: {
  new (): AudioContext;
};

class MainPanel extends Component<any, any> {
  public componentDidMount() {
    this.props.dispatch(getPreset(1));
  }

  public render(props: any) {
    const { beat, channels, playing, preset, sequences } = props;
    const context = this.getContext();

    return (
      <div id='main-panel'>
        {
          preset
          ? <form onSubmit={ () => false } autocomplete='off'>
              <Channels
                channels={ channels }
                context={ context }/>

              <div class='container vertical-divider'></div>

              <div class='container' style='padding-left: 0; margin-left: -9px'>
                <Sequencer
                  beat={ beat }
                  patternLength={ preset.sequenceLength }
                  playing={ playing }
                  preset={ preset }
                  sequences={ sequences } />

                <div class='horizontal-divider'></div>
                  <Master playing={ playing } preset={ preset } />
                </div>
            </form>
          : ''
        }
      </div>
    );
  }

  private getContext() : AudioContext {
    return 'webkitAudioContext' in window ? new webkitAudioContext() : new AudioContext();
  }
}

const mapStateToProps = ({ beat, channels, loading, playing, preset, sequences }) => (
  { beat, channels, loading, playing, preset, sequences }
);

export default connect(mapStateToProps)(MainPanel);
