import { Component, h } from 'preact';
import { connect } from 'preact-redux';
import Division from './controls/division';
import Knob from './controls/knob';
import Speaker from './speaker';
import * as masterActions from '../state/actions/master';

interface IMasterProps {
  dispatch?: any,
  preset: any,
};

class Master extends Component<IMasterProps, any> {
  constructor() {
    super();

    this.state = { // TODO: put in a config or something
      divisions: {
        2: '1/4',
        4: '1/8',
        8: '1/16',
      },
      playing: false, // TODO: into state
    };

    this.handleDivisionChange = this.handleDivisionChange.bind(this);
    this.handleTempoChange = this.handleTempoChange.bind(this);
    this.handleVolumeChange = this.handleVolumeChange.bind(this);
  }

  public render(props) {
    const { division, masterVolume, tempo } = props.preset;

    return (
      <div class='master'>
        <input
          type='number'
          class='tempo'
          onChange={ this.handleTempoChange }
          value={ tempo } />
        <Division
          division={ division }
          divisions={ this.state.divisions }
          onChange={ this.handleDivisionChange } />
        <button
          class={ `sequencer-control start ${ this.state.playing ? 'active' : '' }` }
          onClick={ this.handleStartButton.bind(this) } />
        <button
          class={ `sequencer-control stop ${ this.state.playing ? '' : 'active' }` }
          onClick={ this.handleStopButton.bind(this) } />
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

  private handleDivisionChange(division: number) {
    this.props.dispatch(masterActions.changeDivision({ division }));
  }

  private handleStartButton(e: Event) {
    e.preventDefault();

    this.setState({ playing: true });
  }

  private handleStopButton(e: Event) {
    e.preventDefault();

    this.setState({ playing: false });
  }
}

const mapStateToProps = (state, { preset }) => ({ preset });

export default connect(mapStateToProps)(Master);
