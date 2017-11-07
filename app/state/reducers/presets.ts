import { Action } from 'redux';
import { getPresetFSA } from '../actions/preset';

const DEFAULT_STATE = {
  channels: [],
  error: null,
  loading: false,
  preset: null,
  sequences: [],
};

interface PresetState {
  channels: Array<Object>,
  error: object,
  loading: boolean,
  preset: Object,
  sequences: Array<Object>,
}

const toggleBeat = (sequences, { beat, seq }) : any => {
  return sequences.map((sequence, i) => {
    const newSeq = { ...sequence };

    if (i === seq) {
      const pattern = newSeq.pattern.split('');

      pattern[beat] = pattern[beat] === '0' ? '1' : '0';

      newSeq.pattern = pattern.join('');
    }

    return newSeq;
  });
};

export default (state = DEFAULT_STATE, action: any) : PresetState => {
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
      const { preset } = action.payload.result;

      return {
        ...state,
        channels: preset.channels,
        loading: false,
        preset: {
          division: preset.division,
          masterVolume: preset.master_volume,
          tempo: preset.tempo,
        },
        sequences: preset.sequences,
      };
    case 'TOGGLE_BEAT':
      return {
        ...state,
        sequences: toggleBeat(state.sequences, action.payload),
      };
    default:
      return state;
  }
};
