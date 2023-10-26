import { transform, isEqual, isObject } from "lodash";

function compare(
  oldSkills: Record<string, any>,
  newSkills: Record<string, any>
): Record<string, any> {
  const diff = difference(newSkills, oldSkills);
  return diff;
}

/**
 * Deep diff between two object, using lodash
 * @param  {Object} object Object compared
 * @param  {Object} base   Object to compare with
 * @return {Object}        Return a new object who represent the diff
 */
// https://gist.github.com/Yimiprod/7ee176597fef230d1451
function difference(
  object: Record<string, any>,
  base: Record<string, any>
): Record<string, any> {
  function changes(
    object: Record<string, any>,
    base: Record<string, any>
  ): Record<string, any> {
    return transform(
      object,
      function (result: Record<string, any>, value: any, key: string) {
        if (!isEqual(value, base[key])) {
          result[key] =
            isObject(value) && isObject(base[key])
              ? changes(value, base[key])
              : value;
        }
      },
      {}
    );
  }
  return changes(object, base);
}

export default compare;
