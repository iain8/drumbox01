import { Component, h } from 'preact';
import Sequence from './sequencer/sequence';

export default class Sequencer extends Component<any, any> {
  constructor() {
    super();

    this.state = {
      patternLength: 16,
    };
  }

  public render(props) {
    const { sequences } = props;

    return (
      <div class='sequencer'>
        {
          sequences.map((sequence, i) =>
            <Sequence
              index={ i }
              pattern={ sequence.pattern }
              patternLength={ this.state.patternLength } />
          )
        }
        <ul class="sequence indicator">
          {
            Array(this.state.patternLength).fill(1).map((x, i) =>
              <li class={ `beat ${i === 0 ? 'on' : ''}` } />
            )
          }
        </ul>
      </div>
    );
  }
}
