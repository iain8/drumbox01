import { Component, h } from 'preact';
import Division from './controls/division';
import Knob from './controls/knob';
import Speaker from './speaker';

export default class Sequencer extends Component<any, any> {
  constructor() {
    super();

    this.state = {
      division: 4,
      divisions: {
        2: '1/4',
        4: '1/8',
        8: '1/16',
      },
      masterVolume: 100,
      playing: false,
      tempo: 120,
    };
  }

  public render() {
    return (
      <div class='master'>
        <input 
          type='number' 
          class='tempo' 
          value={ this.state.tempo } />
        <Division
          division={ this.state.division }
          divisions={ this.state.divisions }
          onChange={ this.handleDivisionChange.bind(this) } />
        <button
          class={ `sequencer-control start ${ this.state.playing ? 'active' : '' }` }
          onClick={ this.handleStartButton.bind(this) } />
        <button
          class={ `sequencer-control stop ${ this.state.playing ? '' : 'active' }` }
          onClick={ this.handleStopButton.bind(this) } />
        <Knob
          onChange={ this.handleVolumeChange.bind(this) }
          value={ this.state.masterVolume } />

        <h2>drumbox<small>01</small></h2>

        <Speaker grilleCount={ 7 } />
      </div>
    );
  }

  private handleVolumeChange(value: number) {
    this.setState({ masterVolume: value });
  }

  private handleDivisionChange(value: number) {
    this.setState({ division: value });
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
