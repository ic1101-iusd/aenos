import { useState } from 'react';

import equalsByValuesStrict from 'Utils/equalsByValuesStrict';

/*
 * It works similar to useState, except instead of initial value (initializer function) it accepts reset function
 * and dependencies list. Every time dependencies changes it'll return newly generated state during same render phase.
 * See: https://reactjs.org/docs/react-component.html#static-getderivedstatefromprops
 */

const useDerivedState = (
  reset,
  resetDeps,
) => {
  const [
    prevResetDeps, setPrevResetDeps,
  ] = useState<DepsT>(resetDeps);

  const [
    prevState, setPrevState,
  ] = useState<StateT>(reset);

  let nextState = prevState;

  if (!equalsByValuesStrict(prevResetDeps, resetDeps)) {
    nextState = reset(prevState);
    setPrevResetDeps(resetDeps);
  }

  if (prevState !== nextState) {
    setPrevState(() => {
      return nextState;
    });
  }

  return [
    nextState, setPrevState,
  ];
};

export default useDerivedState;
