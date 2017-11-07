import actionCreatorFactory from 'typescript-fsa';

const actionCreator = actionCreatorFactory();

export const toggleBeat = actionCreator<{ seq: number, beat: number }>('TOGGLE_BEAT');
