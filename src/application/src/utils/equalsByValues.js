const equalsByValues = function(comparator, left, right) {
  if (left === right) {
    return true;
  }

  if (left === null || typeof left !== 'object' || right === null || typeof right !== 'object') {
    return false;
  }

  const leftKeys = Object.keys(left);
  const rightKeys = Object.keys(right);

  if (leftKeys.length !== rightKeys.length) {
    return false;
  }

  for (const key of rightKeys) {
    if (!comparator(left[key], right[key])) {
      return false;
    }
  }

  return true;
};

export default equalsByValues;
