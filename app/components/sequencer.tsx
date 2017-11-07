import { Component, h } from 'preact';
import Sequence from './sequencer/sequence';

export default class Sequencer extends Component<any, any> { // TODO: stateless component
  public render(props) {
    const { patternLength, sequences } = props;

    return (
      <div class='sequencer'>
        {
          sequences.map((sequence, i) =>
            <Sequence
              index={ i }
              pattern={ sequence.pattern }
              patternLength={ patternLength } />
          )
        }
        <ul class="sequence indicator">
          {
            Array(patternLength).fill(1).map((x, i) =>
              <li class={ `beat ${i === 0 ? 'on' : ''}` } />
            )
          }
        </ul>
      </div>
    );
  }
}
