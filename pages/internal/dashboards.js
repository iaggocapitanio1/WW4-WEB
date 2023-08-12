/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../components/loader/loader';
import DashboardScreen from '../../components/pages/dashboard/dashboard';
import routes from '../../navigation/routes';
//  Actions
import * as permissionsActionsRedux from '../../store/actions/profile';

const DashBoards = ({ ...pageProps }) => {
  const [loaded, setLoaded] = useState(false);
  const [testperms, setTestperms] = useState();
  const dispatch = useDispatch();
  const reduxState = useSelector((state) => state);
  const getPermissions = (data) => dispatch(permissionsActionsRedux.profiles(data));
  const getResources = (data) => dispatch(permissionsActionsRedux.resources(data));

  function addListPermissions (profiles, resources) {
    // Create an object to store the permissions for each resource type
    const permissionsMap = {};

    // Iterate over the resources array and populate the permissions map
    for (const resource of resources) {
      const { codename } = resource;
      const [type, action] = codename.split('_');

      if (!permissionsMap[type]) {
        permissionsMap[type] = {};
      }

      permissionsMap[type][action] = true;
    }

    // Iterate over the profiles array and add the listPermissions property
    for (const profile of profiles) {
      const { permissions } = profile;
      const listPermissions = {};

      for (const permission of permissions) {
        const { codename } = permission;
        const [type, action] = codename.split('_');

        if (!listPermissions[type]) {
          listPermissions[type] = {};
        }

        // Check if the profile has access to the resource
        listPermissions[type][action] = permission.id;
      }

      // Set missing permissions to false
      for (const type in permissionsMap) {
        if (!listPermissions[type]) {
          listPermissions[type] = {};
        }

        for (const action in permissionsMap[type]) {
          if (!listPermissions[type][action]) {
            listPermissions[type][action] = false;
          }
        }
      }

      profile.listPermissions = listPermissions;
    }

    return profiles;
  }

  useEffect(() => {
    const getData = async () => {
      const { data: Permissions } = await getPermissions(); //  All permissions groups
      const { data: Resources } = await getResources(); //  All permissions resources

      const permissions = Permissions.results.map((ele) => {
        return { ...ele };
      });

      const testPerms = addListPermissions(permissions, [...Resources]);

      setTestperms(testPerms);
    };

    Promise.all([getData()]).then(() => setLoaded(true));
  }, []);

  if (loaded && typeof window !== 'undefined' && reduxState.permissions.data) {
    const breadcrumbsPath = [
      {
        title: 'Painel de Controlo',
        href: `${routes.private.internal.dashboards}`,
      }
    ];

    const test = reduxState.permissions.resources.map(resource => { return resource.name.replace('add_', '').replace('view_', '').replace('change_', '').replace('delete_', ''); });

    function removeDuplicates (arr) {
      return arr.filter((item, index) => arr.indexOf(item) === index);
    }

    const resources = removeDuplicates(test.map(word => {
      if (word.endsWith('s')) {
        return word.slice(0, -1); // remove last character if it's "s"
      }

      return word;
    }));

    const permissionsBuilt = reduxState.permissions.data.map((item) => {
      const perm = { ...item };

      perm.resources = {};
      perm.pagesAccess = {};

      reduxState.permissions.resources.map((reso) => {
        if (reso.name.includes('access_')) perm.pagesAccess[reso.name.replace('access_', '')] = !!reduxState.permissions.resources.find((ele) => ele.name === reso.name);
      });

      resources.map((reso) => {
        if (!reso.includes('access_')) {
          perm.resources[reso] = {
            get: !!reduxState.permissions.resources.find((ele) => ele.name === `view_${reso}`),
            post: !!reduxState.permissions.resources.find((ele) => ele.name === `add_${reso}`),
            patch: !!reduxState.permissions.resources.find((ele) => ele.name === `change_${reso}`),
            delete: !!reduxState.permissions.resources.find((ele) => ele.name === `delete_${reso}`),
          };
        }
      });

      return perm;
    });

    const props = {
      breadcrumbsPath,
      pageProps,
      testperms,
      permissions: permissionsBuilt,
      resources: resources.filter(ele => !ele.includes('access_')),
      acessSections: removeDuplicates(test).filter((reso) => reso.includes('access_'))
    };

    return <DashboardScreen {...props} />;
  }

  return <Loader center={true} />;
};

DashBoards.propTypes = {

};

export default DashBoards;
