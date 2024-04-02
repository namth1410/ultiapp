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

export function normalizePronunciation(p) {
  let result = p;
  if (p.charAt(0) !== "/") {
    result = "/" + result;
  }

  if (p.charAt(p.length - 1) !== "/") {
    result = result + "/";
  }

  return result;
}


export function normalizePartsOfSpeech(p) {
  let result = p;
  if (p.charAt(0) !== "(") {
    result = "(" + result;
  }

  if (p.charAt(p.length - 1) !== ")") {
    result = result + ")";
  }

  return result;
}
