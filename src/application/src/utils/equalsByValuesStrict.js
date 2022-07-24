import equalsByValues from './equalsByValues';
import equalsStrict from './equalsStrict';

/**
 * Returns true if all values are same.
 * @param {any} left
 * @param {any} right
 * @returns {boolean}
 * @example
 *
 * const leftObj = { name: 123 };
 * const rightObj = { name: 123 };
 *
 * equalsByValuesStrict(leftObj, rightObj);
 *
 * // => true
 *
 * -------------------------------------------
 *
 */

const equalsByValuesStrict = function(left, right) {
  return equalsByValues(equalsStrict, left, right);
};

export default equalsByValuesStrict;
