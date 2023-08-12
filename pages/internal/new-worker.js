//  Nodes
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

//  Custom Components
import Loader from '../../components/loader/loader';

//  Page Component
import NewWorkerScreen from '../../components/pages/newWorker/newWorker';

//  Navigation
import routes from '../../navigation/routes';

//  Actions
import * as OrganizationsActionsRedux from '../../store/actions/organization';
import * as profilesActionsRedux from '../../store/actions/profile';

const NewOrder = () => {
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();
  const reduxState = useSelector((state) => state);
  const getOrganizations = (data) => dispatch(OrganizationsActionsRedux.organizations(data));
  const getProfiles = (data) => dispatch(profilesActionsRedux.profiles(data));

  useEffect(() => {
    const getData = async () => {
      !reduxState.organizations.data && await getOrganizations();
      await getProfiles(); //  All permissions groups
    };

    Promise.all([getData()]).then(() => setLoaded(true));
  }, []);

  if (loaded) {
    const breadcrumbsPath = [
      {
        title: 'Utilizadores',
        href: `${routes.private.internal.workers}`,
      },
      {
        title: 'Novo Utilizador',
        href: `${routes.private.internal.newWorker}`,
      },
    ];

    const props = {
      breadcrumbsPath,
      countries: [],
      organizations: reduxState.organizations.data,
      profiles: [...reduxState.profiles.data]?.sort((a, b) => (a.name > b.name) ? 1 : -1),
    };

    return <NewWorkerScreen {...props} />;
  }

  return <Loader center={true} />;
};

export default NewOrder;
