/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../components/loader/loader';
import NewMachineScreen from '../../components/pages/newMachine/newMachine';
import routes from '../../navigation/routes';
//  Actions
import * as organizationsActionsRedux from '../../store/actions/organization';
import * as machinesActionsRedux from '../../store/actions/machine';

const Machines = () => {
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();
  const getOrganizations = (data) => dispatch(organizationsActionsRedux.organizations(data));
  const getMachines = (data) => dispatch(machinesActionsRedux.machines(data));
  const reduxState = useSelector((state) => state);

  useEffect(() => {
    const getData = async () => {
      await getOrganizations();
      await getMachines();
    };

    Promise.all([getData()]).then(() => setLoaded(true));
  }, []);

  if (loaded) {
    const breadcrumbsPath = [
      {
        title: 'Máquinas',
        href: `${routes.private.internal.machines}`,
      },
      {
        title: 'Nova Máquina',
        href: `${routes.private.internal.newMachine}`,
      },
    ];

    const props = {
      breadcrumbsPath,
      organizations: reduxState.organizations.data,
      machines: reduxState.machines.data,
    };

    return <NewMachineScreen {...props} />;
  }

  return <Loader center={true} />;
};

export default Machines;
