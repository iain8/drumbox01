import { Component, h } from 'preact';
import { connect } from 'preact-redux';
import Division from './controls/division';
import Knob from './controls/knob';
import Speaker from './speaker';
import * as masterActions from '../state/actions/master';

interface IMasterProps {
  dispatch?: any,
  playing: boolean,
  preset: any,
};

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
      <div class='master'>
        <input
          type='number'
          class='tempo'
          onChange={ this.handleTempoChange }
          value={ tempo } />
        <Division
          division={ division }
          divisions={ divisions }
          onChange={ this.handleDivisionChange } />
        <button
          class={ `sequencer-control start ${ props.playing ? 'active' : '' }` }
          onClick={ this.handleStartButton } />
        <button
          class={ `sequencer-control stop ${ props.playing ? '' : 'active' }` }
          onClick={ this.handleStopButton } />
        <Knob
          name='vol'
          onChange={ this.handleVolumeChange }
          value={ masterVolume } />

        <h2>drumbox<small>01</small></h2>

        <Speaker grilleCount={ 7 } />
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
