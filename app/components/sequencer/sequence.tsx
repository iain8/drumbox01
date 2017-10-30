import { Component, h } from 'preact';
import Beat from './beat';

export default class Sequence extends Component<any, any> {
  constructor(props) {
    super(props);

    this.state = {
      pattern: this.props.pattern,
    };

    this.clearSequence = this.clearSequence.bind(this);
    this.handleBeatClick = this.handleBeatClick.bind(this);
  }

  public render() {
    return (
      <ul class="sequence">
        {
          Array(this.props.patternLength).fill(1).map((x, i) =>
            <Beat
              index={ i }
              on={ this.state.pattern.charAt(i) === '1' }
              onClick={ this.handleBeatClick } />
          )
        }
        <li><a onClick={ this.clearSequence } class="clear-sequence"></a></li>
      </ul>
    );
  }

  private handleBeatClick(index: number) {
    const pattern = this.state.pattern.split('');
    pattern[index] = pattern[index] === '0' ? '1' : '0';

    this.setState({ pattern: pattern.join('') });
  }

  private clearSequence() {
    this.setState({
      pattern: Array(this.props.patternLength).fill(0).join(''),
    });
  }
}
