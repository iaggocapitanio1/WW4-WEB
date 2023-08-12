//  Nodes
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

//  PreLoader
import Loader from '../../../components/loader/loader';

//  Page Component
import EditClientScreen from '../../../components/pages/editClient/editClient';

//  Navigation
import routes from '../../../navigation/routes';

//  Services
import * as clientsActionsRedux from '../../../store/actions/client';

const EditClient = ({ ...pageProps }) => {
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const reduxState = useSelector((state) => state);
  const getClient = (data) => dispatch(clientsActionsRedux.client(data));

  useEffect(() => {
    const getData = async () => {
      await getClient(router.query.Id);
    };

    Promise.all([getData()]).then(() => setLoaded(true));
  }, []);

  if (loaded) {
    const detailPage = routes.private.internal.client;

    const breadcrumbsPath = [
      {
        title: 'Clientes',
        href: `${routes.private.internal.clients}`,
      },
      {
        title: `${reduxState.clients.displayedClient?.user?.email}`,
        // title: `${reduxState.clients.displayedClient?.user?.first_name + ' ' + reduxState.clients.displayedClient?.user?.last_name}`,
        href: `${routes.private.internal.client}${reduxState.clients.displayedClient.id}`,
      },
      {
        title: 'Editar Cliente',
        href: `${routes.private.internal.clients}`,
      },
    ];

    const props = {
      client: { ...reduxState.clients.displayedClient },
      breadcrumbsPath,
      detailPage,
      pageProps,
    };

    return <EditClientScreen {...props} />;
  }

  return <Loader center={true} />;
};

export default EditClient;
