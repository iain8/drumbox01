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
    const { channels, preset, sequences } = props;

    return (
      <div id='main-panel'>
        {
          preset
          ? <form onSubmit={ () => false } autocomplete='off'>
              <Channels channels={ channels } />

              <div class='container vertical-divider'></div>

              <div class='container' style='padding-left: 0; margin-left: -9px'>
                <Sequencer sequences={ sequences } patternLength={ preset.sequenceLength } />

                <div class='horizontal-divider'></div>
                  <Master preset={ preset } />
                </div>
            </form>
          : ''
        }
      </div>
    );
  }
}

const mapStateToProps = ({ channels, loading, preset, sequences }) => (
  { channels, loading, preset, sequences }
);

export default connect(mapStateToProps)(MainPanel);
