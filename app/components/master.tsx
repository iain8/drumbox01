import { Component, h } from 'preact';
import { connect } from 'preact-redux';
import * as masterActions from '../state/actions/master';
import Division from './controls/division';
import Knob from './controls/knob';
import Speaker from './speaker';

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
    const divisions = { // TODO: move me
      2: '1/4',
      4: '1/8',
      8: '1/16',
    };

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
          <div>
            <input
              type='number'
              className='tempo'
              onChange={ this.handleTempoChange }
              value={ tempo } />
          </div>
          <div>
            <Division
              division={ division }
              divisions={ divisions }
              onChange={ this.handleDivisionChange } />
          </div>
          <div>
            <Knob
              name='master'
              onChange={ this.handleVolumeChange }
              value={ masterVolume } />
          </div>
        </div>
        {/* <Speaker grilleCount={ 7 } /> */}
      </div>
    );
  }

  private handleTempoChange(event: any) { // TODO: event type
    event.preventDefault();

    this.props.dispatch(masterActions.changeTempo({ tempo: event.target.value }));
  }

  private handleVolumeChange(volume: number) {
    this.props.dispatch(masterActions.changeMasterVolume({ volume }));
  }

  private handleDivisionChange(event: any) {
    this.props.dispatch(masterActions.changeDivision({ division: event.target.value }));
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
