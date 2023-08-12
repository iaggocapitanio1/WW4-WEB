//  Nodes
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
//  Custom Components
import Loader from '../../../components/loader/loader';

//  Page Component
import EditWorkerScreen from '../../../components/pages/editWorker/editWorker';

//  Navigation
import routes from '../../../navigation/routes';

//  Services
import * as OrganizationsActionsRedux from '../../../store/actions/organization';
import * as profilesActionsRedux from '../../../store/actions/profile';
import * as workersActionsRedux from '../../../store/actions/worker';

const EditWorker = ({ ...pageProps }) => {
  const [loaded, setLoaded] = useState(false);
  const countries = [];
  const router = useRouter();
  const dispatch = useDispatch();
  const reduxState = useSelector((state) => state);
  const getWorker = (data) => dispatch(workersActionsRedux.worker(data));
  const getOrganizations = (data) => dispatch(OrganizationsActionsRedux.organizations(data));
  const getProfiles = (data) => dispatch(profilesActionsRedux.profiles(data));

  useEffect(() => {
    const getData = async () => {
      !reduxState.organizations.data && await getOrganizations();
      await getWorker(router.query.Id);
      await getProfiles(); //  All permissions groups
    };

    Promise.all([getData()]).then(() => setLoaded(true));
  }, []);

  if (loaded && reduxState.workers.displayedWorker) {
    const breadcrumbsPath = [
      {
        title: 'Utilizadores',
        href: `${routes.private.internal.workers}`,
      },
      {
        title: reduxState.workers.displayedWorker.user.email,
        // title: `${reduxState.workers.displayedWorker.user.first_name + ' ' + reduxState.workers.displayedWorker.user.last_name}`,
        href: `${routes.private.internal.worker}${reduxState.workers.displayedWorker.id}`,
      },
      {
        title: 'Editar utilizador',
        href: `${routes.private.internal.editWorker}`,
      },
    ];

    const props = {
      breadcrumbsPath,
      user: reduxState.workers.displayedWorker,
      pageProps,
      countries,
      organizations: reduxState.organizations.data,
      profiles: [...reduxState.profiles.data]?.sort((a, b) => (a.name > b.name) ? 1 : -1),
    };

    return <EditWorkerScreen {...props} />;
  }

  return <Loader center={true} />;
};

export default EditWorker;
