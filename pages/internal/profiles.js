/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Loader from '../../components/loader/loader';
import DashboardScreen from '../../components/pages/profiles/profiles';
import routes from '../../navigation/routes';
//  Actions
import * as permissionsActionsRedux from '../../store/actions/profile';

const Profiles = () => {
  const [loaded, setLoaded] = useState(false);
  const [permissions, setPermissions] = useState(false);
  // const [resources, setResources] = useState();
  const dispatch = useDispatch();
  const getPermissions = (data) => dispatch(permissionsActionsRedux.profiles(data));
  // const getResources = (data) => dispatch(permissionsActionsRedux.resources(data));

  useEffect(() => {
    const getData = async () => {
      const { data: permissionsData } = await getPermissions(); //  All permissions groups

      // await getResources().then((res) => setResources(res.data));

      setPermissions(permissionsData.results.map((perm) => {
        return { ...perm, Nome: perm.name };
      }));
    };

    Promise.all([getData()]).then(() => setLoaded(true));
  }, []);

  if (loaded && permissions) {
    const breadcrumbsPath = [
      {
        title: 'Perfis',
        href: `${routes.private.internal.profiles}`,
      }
    ];

    const headCells = [
      {
        id: 'Nome',
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

    const props = {
      breadcrumbsPath,
      permissions,
      headCells,
      // resources
    };

    return <DashboardScreen {...props} />;
  }

  return <Loader center={true} />;
};

export default Profiles;
