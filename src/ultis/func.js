export function compareArrays(array1, array2) {
  if (array1.length !== array2.length) {
    return false;
  }

  for (let i = 0; i < array1.length; i++) {
    if (JSON.stringify(array1[i]) !== JSON.stringify(array2[i])) {
      return false;
    }
  }

  return true;
}
