const IsInternal = (profileName) => {
  if (profileName !== 'CUSTOMER') return true;

  return false;
};

export default IsInternal;
