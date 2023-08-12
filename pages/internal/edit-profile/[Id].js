//  Nodes
import React, { useEffect, useState } from 'react';

import ProfileProfile from '../../../components/pages/editProfile/editProfile';

import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import Loader from '../../../components/loader/loader';
import routes from '../../../navigation/routes';
import * as profileActionsRedux from '../../../store/actions/profile';

function groupItemsByName (profiles, resources) {
  const excludedPrefixes = ['view_', 'add_', 'delete_', 'change_', 'view_'];
  // Create an object to store the permissions for each resource type
  const permissionsMap = {};

  // Iterate over the resources array and populate the permissions map
  for (const resource of resources) {
    const { codename, name } = resource;
    const [type] = codename.split('_');

    if (!permissionsMap[name]) {
      permissionsMap[name] = {};
    }

    permissionsMap[name][type] = resource.id;
  }

  // Iterate over the profiles array and add the listPermissions property
  const filteredProfiles = [];

  for (const profile of profiles) {
    const { permissions } = profile;
    const listPermissions = {};

    // Check if the profile starts with any excluded prefix
    if (excludedPrefixes.some(prefix => profile?.name?.startsWith(prefix))) {
      continue; // Skip this profile
    }

    for (const permission of permissions) {
      const { codename, name } = permission;
      const [type] = codename.split('_');

      if (!listPermissions[name]) {
        listPermissions[name] = {};
      }

      // Check if the profile has access to the resource
      listPermissions[name][type] = permission.id;
    }

    // Set missing permissions to false
    for (const name in permissionsMap) {
      if (!listPermissions[name]) {
        listPermissions[name] = {};
      }

      for (const action in permissionsMap[name]) {
        if (!listPermissions[name][action]) {
          listPermissions[name][action] = false;
        }
      }
    }

    const filteredPermissions = {};

    // eslint-disable-next-line array-callback-return
    Object.keys(listPermissions).map((perm) => {
      if (!perm.includes('add_') &&
        !perm.includes('view_') &&
        !perm.includes('delete_') &&
        !perm.includes('change_') &&
        !perm.includes('see')) filteredPermissions[perm] = { ...listPermissions[perm] };
    });

    profile.listPermissions = filteredPermissions;
    filteredProfiles.push(profile);
  }

  return filteredProfiles;
}

const EditProfile = ({ pageProps }) => {
  const [loaded, setLoaded] = useState(false);
  const [permission, setPermission] = useState(false);
  const [resources, setResources] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const getProfile = (data) => dispatch(profileActionsRedux.profiles(data));
  const getResources = (data) => dispatch(profileActionsRedux.resources(data));

  useEffect(() => {
    async function load () {
      await getProfile().then((res) => {
        setPermission(res.data.results.filter(ele => ele.id === router.query.Id));
      });

      await getResources().then((res) => setResources(res.data)); //  All permissions resources
    }

    load().then(() => setLoaded(true));
  }, []);

  if (loaded) {
    const perm = groupItemsByName([...permission].map((ele) => { return { ...ele }; }), [...resources]);

    const breadcrumbsPath = [
      {
        title: 'Perfis',
        href: `${routes.private.internal.profiles}`,
      },
      {
        title: perm[0].name,
        href: `${routes.private.internal.profile}${perm[0].id}`,
      },
      {
        title: 'Editar',
        href: `${routes.private.internal.editPermission}`,
      },
    ];

    const props = {
      breadcrumbsPath,
      pageProps,
      resources,
      permission: perm[0]
    };

    return <ProfileProfile {...props} />;
  }

  return <Loader center={true} />;
};

EditProfile.propTypes = {
  pageProps: PropTypes.any,
};

export default EditProfile;
