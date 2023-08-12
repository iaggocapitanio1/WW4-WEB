function ItsNumber (x) {
  // check if the passed value is a number
  if (typeof x === 'number' && !isNaN(x)) {
    // check if it is integer
    if (Number.isInteger(x)) {
      return true;
    }

    return true;
  }

  return false;
}

export default ItsNumber;
