import { Component, h } from 'preact';
import { connect } from 'preact-redux';
import { getPreset } from '../state/actions/preset';
import Channels from './channels';
import Master from './master';
import Sequencer from './sequencer';

class MainPanel extends Component<any, any> {
  componentDidMount() {
    console.log('props', this.props);
    this.props.dispatch(getPreset(1));
  }

  public render() {
    return (
      <div id='main-panel'>
        <form onSubmit={ () => false } autocomplete='off'>
          <Channels />

          <div class='container vertical-divider'></div>

          <div class='container' style='padding-left: 0; margin-left: -9px'>
            <Sequencer />

            <div class='horizontal-divider'></div>
              <Master />
            </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { something: 'hi' };
};

export default connect(mapStateToProps)(MainPanel);
