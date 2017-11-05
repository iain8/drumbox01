import { Action } from 'redux';
import { getPresetFSA } from '../actions/preset';

const DEFAULT_STATE = {
  loading: false,
  preset: null,
};

interface PresetState {
  error: object,
  loading: boolean,
  preset: object,
}

export default (state : PresetState, action: Action) : PresetState => {
  switch (action.type) {
    case getPresetFSA.failed:
      return {
        ...state,
        error: state.error,
        loading: false,
      };
    case getPresetFSA.started:
      return {
        ...state,
        loading: true,
      };
    case getPresetFSA.done:
      return {
        ...state,
        loading: false,
        preset: state.preset,
      };
    default:
      return state;
  }
};
