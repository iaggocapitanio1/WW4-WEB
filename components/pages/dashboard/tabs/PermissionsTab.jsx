/* eslint-disable react/prop-types */
import { Box, Checkbox, FormControlLabel, Grid, Tab, Tabs, Tooltip, Typography } from '@mui/material';
import { Plus, Save } from 'lucide-react';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import * as permissionActions from '../../../../store/actions/profile';
import PrimaryBtn from '../../../buttons/primaryBtn';
import Content from '../../../content/content';
import Notification from '../../../dialogs/Notification';
import MyInput from '../../../inputs/myInput';
import ToastSet from '../../../utils/ToastSet';
import TabPanel from '../TabPanel';

const PermissionsTab = (props) => {
  const dispatch = useDispatch();
  const testperms = props.testperms;

  const [permissions, setPermissions] = useState(
    [...props.permissions].sort((a, b) =>
      a.name > b.name ? 1 : a.name < b.name ? -1 : 0
    ));

  const [value, setValue] = useState(0);
  const [newPermName, setNewPermName] = useState({ value: '', error: '' });
  const [newResourceName, setNewResourceName] = useState({ value: '', error: '' });
  const newPermission = (data) => dispatch(permissionActions.newProfile(data));
  const newResource = (data) => dispatch(permissionActions.newResource(data));
  const resources = JSON.parse(JSON.stringify(props.resources));

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function a11yProps (index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  function capitalizeFirstLetterOfEachWord (string) {
    // Match the first character of each word
    return string.replace(/\b\w/g, (match) => {
      // Convert the matched character to uppercase
      return match.toUpperCase();
    });
  }

  function onCheckboxChange ({ permission, resource, action }) {
    const updatedPermissions = permissions.map((perm) => {
      const updatedPerm = { ...perm };

      if (updatedPerm.id === permission) {
        updatedPerm.resources = {
          ...updatedPerm.resources,
          [resource]: {
            ...updatedPerm.resources[resource],
            [action]: !updatedPerm.resources[resource][action]
          }
        };
      }

      return updatedPerm;
    });

    setPermissions(updatedPermissions);
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

  function validateNewResource () {
    const { value } = newResourceName;

    if (value === '') {
      setNewResourceName({ ...newResourceName, error: 'Name is required' });

      return false;
    }

    const existingPermission = resources.find((permission) => permission.name === value);

    if (existingPermission) {
      setNewResourceName({ ...newResourceName, error: 'Name is already in use' });

      return false;
    }

    return true;
  }

  async function createNewPermission () {
    const { value } = newPermName;

    if (!validateNewPermission()) {
      return;
    }

    const qs = require('qs');
    const data = qs.stringify({ name: value });

    try {
      const newPermissionRes = await newPermission(data);

      setPermissions((prevPermissions) => prevPermissions.concat(newPermissionRes));
      ToastSet(null, 'Role created.', 'success');
    } catch (error) {
      console.log(error);
      ToastSet(null, 'Something happened. Please try again later.', 'error');
    }
  }

  async function createNewResource () {
    const { value } = newResourceName;

    if (!validateNewResource()) {
      return;
    }

    const qs = require('qs');
    const data = qs.stringify({ name: value, codename: value });

    try {
      const newPermissionRes = await newResource(data);

      setPermissions((prevPermissions) => prevPermissions.concat(newPermissionRes));
      ToastSet(null, 'Role created.', 'success');
    } catch (error) {
      console.log(error);
      ToastSet(null, 'Something happened. Please try again later.', 'error');
    }
  }

  return (
    <Content>
      <Notification />
      <Grid container md={12} sm={12} xs={12}>
        <Grid id='pad' container md={12} sm={12} xs={12} p={1} justifyContent={'space-between'}>
          <Typography variant="title" color="primary">
            Recursos de Permissões
          </Typography>
          <PrimaryBtn text={'Guardar'} icon={<Save />} />
        </Grid>
        <Grid container md={12} sm={12} xs={12}>
          <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons={true}>
            {testperms.map((perm, index) => {
              return <Tab key={index} label={perm.name} {...a11yProps(index)} />;
            })}
            <Tab
              {...a11yProps(testperms.length)}
              label={
                <Tooltip title="Nova permissão">
                  <Plus />
                </Tooltip>
              }
            />
          </Tabs>
        </Grid>
        <Grid container md={12} sm={12} xs={12}>
          {testperms.map((perm, index) => {
            return <TabPanel key={perm.name} value={value} index={index}>
              <Grid
                container
                md={12}
                sm={12}
                xs={12}
                p={1}
                bgcolor={'lightGray.main'}
                sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
              >
                {resources.map((resource) => (
                  <Grid key={resource} container md={12} sm={12} xs={12} p={1} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Grid container md={2.4} sm={2.4} xs={2.4} justifyContent="center" alignItems="center">
                      <Typography variant='subtitle2'>
                        {capitalizeFirstLetterOfEachWord(resource)}
                      </Typography>
                    </Grid>
                    <Grid container md={2.4} sm={2.4} xs={2.4} justifyContent="center" alignItems="center">
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={
                              perm.listPermissions?.view[resource]
                            }
                            onChange={() => onCheckboxChange({ permission: perm.id, resource, action: 'get' })}
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid container md={2.4} sm={2.4} xs={2.4} justifyContent="center" alignItems="center">
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={
                              perm.listPermissions?.add[resource]
                            }
                            onChange={() => onCheckboxChange({ permission: perm.id, resource, action: 'post' })}
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid container md={2.4} sm={2.4} xs={2.4} justifyContent="center" alignItems="center">
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={
                              perm.listPermissions?.change[resource]
                            }
                            onChange={() => onCheckboxChange({ permission: perm.id, resource, action: 'patch' })}
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid container md={2.4} sm={2.4} xs={2.4} justifyContent="center" alignItems="center">
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={
                              perm.listPermissions?.delete[resource]
                            }
                            onChange={() => onCheckboxChange({ permission: perm.id, resource, action: 'delete' })}
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                  </Grid>
                ))}

              </Grid>
            </TabPanel>;
          })}
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
            <Grid container>
              <Grid container md={12} sm={12} xs={12} pt={2} pb={2}>
                <Typography variant="title" color="primary">
                  Novo Recurso
                </Typography>
              </Grid>
              <Grid container md={4} sm={4} xs={12}>
                {/* <MyInput
                  label={'codename'}
                  value={newResourceName.value}
                  error={newResourceName.error}
                  onChange={(e) => setNewResourceName({ value: e.target.value, error: '' })}
                /> */}
                <MyInput
                  label={'Name'}
                  value={newResourceName.value}
                  error={newResourceName.error}
                  onChange={(e) => setNewResourceName({ value: e.target.value, error: '' })}
                />
              </Grid>
              <Grid container md={4} sm={4} xs={12} alignItems="end" pl={2}>
                <PrimaryBtn text={'Create'} onClick={createNewResource} />
              </Grid>
            </Grid>
          </TabPanel>
        </Grid>
        <Grid container md={12} sm={12} xs={12} display={'none'}>
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

        <Grid container md={12} sm={12} xs={12} display='none'>
          {permissions.map((perm, i) => (
            <>
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
                  <Grid container md={2.4} sm={2.4} xs={2.4} justifyContent="center" alignItems="center">
                    <Typography variant='subtitle1'> Recurso</Typography>
                  </Grid>
                  <Grid container md={2.4} sm={2.4} xs={2.4} justifyContent="center" alignItems="center">
                    <Typography variant='subtitle1'> Ver</Typography>
                  </Grid>
                  <Grid container md={2.4} sm={2.4} xs={2.4} justifyContent="center" alignItems="center">
                    <Typography variant='subtitle1'>
                    </Typography> Criar</Grid>
                  <Grid container md={2.4} sm={2.4} xs={2.4} justifyContent="center" alignItems="center">
                    <Typography variant='subtitle1'> Alterar</Typography>
                  </Grid>
                  <Grid container md={2.4} sm={2.4} xs={2.4} justifyContent="center" alignItems="center">
                    <Typography variant='subtitle1'> Apagar</Typography>
                  </Grid>
                </Grid>
                {resources.map((resource) => (
                  <Grid key={resource} container md={12} sm={12} xs={12} p={1} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Grid container md={2.4} sm={2.4} xs={2.4} justifyContent="center" alignItems="center">
                      <Typography variant='subtitle2'>
                        {capitalizeFirstLetterOfEachWord(resource)}
                      </Typography>
                    </Grid>
                    <Grid container md={2.4} sm={2.4} xs={2.4} justifyContent="center" alignItems="center">
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={
                              perm.resources[resource]?.get
                            }
                            onChange={() => onCheckboxChange({ permission: perm.id, resource, action: 'get' })}
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid container md={2.4} sm={2.4} xs={2.4} justifyContent="center" alignItems="center">
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={
                              perm.resources[resource]?.post
                            }
                            onChange={() => onCheckboxChange({ permission: perm.id, resource, action: 'post' })}
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid container md={2.4} sm={2.4} xs={2.4} justifyContent="center" alignItems="center">
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={
                              perm.resources[resource]?.patch
                            }
                            onChange={() => onCheckboxChange({ permission: perm.id, resource, action: 'patch' })}
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                    <Grid container md={2.4} sm={2.4} xs={2.4} justifyContent="center" alignItems="center">
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={
                              perm.resources[resource]?.delete
                            }
                            onChange={() => onCheckboxChange({ permission: perm.id, resource, action: 'delete' })}
                            color="primary"
                          />
                        }
                      />
                    </Grid>
                  </Grid>
                ))}
              </TabPanel>
            </>
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
            <Grid container>
              <Grid container md={12} sm={12} xs={12} pt={2} pb={2}>
                <Typography variant="title" color="primary">
                  Novo Recurso
                </Typography>
              </Grid>
              <Grid container md={4} sm={4} xs={12}>
                <MyInput
                  label={'Name'}
                  value={newResourceName.value}
                  error={newResourceName.error}
                  onChange={(e) => setNewResourceName({ value: e.target.value, error: '' })}
                />
              </Grid>
              <Grid container md={4} sm={4} xs={12} alignItems="end" pl={2}>
                <PrimaryBtn text={'Create'} onClick={createNewResource} />
              </Grid>
            </Grid>
          </TabPanel>
        </Grid>
      </Grid>
    </Content>
  );
};

export default PermissionsTab;
