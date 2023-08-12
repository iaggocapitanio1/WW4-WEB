//  Nodes
import React, { useEffect, useState } from 'react';

//  Custom Components
import Loader from '../../components/loader/loader';
import ClientsScreen from '../../components/pages/clients/clients';

//  Navigation
import routes from '../../navigation/routes';

//  Proptypes
import PropTypes from 'prop-types';

//  Utils

//  Services
// import countryService from '../../services/countries/country-service';
import { useDispatch, useSelector } from 'react-redux';
import * as clientsActionsRedux from '../../store/actions/client';

const Clients = ({ ...pageProps }) => {
  const [loaded, setLoaded] = useState(false);
  // const [profiles, setProfiles] = useState();
  const profiles = [];
  const dispatch = useDispatch();
  const reduxState = useSelector((state) => state);
  const getClients = (data) => dispatch(clientsActionsRedux.clients(data));

  // const profiles = []
  useEffect(() => {
    const getData = async () => {
      await getClients();
    };

    Promise.all([getData()]).then(() => setLoaded(true));
  }, []);

  if (loaded) {
    const headCells = [
      {
        id: 'Email',
        numeric: false,
        label: 'Email',
        show: true,
      },
      {
        id: 'Nome',
        numeric: false,
        label: 'Nome',
        show: true,
      },
      {
        id: 'actions',
        numeric: true,
        label: 'Ações',
        show: true,
      },
    ];

    const editRoute = routes.private.internal.editClient;
    const detailRoute = routes.private.internal.client;
    const newRoute = routes.private.internal.newClient;

    const breadcrumbsPath = [
      {
        title: 'Clientes',
        href: `${routes.private.internal.clients}`,
      },
    ];

    const props = {
      items: [...reduxState.clients?.data ?? []].map(client => {
        const client2 = { ...client };

        client2.NomeDropdown = client.user.first_name + ' ' + client.user.last_name + ' - ' + client.user.email;
        client2.Nome = client.user.first_name + ' ' + client.user.last_name;
        client2.Email = client.user.email;

        return client2;
      }),
      breadcrumbsPath,
      profiles,
      editRoute,
      detailRoute,
      headCells,
      newRoute,
      pageProps
    };

    return <ClientsScreen {...props} />;
  }

  return <Loader center={true} />;
};

Clients.propTypes = {
  items: PropTypes.array,
  headCells: PropTypes.array,
  breadcrumbsPath: PropTypes.array,
  users: PropTypes.array,
  profiles: PropTypes.array,
  editRoute: PropTypes.string,
  detailRoute: PropTypes.string,
  newRoute: PropTypes.string,
};

export default Clients;
