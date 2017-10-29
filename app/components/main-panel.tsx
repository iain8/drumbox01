import { Component, h } from 'preact';
import Channels from './channels';
import Master from './master';
import Sequencer from './sequencer';

export default class MainPanel extends Component<any, any> {
  public render() {
    return (
      <div id='main-panel'>
        <form autocomplete='off'>
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
