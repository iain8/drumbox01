import { Action } from 'redux';

const divisions = ['1/4', '1/8', '1/16'];

// TODO: generalise with waves selector
const changeDivision = (current: string, direction: string): string => {
  const currentIndex = divisions.indexOf(current);
  let newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;

  if (newIndex === -1) {
    newIndex = divisions.length - 1;
  } else if (newIndex === divisions.length) {
    newIndex = 0;
  }

  return divisions[newIndex];
};

export default (state, action) => {
  switch (action.type) {
    case 'CHANGE_DIVISION':
      return {
        ...state,
        preset: {
          ...state.preset,
          division: changeDivision(state.preset.division, action.payload.direction),
        },
      };
    case 'CHANGE_MASTER_VOLUME':
      return {
        ...state,
        preset: {
          ...state.preset,
          masterVolume: action.payload.volume,
        },
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
