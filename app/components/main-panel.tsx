import { Component, h } from 'preact';
import { connect } from 'preact-redux';
import { getPreset } from '../state/actions/preset';
import Channels from './channels';
import Master from './master';
import Sequencer from './sequencer';

class MainPanel extends Component<any, any> {
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
              <Channels channels={ channels } />

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
}

const mapStateToProps = ({ beat, channels, loading, playing, preset, sequences }) => (
  { beat, channels, loading, playing, preset, sequences }
);

export default connect(mapStateToProps)(MainPanel);
