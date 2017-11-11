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
  const channels = [...state.channels];
  const { index } = action.payload || 0;

  switch (action.type) {
    case 'CHANGE_CHANNEL_PARAM':
      channels[index].options[action.payload.param] = action.payload.value;

      return {
        ...state,
        channels,
      };
    case 'CHANGE_WAVE':
      channels[index].options.wave = changeWave(
        action.payload.wave,
        action.payload.direction,
      );

      return {
        ...state,
        channels,
      };
    default:
      return state;
  }
};
