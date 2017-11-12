import { Component, h } from 'preact';
import Channel from './channel';
import ChannelHeaders from './channel/headers';

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
    const { beat, channels, context, playing, sequences } = props;

    return (
      <div
        id='synth'
        class='container'>
        <ChannelHeaders
          active={ this.state.activeChannelIndex }
          channels={ Object.keys(channels) }
          onChange={ this.handleChannelChange } />
        {
          Object.keys(channels).map((name, i) => {
            return (
              <Channel
                active={ this.state.activeChannelIndex === i }
                beat={ beat }
                context={ context }
                master={ props.master }
                name={ name }
                pattern={ sequences[i].pattern }
                playing={ playing } />
            );
            // TODO: sequences order not guaranteed!
          })
        }
      </div>
    );
  }

  private handleChannelChange(index: number) {
    this.setState({ activeChannelIndex: index });
  }
}
