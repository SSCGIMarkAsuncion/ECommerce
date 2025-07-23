import MError from "../error.js";
/***
 * @param {any} schema
 * @param {any | any[]} obj
 * @returns {MError | null}
 */
export function checkSchema(schema, obj) {
  if (Array.isArray(obj)) {
    for (const item of obj) {
      if (!hasKeys(schema, item)) {
        return new MError(400, "Wrong Schema");
      }
    }
  }
  else {
    if (!hasKeys(schema, obj)) {
      return new MError(400, "Wrong Schema");
    }
  }

  return null;
}

export function hasKeys(left, right) {
  const map = {};
  const rightKeys = Object.keys(right);
  const leftKeys = Object.keys(left);
  leftKeys.forEach((key) => {
    if (left[key] == undefined) {
      return;
    }
    map[key] = true;
  });

  // console.log(map, rightKeys);
  for (let i=0;i<rightKeys.length;i++) {
    const key = rightKeys[i];
    if (right[key] == undefined) {
      continue;
    }
    if (!map[key]) {
      return false;
    }
  }

  return true;
}