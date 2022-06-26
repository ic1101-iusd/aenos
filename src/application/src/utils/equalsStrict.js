/**
 * Returns true if values are equal strict.
 * @param {any} left
 * @param {any} right
 * @returns {boolean}
 * @example
 *
 * equalsStrict(23, 23);
 *
 * // => true
 *
 * equalsStrict(23, '23');
 *
 * // => false
 *
 * -------------------------------------------
 *
 */

const equalsStrict = function(left, right) {
  return Object.is(left, right);
};

export default equalsStrict;
