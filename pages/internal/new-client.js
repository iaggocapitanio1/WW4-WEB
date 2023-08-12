import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../components/loader/loader';
import NewClientScreen from '../../components/pages/newClient/newClient';
import routes from '../../navigation/routes';

//  Actions
import * as OrganizationsActionsRedux from '../../store/actions/organization';
import AuthData from '../../lib/AuthData';

const NewOrder = ({ ...pageProps }) => {
  const [loaded, setLoaded] = useState(false);
  // const [profiles, setProfiles] = useState();
  const profiles = [];
  const dispatch = useDispatch();
  const reduxState = useSelector((state) => state);
  const getOrganizations = (data) => dispatch(OrganizationsActionsRedux.organizations(data));

  useEffect(() => {
    const getData = async () => {
      (!reduxState.auth.me || !reduxState.auth.userPermissions) && AuthData(dispatch);

      if (!reduxState.organizations.data) await getOrganizations();
    };

    Promise.all([getData()]).then(() => setLoaded(true));
  }, []);

  if (loaded) {
    const breadcrumbsPath = [
      {
        title: 'Clientes',
        href: `${routes.private.internal.clients}`,
      },
      {
        title: 'Novo Cliente',
        href: `${routes.private.internal.newClient}`,
      },
    ];

    const props = {
      breadcrumbsPath,
      pageProps,
      profiles,
      organizations: reduxState.organizations.data,
    };

    return <NewClientScreen {...props} />;
  }

  return <Loader center={true} />;
};

export default NewOrder;
