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