function ConvertString (str) {
  const decoded = str?.replace(/\\u([\d\w]{4})/gi, (match, grp) => String.fromCharCode(parseInt(grp, 16)));

  return decoded;
}

export default ConvertString;
