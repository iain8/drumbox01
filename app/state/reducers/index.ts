import { Action } from 'redux';
import combineReducers from '../combine-reducers';
import channelReducer from './channel';
import masterReducer from './master';
import presetReducer from './presets';
import sequencerReducer from './sequencer';
import { getPresetFSA } from '../actions/preset';

const rootReducer = combineReducers(
  channelReducer,
  masterReducer,
  presetReducer,
  sequencerReducer
);

const DEFAULT_STATE = {
  beat: 0,
  channels: [],
  error: null,
  loading: false,
  playing: false,
  preset: null,
  sequences: [],
};

interface PresetState {
  beat: number,
  channels: Array<Object>,
  error: object,
  loading: boolean,
  playing: boolean,
  preset: Object,
  sequences: Array<Object>,
}

export default (state = DEFAULT_STATE, action: any) : PresetState => {
    return <PresetState> rootReducer(state, action);
};
