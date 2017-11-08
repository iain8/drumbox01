import { Action } from 'redux';
import { getPresetFSA } from '../actions/preset';

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

const clearSequence = (sequences, sequenceLength, { seq }) : any => {
  return sequences.map((sequence, i) => {
    const newSeq = { ...sequence };

    if (i === seq) {
      newSeq.pattern = Array(sequenceLength).fill(0).join('');
    }

    return newSeq;
  });
};

const nextBeat = (current, sequenceLength) : number => {
  return current === sequenceLength - 1 ? 0 : current + 1;
};

export default (state = DEFAULT_STATE, action: any) : PresetState => {
  // console.log('reducer!', state, action);

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
          sequenceLength: preset.sequence_length,
          tempo: preset.tempo,
        },
        sequences: preset.sequences,
      };
    case 'CHANGE_TEMPO':
      return {
        ...state,
        preset: {
          ...state.preset,
          tempo: action.payload.tempo,
        },
      };
    case 'CHANGE_DIVISION':
      return {
        ...state,
        preset: {
          ...state.preset,
          division: action.payload.division,
        },
      };
    case 'CHANGE_MASTER_VOLUME':
      return {
        ...state,
        preset: {
          ...state.preset,
          masterVolume: action.payload.volume,
        }
      };
    case 'TOGGLE_BEAT':
      return {
        ...state,
        sequences: toggleBeat(state.sequences, action.payload),
      };
    case 'CLEAR_SEQUENCE':
      return {
        ...state,
        sequences: clearSequence(state.sequences, state.preset.sequenceLength, action.payload),
      };
    case 'CHANGE_PLAYING_STATE':
      return {
        ...state,
        playing: action.payload.playing,
      };
    case 'NEXT_BEAT':
      return {
        ...state,
        beat: nextBeat(state.beat, state.preset.sequenceLength),
      };
    default:
      return state;
  }
};
