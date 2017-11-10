import actionCreatorFactory from 'typescript-fsa';

const actionCreator = actionCreatorFactory();

export const changeWave = actionCreator<{
  direction: string,
  index: number,
  wave: string,
}>('CHANGE_WAVE');
