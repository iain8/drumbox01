import actionCreatorFactory from 'typescript-fsa';
import { PresetRequest } from '../action-types';

const actionCreator = actionCreatorFactory();

export const getPreset = (payload) => ({
  type: 'GET_PRESET',
  payload,
});

export const getPresetFSA = actionCreator.async<{
  id: number,
}, {
  preset: any 
}>('GET_PRESET');
