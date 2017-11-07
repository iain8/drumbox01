import { Component, h } from 'preact';
import { connect } from 'preact-redux';
import { toggleBeat } from '../../state/actions/sequencer';
import Beat from './beat';

interface ISequenceProps {
  dispatch?: Function,
  index: number,
  pattern: string,
  patternLength: number,
  toggleBeat?: Function,
}

class Sequence extends Component<ISequenceProps, any> {
  constructor(props) {
    super(props);

    this.state = {
      pattern: this.props.pattern,
    };

    this.clearSequence = this.clearSequence.bind(this);
    this.handleBeatClick = this.handleBeatClick.bind(this);
  }

  public render(props) {
    const { pattern, patternLength } = props;

    return (
      <ul class="sequence">
        {
          Array(patternLength).fill(1).map((x: any, i: number) =>
            <Beat
              index={ i }
              on={ pattern.charAt(i) === '1' }
              onClick={ this.handleBeatClick } />
          )
        }
        <li><a onClick={ this.clearSequence } class="clear-sequence"></a></li>
      </ul>
    );
  }

  private handleBeatClick(beatIndex: number) {
    this.props.dispatch(toggleBeat({
      beat: beatIndex,
      seq: this.props.index,
    }));
  }

  private clearSequence() { // TODO: move to reducer
    this.setState({
      pattern: Array(this.props.patternLength).fill(0).join(''),
    });
  }
}

const mapStateToProps = (state: any, props: ISequenceProps) => ({
  index: props.index,
  pattern: props.pattern,
  patternLength: props.patternLength,
});

export default connect(mapStateToProps)(Sequence);
