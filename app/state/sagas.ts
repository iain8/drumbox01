import { SagaIterator, takeLatest } from 'redux-saga';
import { call, cancel, fork, put, take } from 'redux-saga/effects';
import { bindAsyncAction } from 'typescript-fsa-redux-saga';
import { getPresetFSA } from './actions/preset';
import getById from './services/preset';

const getPreset = bindAsyncAction(getPresetFSA) (
  function*(params): SagaIterator {
    const preset = yield call(getById, params.id);

    return { preset };
  },
);

function* mySaga(action: any): SagaIterator { // TODO action type
  yield call(getPreset, { id: action.payload });
}

export default function* watchRequest() {
  yield takeLatest(getPresetFSA.type, mySaga);
}
