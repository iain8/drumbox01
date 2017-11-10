import combineReducers from '../../../app/state/combine-reducers';

test('combine reducers', () => {
  const state = {};
  const action = { type: 'TEST' };
  const firstReducer = (state, action) => state;
  const secondReducer = (state, action) => ({ changed: true });

  const reducer = combineReducers(firstReducer, secondReducer);

  expect(reducer).toBeInstanceOf(Function);

  const reduced = reducer(state, action);

  expect(reduced).toEqual({ changed: true });
});