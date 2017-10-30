import { Component, h } from 'preact';
import data from '../data/default';

export default class Channels extends Component<any, any> {
  constructor() {
    super();

    this.state = {
      activeChannelIndex: 0,
    };
  }

  public render() {
    return (
      <div
        id='synth'
        class='container'>
        <ul id='channel-headers'>
          {
            data.map((channel, i) => {
              return (
                <li key={ channel.name } class={ i === this.state.activeChannelIndex ? 'active' : '' }>
                  <a onClick={ this.handleChannelChange.bind(this) }>{ channel.name }</a>
                </li>
              );
            })
          }
        </ul>
      </div>
    );
  }

  private handleChannelChange(e: Event) {
    // TODO: figure this out

    console.log(e);
  }
}
