const hasData = (item) => {
  if (item === '' || item === null || item === undefined) return false;

  return true;
};

export default hasData;
