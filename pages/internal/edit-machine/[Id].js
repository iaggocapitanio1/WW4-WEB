//  Nodes
import React, { useEffect, useState } from 'react';

import ProfileProfile from '../../../components/pages/editMachine/editMachine';

import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../../components/loader/loader';
import routes from '../../../navigation/routes';
import * as machineActionsRedux from '../../../store/actions/machine';
// import * as organizationsActionsRedux from '../../../store/actions/organization';

const EditProfile = ({ pageProps }) => {
  const [loaded, setLoaded] = useState(false);
  const [machine, setMachine] = useState();
  const dispatch = useDispatch();
  const router = useRouter();
  const getMachine = (data) => dispatch(machineActionsRedux.machine(data));
  // const getOrganizations = (data) => dispatch(organizationsActionsRedux.organizations(data));
  const reduxState = useSelector((state) => state);

  useEffect(() => {
    async function load () {
      // await getOrganizations();
      await getMachine(router.query.Id).then((res) => setMachine(res.data));
    }

    load().then(() => setLoaded(true));
  }, []);

  if (loaded) {
    const breadcrumbsPath = [
      {
        title: 'Máquinas',
        href: `${routes.private.internal.machines}`,
      },
      {
        title: machine.name.value,
        href: `${routes.private.internal.machine}${machine.id}`,
      },
      {
        title: 'Editar máquina',
        href: `${routes.private.internal.editMachine}`,
      },
    ];

    const props = {
      breadcrumbsPath,
      pageProps,
      machine,
      organizations: reduxState.organizations.data
    };

    return <ProfileProfile {...props} />;
  }

  return <Loader center={true} />;
};

EditProfile.propTypes = {
  pageProps: PropTypes.any,
};

export default EditProfile;
