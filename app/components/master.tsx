import { Component, h } from 'preact';
import Knob from './controls/knob';
import Speaker from './speaker';

export default class Sequencer extends Component<any, any> {
  constructor() {
    super();

    this.state = {
      masterVolume: 100,
    };
  }

  public render() {
    return (
      <div id='master'>
        <input type='number' id='tempo' value='120' />
        <select id='division'>
            <option value='2'>1/4</option>
            <option value='4' selected>1/8</option>
            <option value='8'>1/16</option>
        </select>
        <button id='start' class='sequencer-control'></button>
        <button id='stop' class='sequencer-control active'></button>
        <div id='master-controls'>
          <Knob
            dataName='master'
            id='master-volume'
            onChange={ this.handleVolumeChange.bind(this) }
            value={ this.state.masterVolume } />
        </div>

        <h2>drumbox<small>01</small></h2>

        <Speaker grilleCount={ 7 } />
      </div>
    );
  }

  private handleVolumeChange(value: number) {
    this.setState({ masterVolume: value });
  }
}
