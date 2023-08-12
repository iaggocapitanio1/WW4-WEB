/**
 * Builds the API URL for a given endpoint.
 *
 * @param {string} endpoint The endpoint to build the URL for.
 * @returns {string} The complete API URL.
 */
export function buildURL (endpoint) {
  const trimmedEndpoint = endpoint.replace(/^\//, '');
  const endpointSuffix = endpoint.charAt(endpoint.length - 1);
  const isEndpointSlash = endpointSuffix === '/';
  const isEndpointPeriod = endpointSuffix === '.';

  return `${process.env.NEXT_PUBLIC_FRONT_API_URL}/${isEndpointSlash ? trimmedEndpoint : isEndpointPeriod ? endpoint.replace('.', '') : `${trimmedEndpoint}/`}`;
}

/**
 * Returns the complete API URL for a given endpoint.
 *
 * @param {string} endpoint The endpoint to get the API URL for.
 * @returns {string} The complete API URL.
 */
export function getApiURL (endpoint) {
  const trimmedEndpoint = endpoint.replace(/^\//, '');
  const apiPrefix = endpoint === 'auth/token' ? '' : 'api/v1/';

  return `${apiPrefix}${trimmedEndpoint}`;
}
