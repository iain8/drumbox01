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

const unserializeChannel = (channel) => {
  return {
    ...channel,
    options: JSON.parse(channel.options),
  };
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
        channels: preset.channels.map((channel) => unserializeChannel(channel)),
        loading: false,
        preset: {
          division: preset.division,
          masterVolume: preset.master_volume,
          sequenceLength: preset.sequence_length,
          tempo: preset.tempo,
        },
        sequences: preset.sequences,
      };
    default:
      return state;
  }
};
