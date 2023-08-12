//  Nodes
import React, { useEffect, useState } from 'react';

import NewProfileScreen from '../../components/pages/newProfile/newProfile';

import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import Loader from '../../components/loader/loader';
import routes from '../../navigation/routes';
import * as profileActionsRedux from '../../store/actions/profile';

const NewProfile = ({ pageProps }) => {
  const [loaded, setLoaded] = useState(false);
  const [resources, setResources] = useState();
  const [profiles, setProfiels] = useState();
  const dispatch = useDispatch();
  const getResources = (data) => dispatch(profileActionsRedux.resources(data));
  const getProfiles = (data) => dispatch(profileActionsRedux.profiles(data));

  useEffect(() => {
    async function load () {
      await getResources().then((res) => setResources(res.data)); //  All permissions resources
      await getProfiles().then((res) => setProfiels(res.data.results)); //  All permissions resources
    }

    load().then(() => setLoaded(true));
  }, []);

  if (loaded) {
    const permissionsMap = {};

    for (const resource of resources) {
      const { codename, name } = resource;
      const [type, action] = codename.split('_');

      if (!permissionsMap[action]) {
        permissionsMap[name] = {};
      }

      permissionsMap[name][type] = false;
    }

    const filteredPermissions = {};

    // eslint-disable-next-line array-callback-return
    Object.keys(permissionsMap).map((perm) => {
      if (!perm.includes('add_') &&
        !perm.includes('view_') &&
        !perm.includes('delete_') &&
        !perm.includes('change_') &&
        !perm.includes('see')) filteredPermissions[perm] = { ...permissionsMap[perm] };
    });

    const breadcrumbsPath = [
      {
        title: 'Perfis',
        href: `${routes.private.internal.profiles}`,
      },
      {
        title: 'Novo Perfil',
        href: `${routes.private.internal.newProfile}`,
      },
    ];

    filteredPermissions.Conta.see = resources.find(ele => ele.codename === 'see_account').id;

    const props = { breadcrumbsPath, pageProps, resources, permissionsMap: filteredPermissions, profiles };

    return <NewProfileScreen {...props} />;
  }

  return <Loader center={true} />;
};

NewProfile.propTypes = {
  pageProps: PropTypes.any,
};

export default NewProfile;
