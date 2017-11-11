import { Action } from 'redux';

const toggleBeat = (sequences, { beat, seq }): any => {
  return sequences.map((sequence, i) => {
    const newSeq = { ...sequence };

    if (i === seq) {
      const pattern = newSeq.pattern.split('');

      pattern[beat] = pattern[beat] === '0' ? '1' : '0';

      newSeq.pattern = pattern.join('');
    }

    return newSeq;
  });
};

const clearSequence = (sequences, sequenceLength, { seq }): any => {
  return sequences.map((sequence, i) => {
    const newSeq = { ...sequence };

    if (i === seq) {
      newSeq.pattern = Array(sequenceLength).fill(0).join('');
    }

    return newSeq;
  });
};

const nextBeat = (current, sequenceLength): number => {
  return current === sequenceLength - 1 ? 0 : current + 1;
};

export default (state, action) => {
  switch (action.type) {
    case 'CLEAR_SEQUENCE':
      return {
        ...state,
        sequences: clearSequence(state.sequences, state.preset.sequenceLength, action.payload),
      };
    case 'NEXT_BEAT':
      return {
        ...state,
        beat: nextBeat(state.beat, state.preset.sequenceLength),
      };
    case 'TOGGLE_BEAT':
      return {
        ...state,
        sequences: toggleBeat(state.sequences, action.payload),
      };
    default:
      return state;
  }
};
