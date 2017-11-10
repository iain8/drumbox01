import actionCreatorFactory from 'typescript-fsa';

const actionCreator = actionCreatorFactory();

export const changeOscParam = actionCreator<{
  index: number,
  param: string,
  value: number,
}>('CHANGE_OSC_PARAM');

export const changeWave = actionCreator<{
  direction: string,
  index: number,
  wave: string,
}>('CHANGE_WAVE');
