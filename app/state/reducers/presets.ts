import { Action } from 'redux';
import { getPresetFSA } from '../actions/preset';

const DEFAULT_STATE = {
  error: null,
  loading: false,
  preset: null,
};

interface PresetState {
  error: object,
  loading: boolean,
  preset: object,
}

export default (state : PresetState, action: any) : PresetState => {
  console.log(action);
  switch (action.type) {
    case 'GET_PRESET_FAILED':
      return {
        ...state,
        error: state.error,
        loading: false,
      };
    case 'GET_PRESET_STARTED':
      return {
        ...state,
        loading: true,
      };
    case 'GET_PRESET_DONE':
      return {
        ...state,
        loading: false,
        preset: action.payload.result.preset,
      };
    default:
      return DEFAULT_STATE;
  }
};
