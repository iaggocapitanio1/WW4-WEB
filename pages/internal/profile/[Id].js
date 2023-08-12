//  Nodes
import React, { useEffect, useState } from 'react';

import ProfileScreen from '../../../components/pages/permission/permission';

import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import Loader from '../../../components/loader/loader';
import routes from '../../../navigation/routes';
import * as permissionsActionsRedux from '../../../store/actions/profile';

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

const Profile = ({ pageProps }) => {
  const [loaded, setLoaded] = useState(false);
  const [profile, setProfile] = useState(false);
  const [resources, setResources] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const getProfile = (data) => dispatch(permissionsActionsRedux.profiles(data));
  const getResources = (data) => dispatch(permissionsActionsRedux.resources(data));

  useEffect(() => {
    async function load () {
      await getProfile().then((res) => setProfile(res.data.results.filter(ele => ele.id === router.query.Id)));
      await getResources().then((res) => setResources(res.data)); //  All permissions resources
    }

    load().then(() => setLoaded(true));
  }, []);

  if (loaded && profile) {
    const perm = groupItemsByName([...profile].map((ele) => { return { ...ele }; }), [...resources]);

    const breadcrumbsPath = [
      {
        title: 'Perfis',
        href: `${routes.private.internal.profiles}`,
      },
      {
        title: perm[0].name,
        href: `${routes.private.internal.profile}${perm[0].id}`,
      }
    ];

    // console.log(perm[0]);

    const props = { breadcrumbsPath, pageProps, resources, profile: perm[0] };

    return <ProfileScreen {...props} />;
  }

  return <Loader center={true} />;
};

Profile.propTypes = {
  pageProps: PropTypes.any,
};

export default Profile;
