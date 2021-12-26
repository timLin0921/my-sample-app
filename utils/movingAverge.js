/**
 *
 * @param {Array} arr
 * @param {Number} range
 * @param {Function} format
 * @return {Array}
 * @example
 * const arr = Array(100)
 *  .fill(1)
 *  .map((el, index) => index + 1);
 *
 *  const res = sma(arr, 7);
 */
function sma(arr, range, format) {
  if (!Array.isArray(arr)) {
    throw new TypeError('expected first argument to be an array');
  }

  const fn = typeof format === 'function' ? format : (n) => n;

  if (range > arr.length) {
    return [fn(sum(arr) / range)];
  }

  return arr.reduce((cur, acc, index) => {
    if (index + range <= arr.length) {
      cur.push(fn(sum(arr.slice(index, index + range)) / range));
    }
    return cur;
  }, []);
}

/**
 *
 * @param {Array} arr
 * @return {Number} sum of array
 */
function sum(arr) {
  return arr.reduce((cur, acc) => cur + acc);
}

// example
// const a = Array(100)
//   .fill(1)
//   .map((el, index) => index + 1);
// console.log(a);
// const res = sma(a, 9);
// console.log(res);

module.exports = {sma};
