const waves = ['sine', 'sqr', 'saw', 'tri'];

const changeWave = (current, direction: string) => {
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
    case 'CHANGE_WAVE':
      const channels = [...state.channels];

      channels[action.payload.index].options.wave = changeWave(
        action.payload.wave,
        action.payload.direction,
      );

      return {
        ...state,
        channels: channels,
      };
    default:
      return state;
  }
};
