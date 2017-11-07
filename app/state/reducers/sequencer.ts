import { Action } from 'redux';
import { toggleBeat } from '../actions/sequencer';

const DEFAULT_STATE = {
  error: null,
  loading: false,
  preset: null,
};

export default (state = DEFAULT_STATE, action) => {
  console.log('reducer', state, action);

  switch (action.type) {
    case 'TOGGLE_BEAT':
      return {
        ...state,
      };
    default:
      return state;
  }
};
