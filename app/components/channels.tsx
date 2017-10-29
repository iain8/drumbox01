import { Component, h } from 'preact';

export default class Channels extends Component<any, any> {
  public render() {
    return (
      <div
        id='synth'
        class='container'>
        <ul id='channel-headers'>
          <li class='active'><a data-name='kick'>kick</a></li>
        </ul>
      </div>
    );
  }
}
