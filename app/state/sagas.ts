import { SagaIterator, takeLatest } from 'redux-saga';
import { call, cancel, fork, put, take } from 'redux-saga/effects';
import { bindAsyncAction } from 'typescript-fsa-redux-saga';
import getById from './services/preset';
import {getPresetFSA} from './actions/preset';

const getPreset = bindAsyncAction(getPresetFSA) (
  function* (params): SagaIterator {
    const preset = yield call(getById, params.id);

    return { preset };
  },       
);

function* mySaga(action: any): SagaIterator { // TODO action type
  yield call(getPreset, { id: action.payload }); // how to get id here
}

export default function* watchRequest() {
  console.log('1');
  yield takeLatest(getPresetFSA.type, mySaga);
}
