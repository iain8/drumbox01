import { Component, h } from 'preact';
import Channel from './channel';
import ChannelHeaders from './channel/headers';
import data from '../data/default';

interface IChannelsState {
  activeChannelIndex: number;
}

export default class Channels extends Component<any, IChannelsState> {
  constructor() {
    super();

    this.handleChannelChange = this.handleChannelChange.bind(this);

    this.state = {
      activeChannelIndex: 0,
    };
  }

  public render(props) {
    const { channels } = props;

    return (
      <div
        id='synth'
        class='container'>
        <ChannelHeaders
          active={ this.state.activeChannelIndex }
          data={ data }
          onChange={ this.handleChannelChange } />
        {
          channels.map((channel, i) => { // TODO: can we optimise to only create active channel
            return (
              <Channel
                active={ this.state.activeChannelIndex }
                data={ channel }
                index={ i } />
            );
          })
        }
      </div>
    );
  }

  private handleChannelChange(index: number) {
    this.setState({ activeChannelIndex: index });
  }
}
