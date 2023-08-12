/* eslint-disable react/prop-types */
import { Box, Checkbox, FormControlLabel, Grid, Tab, Tabs, Tooltip, Typography } from '@mui/material';
import { Plus } from 'lucide-react';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import * as permissionActions from '../../../../store/actions/profile';
import PrimaryBtn from '../../../buttons/primaryBtn';
import Content from '../../../content/content';
import Notification from '../../../dialogs/Notification';
import MyInput from '../../../inputs/myInput';
import ToastSet from '../../../utils/ToastSet';
import TabPanel from '../TabPanel';

const PagesAccessTab = (props) => {
  const dispatch = useDispatch();

  const [permissions, setPermissions] = useState(
    [...props.permissions].sort((a, b) =>
      a.name > b.name ? 1 : a.name < b.name ? -1 : 0
    ));

  const acessSections = [...props.acessSections].sort((a, b) =>
    a > b ? 1 : a < b ? -1 : 0
  );

  const [value, setValue] = useState(0);
  const [newPermName, setNewPermName] = useState({ value: '', error: '' });
  const createPermission = (data) => dispatch(permissionActions.newProfile(data));

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function a11yProps (index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  // function onCheckboxChange ({ permission, resource, action }) {
  //   const updatedPermissions = permissions.map((perm) => {
  //     const updatedPerm = { ...perm };

  //     if (updatedPerm.id === permission) {
  //       updatedPerm.resources = {
  //         ...updatedPerm.resources,
  //         [resource]: {
  //           ...updatedPerm.resources[resource],
  //           [action]: !updatedPerm.resources[resource][action]
  //         }
  //       };
  //     }

  //     return updatedPerm;
  //   });

  //   setPermissions(updatedPermissions);
  // }

  function capitalizeFirstLetterOfEachWord (string) {
    // Match the first character of each word
    return string.replace(/\b\w/g, (match) => {
      // Convert the matched character to uppercase
      return match.toUpperCase();
    });
  }

  function validateNewPermission () {
    const { value } = newPermName;

    if (value === '') {
      setNewPermName({ ...newPermName, error: 'Name is required' });

      return false;
    }

    const existingPermission = permissions.find((permission) => permission.name === value);

    if (existingPermission) {
      setNewPermName({ ...newPermName, error: 'Name is already in use' });

      return false;
    }

    return true;
  }

  async function createNewPermission () {
    const { value } = newPermName;

    if (!validateNewPermission()) {
      return;
    }

    try {
      const newPermission = await createPermission({ name: value }).payload.data.data;

      setPermissions((prevPermissions) => prevPermissions.concat(newPermission));
      ToastSet(null, 'Role created.', 'success');
    } catch (error) {
      ToastSet(null, 'Something happened. Please try again later.', 'error');
    }
  }

  return (
    <Content>
      <Notification />
      <Grid container md={12} sm={12} xs={12}>
        <Grid id='pad' container md={12} sm={12} xs={12} p={1}>
          <Typography variant="title" color="primary">
            Acesso de Permissões
          </Typography>
        </Grid>
        <Grid container md={12} sm={12} xs={12}>
          <Box sx={{ width: '100%' }}>
            <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons={true}>
              {permissions.map((perm, i) => (
                <Tab key={i} label={perm.name} {...a11yProps(i)} />
              ))}
              <Tab
                {...a11yProps(permissions.length)}
                label={
                  <Tooltip title="Nova permissão">
                    <Plus />
                  </Tooltip>
                }
              />
            </Tabs>
          </Box>
        </Grid>
        <Grid container md={12} sm={12} xs={12}>
          {permissions.map((perm, i) => (
            <TabPanel key={perm.name} value={value} index={i}>
              <Grid
                container
                md={12}
                sm={12}
                xs={12}
                p={1}
                bgcolor={'lightGray.main'}
                sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
              >
                <Grid container md={4} sm={4} xs={4} justifyContent="center" alignItems="center">
                  <Typography variant='subtitle1'> Secção</Typography>
                </Grid>
                <Grid container md={4} sm={4} xs={4} justifyContent="center" alignItems="center">
                  <Typography variant='subtitle1'> Acesso</Typography>
                </Grid>
                <Grid container md={4} sm={4} xs={4} justifyContent="center" alignItems="center">
                  <Typography variant='subtitle1'> Detalhes</Typography>
                </Grid>
              </Grid>
              {acessSections.map((section) => (
                <Grid key={section} container md={12} sm={12} xs={12} p={1} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Grid container md={4} sm={4} xs={4} justifyContent="center" alignItems="center">
                    <Typography variant='subtitle2'>
                      {capitalizeFirstLetterOfEachWord(section.replace('access_', '').replace('_', ' '))}
                    </Typography>
                  </Grid>
                  <Grid container md={4} sm={4} xs={4} justifyContent="center" alignItems="center">
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={perm.pagesAccess[section?.replace('access_', '')]}
                          // onChange={() => onCheckboxChange({ permission: perm.id, resource, action: 'get' })}
                          color="primary"
                        />
                      }
                    />
                  </Grid>
                  <Grid container md={4} sm={4} xs={4} alignItems="center">
                  </Grid>
                </Grid>
              ))}
            </TabPanel>
          ))}
          <TabPanel value={value} index={permissions.length}>
            <Grid container>
              <Grid container md={12} sm={12} xs={12} pt={2} pb={2}>
                <Typography variant="title" color="primary">
                  Nova permissão
                </Typography>
              </Grid>
              <Grid container md={4} sm={4} xs={12}>
                <MyInput
                  label={'Name'}
                  value={newPermName.value}
                  error={newPermName.error}
                  onChange={(e) => setNewPermName({ value: e.target.value, error: '' })}
                />
              </Grid>
              <Grid container md={4} sm={4} xs={12} alignItems="end" pl={2}>
                <PrimaryBtn text={'Create'} onClick={createNewPermission} />
              </Grid>
            </Grid>
          </TabPanel>
        </Grid>
      </Grid>
    </Content>
  );
};

export default PagesAccessTab;
