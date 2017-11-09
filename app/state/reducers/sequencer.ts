import { Action } from 'redux';
import { toggleBeat } from '../actions/sequencer';

const DEFAULT_STATE = {
  beat: 0,
  channels: [],
  error: null,
  loading: false,
  playing: false,
  preset: null,
  sequences: [],
};

interface PresetState {
  beat: number,
  channels: Array<Object>,
  error: object,
  loading: boolean,
  playing: boolean,
  preset: Object,
  sequences: Array<Object>,
}

export default (state = DEFAULT_STATE, action) : PresetState => {
  switch (action.type) {
    case 'TOGGLE_BEAT':
      return {
        ...state,
      };
    default:
      return state;
  }
};
