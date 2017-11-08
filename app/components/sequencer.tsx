import { Component, h } from 'preact';
import { connect } from 'preact-redux';
import { nextBeat } from '../state/actions/sequencer';
import Sequence from './sequencer/sequence';

class Sequencer extends Component<any, any> {
  constructor(props) {
    super(props);

    this.state = {
      current: 0,
      interval: null,
      playing: false,
    };
  }

  public componentWillReceiveProps(props) {
    if (props.playing && !this.state.playing) {
      this.setState({
        interval: setInterval(
          () => ({ current: props.dispatch(nextBeat({})) }),
          this.bpmToMs(props.preset.tempo, props.preset.division)
        ),
        playing: true,
      });
    } else if (!props.playing && this.state.playing) {
      this.setState({
        playing: false,
      });

      clearInterval(this.state.interval);
    }
  }

  public render(props) {
    const { beat, patternLength, sequences } = props;

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
              <li class={ `beat ${i === beat ? 'on' : ''}` } />
            )
          }
        </ul>
      </div>
    );
  }

  private bpmToMs(bpm: number, division: number) : number {
    console.log(bpm, division, (60000 / bpm) / division);
    return (60000 / bpm) / division;
  }
}

const mapStateToProps = (state, { beat, patternLength, playing, preset, sequences }) => (
  { beat, patternLength, playing, preset, sequences }
);

export default connect(mapStateToProps)(Sequencer);
