import { Component, h } from 'preact';

interface ISpeakerProps {
  grilleCount: number;
}

export default class Speaker extends Component<ISpeakerProps, any> {
  public render() {
    return (
      <ul id='speaker'>
        {Array(this.props.grilleCount).fill(1).map((x, i) =>
          <li key={ i.toString() }>
            <div class='horizontal-divider'></div>
          </li>,
        )}
      </ul>
    );
  }
}
