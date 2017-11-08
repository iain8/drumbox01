import actionCreatorFactory from 'typescript-fsa';

const actionCreator = actionCreatorFactory();

export const toggleBeat = actionCreator<{ seq: number, beat: number }>('TOGGLE_BEAT');
export const clearSequence = actionCreator<{ seq: number }>('CLEAR_SEQUENCE');
export const nextBeat = actionCreator<{}>('NEXT_BEAT');
