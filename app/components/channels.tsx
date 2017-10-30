import { Component, h } from 'preact';
import Channel from './channel';
import ChannelHeaders from './channel/headers';
import data from '../data/default';

export default class Channels extends Component<any, any> {
  constructor() {
    super();

    this.handleChannelChange = this.handleChannelChange.bind(this);

    this.state = {
      activeChannelIndex: 0,
    };
  }

  public render() {
    return (
      <div
        id='synth'
        class='container'>
        <ChannelHeaders
          active={ this.state.activeChannelIndex }
          data={ data }
          onChange={ this.handleChannelChange } />
        <Channel />
      </div>
    );
  }

  private handleChannelChange(index: number) {
    this.setState({ activeChannelIndex: index });
  }
}
