import { Component, h } from 'preact';
import { connect } from 'preact-redux';
import * as masterActions from '../state/actions/master';
import Division from './controls/division';
import Knob from './controls/knob';
import Speaker from './speaker';
import Selector from './controls/selector';

interface IMasterProps {
  dispatch?: any;
  playing: boolean;
  preset: any;
}

class Master extends Component<IMasterProps, any> {
  constructor(props) {
    super(props);

    this.handleDivisionChange = this.handleDivisionChange.bind(this);
    this.handleStartButton = this.handleStartButton.bind(this);
    this.handleStopButton = this.handleStopButton.bind(this);
    this.handleTempoChange = this.handleTempoChange.bind(this);
    this.handleVolumeChange = this.handleVolumeChange.bind(this);
  }

  public render(props) {
    const { division, masterVolume, tempo } = props.preset;

    return (
      <div className='master'>
        <div className='title'>
          <h2>DRUMBOX<small>01</small></h2>
        </div>
        <div className='screen'>
        </div>
        <div className='controls'>
          <div>
            <button
              className={ `sequencer-control start ${ props.playing ? 'active' : '' }` }
              onClick={ this.handleStartButton }>
              { 'start' }
            </button>
            <button
              className={ `sequencer-control stop ${ props.playing ? '' : 'active' }` }
              onClick={ this.handleStopButton }>
              { 'stop' }
            </button>
          </div>

            <Selector
              down={ () => this.handleTempoChange(tempo - 1) }
              up={ () => this.handleTempoChange(tempo + 1) }
              value={ tempo } />
            <Selector
              down={ () => this.handleDivisionChange('prev') }
              up={ () => this.handleDivisionChange('next') }
              value={ division } />

          <div>
            <Knob
              name='master'
              onChange={ this.handleVolumeChange }
              value={ masterVolume } />
          </div>
        </div>
      </div>
    );
  }

  private handleTempoChange(tempo: number) {
    this.props.dispatch(masterActions.changeTempo({ tempo }));
  }

  private handleVolumeChange(volume: number) {
    this.props.dispatch(masterActions.changeMasterVolume({ volume }));
  }

  private handleDivisionChange(direction: any) {
    this.props.dispatch(masterActions.changeDivision({ direction }));
  }

  private handleStartButton(e: Event) {
    e.preventDefault();

    this.props.dispatch(masterActions.changePlayingState({ playing: true }));
  }

  private handleStopButton(e: Event) {
    e.preventDefault();

    this.props.dispatch(masterActions.changePlayingState({ playing: false }));
  }
}

const mapStateToProps = (state, { playing, preset }) => ({ playing, preset });

export default connect(mapStateToProps)(Master);
