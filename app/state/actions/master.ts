import actionCreatorFactory from 'typescript-fsa';

const actionCreator = actionCreatorFactory();

export const changeTempo = actionCreator<{ tempo: number }>('CHANGE_TEMPO');
export const changeDivision = actionCreator<{ division: number }>('CHANGE_DIVISION');
export const changeMasterVolume = actionCreator<{ volume: number }>('CHANGE_MASTER_VOLUME');
