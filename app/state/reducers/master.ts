import { Action } from 'redux';

export default (state, action) => {
  switch (action.type) {
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
    case 'CHANGE_PLAYING_STATE':
      return {
        ...state,
        playing: action.payload.playing,
      };
    case 'CHANGE_TEMPO':
      return {
        ...state,
        preset: {
          ...state.preset,
          tempo: action.payload.tempo,
        },
      };
    default:
      return state;
  }
};
