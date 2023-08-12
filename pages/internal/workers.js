//  Nodes
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

//  Custom Components
import Loader from '../../components/loader/loader';
import WorkersScreen from '../../components/pages/workers/workers';

//  Navigation
import routes from '../../navigation/routes';
import * as profilesActionsRedux from '../../store/actions/profile';
import * as workersActionsRedux from '../../store/actions/worker';

//  Proptypes

const Workers = () => {
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();
  const reduxState = useSelector((state) => state);
  const getWorkers = (data) => dispatch(workersActionsRedux.workers(data));
  const getProfiles = (data) => dispatch(profilesActionsRedux.profiles(data));

  useEffect(() => {
    const getData = async () => {
      await getWorkers();
      await getProfiles();
    };

    Promise.all([getData()]).then(() => setLoaded(true));
  }, []);

  if (loaded && reduxState.workers.data) {
    const breadcrumbsPath = [
      {
        title: 'Utilizadores',
        href: `${routes.private.users}`,
      },
    ];

    const headCellsWorkers = [
      {
        id: 'Email',
        numeric: false,
        label: 'Email',
        show: true
      },
      {
        id: 'Nome',
        numeric: false,
        label: 'Nome',
        show: true
      },
      {
        id: 'Profile',
        numeric: false,
        label: 'Perfil',
        show: true
      },
      {
        id: 'actions',
        numeric: true,
        disablePadding: false,
        label: 'Ações',
        show: true
      },
    ];

    const editRoute = routes.private.internal.editWorker;
    const detailRoute = routes.private.internal.worker;
    const newRoute = routes.private.internal.newWorker;

    const props = {
      breadcrumbsPath,
      editRoute,
      detailRoute,
      newRoute,
      workers: reduxState.workers?.data.map((worker) => {
        const worker2 = { ...worker };

        worker2.Nome = worker.user.first_name + ' ' + worker.user.last_name;
        worker2.NomeDropdown = worker.user.first_name + ' ' + worker.user.last_name + ' - ' + worker.user.email;
        worker2.Email = worker.user.email;
        worker2.Perfil = worker.user.orion_groups[0]?.name;
        worker2.Profile = worker.user.orion_groups[0]?.name;
        worker2.ProfileId = worker.user.orion_groups[0]?.id;

        return worker2;
      }),
      headCellsWorkers,
      profiles: [...reduxState.profiles.data]?.sort((a, b) => (a.name > b.name) ? 1 : -1),

    };

    return <WorkersScreen {...props} />;
  }

  return <Loader center={true} />;
};

export default Workers;
