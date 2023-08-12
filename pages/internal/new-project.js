import React, { useEffect, useState } from 'react';
import Loader from '../../components/loader/loader';
import NewOrderScreen from '../../components/pages/newOrder/newProject';
import routes from '../../navigation/routes';

import { useDispatch, useSelector } from 'react-redux';
import AuthData from '../../lib/AuthData';
import * as budgetsActionsRedux from '../../store/actions/budget';
import * as clientsActionsRedux from '../../store/actions/client';

export const categories = [
  { label: 'Cozinha', id: 'MC_' },
  { label: 'Quarto', id: 'MQ_' },
  { label: 'Banheiro', id: 'MB_' },
  { label: 'Garagem', id: 'MG_' },
  { label: 'Varanda', id: 'MV_' },
  { label: 'Sala de estar', id: 'MS_' }
];

const NewOrder = ({ ...pageProps }) => {
  const dispatch = useDispatch();
  const reduxState = useSelector((state) => state);
  const [loaded, setLoaded] = useState(false);
  const getBudgets = (data) => dispatch(budgetsActionsRedux.budgets(data));
  const getClients = (data) => dispatch(clientsActionsRedux.clients(data));

  useEffect(() => {
    const getData = async () => {
      (!reduxState.auth.me || !reduxState.auth.userPermissions) && AuthData(dispatch);

      if (!reduxState.budgets.data) await getBudgets();

      if (!reduxState.clients.data) await getClients();
    };

    Promise.all([getData()]).then(() => setLoaded(true));
  }, []);

  if (loaded) {
    const breadcrumbsPath = [
      {
        title: 'Projetos',
        href: `${routes.private.internal.projects}`,
      },
      {
        title: 'Novo projeto',
        href: `${routes.private.internal.newProject}`,
      },
    ];

    const props = {
      pageProps,
      breadcrumbsPath,
      budgets: reduxState.budgets.data,
      clients: [...reduxState.clients?.data ?? []].map((client) => {
        return {
          ...client,
          Nome: client.user.first_name + ' ' + client.user.last_name + ' - ' + client.user.email,
          Email: client.user.email,
        };
      }),
      categories,
      countries: [...reduxState.countries.data]
    };

    return <NewOrderScreen {...props} />;
  }

  return <Loader center={true} />;
};

export default NewOrder;
