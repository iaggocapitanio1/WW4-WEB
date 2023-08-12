import { CALL_API } from '../../pages/api/middlewares/api';

const createAction = ({ meta, request, types }) => {
  const { data, headers, method = 'GET', params = {}, url } = request;

  return {
    [CALL_API]: {
      meta,
      request: {
        data,
        headers,
        method,
        params,
        url,
      },
      types,
    },
  };
};

export default createAction;
