import { transform, isEqual, isObject } from "lodash";

export const compare = (current, incomming) => {
  const diff = difference(current, incomming);

  return diff;
};

/**
 * Deep diff between two object, using lodash
 * @param  {Object} object Object compared
 * @param  {Object} base   Object to compare with
 * @return {Object}        Return a new object who represent the diff
 */
// https://gist.github.com/Yimiprod/7ee176597fef230d1451
function difference(object, base) {
  function changes(object, base) {
    return transform(object, function (result, value, key) {
      if (!isEqual(value, base[key])) {
        result[key] =
          isObject(value) && isObject(base[key])
            ? changes(value, base[key])
            : value;
      }
    });
  }
  return changes(object, base);
}
