function MultiFilterArray (array, filters) {
  const filterKeys = Object.keys(filters);

  return array.filter((item) => {
    const isMatch = filterKeys.every((key) => {
      const filterValue = filters[key];

      if (Array.isArray(filterValue)) {
        return filterValue.some((value) =>
          String(item[key]).toLowerCase()?.includes(String(value)?.toLowerCase())
        );
      }

      if (typeof filterValue === 'boolean') {
        return item[key] === filterValue;
      }

      return String(item[key]).toLowerCase()?.includes(filterValue?.toLowerCase());
    });

    return isMatch;
  });
}

export { MultiFilterArray };
