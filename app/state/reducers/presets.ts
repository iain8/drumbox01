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

interface IPresetState {
  beat: number;
  channels: object;
  error: object;
  loading: boolean;
  playing: boolean;
  preset: object;
  sequences: object[];
}

/**
 * Unserialize channel and flatten it
 * @param channel
 */
const parseChannels = (channels) => {
  const parsed = {};

  channels.forEach((channel) => {
    parsed[channel.name] = {
      ...channel,
      ...JSON.parse(channel.options),
    };

    delete parsed[channel.name].options;
  });

  return parsed;
};

export default (state = DEFAULT_STATE, action: any): IPresetState => {
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
        channels: parseChannels(preset.channels),
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
