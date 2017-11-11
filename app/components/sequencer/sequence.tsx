import { Component, h } from 'preact';
import { connect } from 'preact-redux';
import { clearSequence, toggleBeat } from '../../state/actions/sequencer';
import Beat from './beat';

interface ISequenceProps {
  dispatch?: ({}) => void;
  index: number;
  pattern: string;
  patternLength: number;
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
      <ul className='sequence'>
        {
          Array(patternLength).fill(1).map((x: any, i: number) =>
            <Beat
              index={ i }
              on={ pattern.charAt(i) === '1' }
              onClick={ this.handleBeatClick } />,
          )
        }
        <li>
          <a onClick={ this.clearSequence } className='clear-sequence'></a>
        </li>
      </ul>
    );
  }

  private handleBeatClick(beatIndex: number) {
    this.props.dispatch(toggleBeat({
      beat: beatIndex,
      seq: this.props.index,
    }));
  }

  private clearSequence() {
    this.props.dispatch(clearSequence({
      seq: this.props.index,
    }));
  }
}

const mapStateToProps = (state: any, props: ISequenceProps) => ({
  index: props.index,
  pattern: props.pattern,
  patternLength: props.patternLength,
});

export default connect(mapStateToProps)(Sequence);
