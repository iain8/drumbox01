import { Component, h } from 'preact';
import data from '../data/default';

export default class Sequencer extends Component<any, any> {
  constructor() {
    super();

    this.state = {
      patternLength: 16,
    };
  }

  public render() {
    return (
      <div class='sequencer'>
        {
          data.map((channel) => {
            return (
              <ul class="sequence">
                {
                  Array(this.state.patternLength).fill(1).map((x, i) =>
                    <li class={ `beat ${channel.pattern.charAt(i) === '1' ? 'on' : ''}` } />
                  )
                }
                <li><a href="#" class="clear-sequence"></a></li>
              </ul>
            );
          })
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
