import actionCreatorFactory from 'typescript-fsa';
import { PresetRequest } from '../action-types';

const actionCreator = actionCreatorFactory();

export const getPreset = (payload) => ({
  payload,
  type: 'GET_PRESET',
});

export const getPresetFSA = actionCreator.async<{
  id: number,
}, {
  preset: any,
}>('GET_PRESET');
