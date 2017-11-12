const waves = ['sine', 'sqr', 'saw', 'tri'];

const changeWave = (current: string, direction: string): string => {
  const currentIndex = waves.indexOf(current);
  let newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;

  if (newIndex === -1) {
    newIndex = waves.length - 1;
  } else if (newIndex === waves.length) {
    newIndex = 0;
  }

  return waves[newIndex];
};

export default (state, action) => {
  switch (action.type) {
    case 'CHANGE_CHANNEL_PARAM':
      return {
        ...state,
        channels: {
          ...state.channels,
          [action.payload.index]: {
            ...state.channels[action.payload.index],
            [action.payload.param]: action.payload.value,
          },
        },
      };
    case 'CHANGE_WAVE':
      return {
        ...state,
        channels: {
          ...state.channels,
          [action.payload.index]: {
            ...state.channels[action.payload.index],
            wave: changeWave(
              action.payload.wave,
              action.payload.direction,
            ),
          },
        },
      };
    default:
      return state;
  }
};
