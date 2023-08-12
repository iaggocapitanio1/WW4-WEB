function GenerateQueryFilters (data, operator = '==') {
  let queryString = '';
  const filters = Array.isArray(data) ? data : Object.entries(data).map(([key, value]) => ({ key, value }));

  for (let i = 0; i < filters.length; i++) {
    const { key, value, operator: filterOperator = operator } = filters[i];

    queryString += `${key}${filterOperator || '=='}${typeof value === 'boolean' ? value : `"${value}"`}`;

    if (i < filters.length - 1) {
      queryString += ';';
    }
  }

  return queryString;
}

export default GenerateQueryFilters;
