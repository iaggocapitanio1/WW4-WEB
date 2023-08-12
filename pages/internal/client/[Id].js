//  Nodes
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

//  Custom Components
import Loader from '../../../components/loader/loader';

//  Page Component
import ClientScreen from '../../../components/pages/client/client';

//  Navigation
import routes from '../../../navigation/routes';

//  Proptypes
import PropTypes from 'prop-types';

//  Services
import { useDispatch, useSelector } from 'react-redux';
import * as clientsActionsRedux from '../../../store/actions/client';

const EditClient = ({ ...pageProps }) => {
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const reduxState = useSelector((state) => state);
  const getClient = (data) => dispatch(clientsActionsRedux.client(data));
  const setDisplayedClient = (data) => dispatch(clientsActionsRedux.setDisplayedClient(data));

  useEffect(() => {
    const getData = async () => {
      await getClient(router.query.Id).then((res) => setDisplayedClient(res.data));
    };

    Promise.all([getData()]).then(() => setLoaded(true));
  }, []);

  if (loaded) {
    const editRoute = routes.private.internal.editClient;

    const breadcrumbsPath = [
      {
        title: 'Clientes',
        href: `${routes.private.internal.clients}`,
      },
      {
        title: reduxState.clients.displayedClient?.user?.email,
        // title: `${reduxState.clients.displayedClient?.user?.first_name + ' ' + reduxState.clients.displayedClient?.user?.last_name}`,
        href: `${routes.private.internal.clients}`,
      },
    ];

    const props = {
      client: JSON.parse(JSON.stringify({ ...reduxState.clients.displayedClient })),
      breadcrumbsPath,
      editRoute,
      pageProps
    };

    return <ClientScreen {...props} />;
  }

  return <Loader center={true} />;
};

EditClient.PropTypes = {
  client: PropTypes.object,
  breadcrumbsPath: PropTypes.array,
  editRoute: PropTypes.string,
  clients: PropTypes.array,
  pageProps: PropTypes.any
};

export default EditClient;
