
import useDerivedState from '../useDerivedState';

const usePrevious = (value) => {
  const [state] = useDerivedState((prevState) => {
    return {
      prev: prevState?.current,
      current: value,
    };
  }, [value]);

  return state.prev;
};

export default usePrevious;
