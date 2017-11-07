import { applyMiddleware, combineReducers, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import presetReducer from './reducers/presets';
import watchRequest from './sagas';

const configureStore = () => {
  const sagaMiddleware = createSagaMiddleware();

  return {
    ...createStore(
      presetReducer,
      applyMiddleware(sagaMiddleware)),
    run: sagaMiddleware.run(watchRequest),
  };
};

export default configureStore;
