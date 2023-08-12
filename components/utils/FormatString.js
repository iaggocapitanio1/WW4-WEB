function formatString (str) {
  // Replace all spaces with underscores
  str = str.replace(/ /g, '_');
  // Replace accented characters
  str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  // Replace all non-alphanumeric characters except for underscores
  str = str.replace(/[^a-zA-Z0-9_]/g, '');

  return str;
}

export default formatString;
