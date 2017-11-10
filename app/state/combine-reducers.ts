export default function combineReducers(...reducers) {
  return (state, action) => {
    let newState = state;

    reducers.forEach((reducer) => {
      newState = reducer(newState, action);
    });

    return newState;
  }
};
