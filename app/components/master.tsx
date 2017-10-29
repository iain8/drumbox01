import { Component, h } from 'preact';
import Speaker from './speaker';

export default class Sequencer extends Component<any, any> {
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
            <input type='text' id='master-volume' class='knob' value='100' data-name='master' />
        </div>

        <h2>drumbox<small>01</small></h2>

        <Speaker grilleCount={ 7 } />
      </div>
    );
  }
}
