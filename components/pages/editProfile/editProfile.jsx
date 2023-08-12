import { ButtonGroup, Checkbox, Grid, Typography } from '@mui/material';
import { Save, X } from 'lucide-react';
import Router from 'next/router';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import routes from '../../../navigation/routes';
import * as permissionsActionsRedux from '../../../store/actions/profile';
import CustomBreadcrumbs from '../../breadcrumbs/breadcrumbs';
import PrimaryBtn from '../../buttons/primaryBtn';
import Content from '../../content/content';
import Notification from '../../dialogs/Notification';
import MyInput from '../../inputs/myInput';
import Footer from '../../layout/footer/footer';
import Navbar from '../../layout/navbar/navbar';
import ToastSet from '../../utils/ToastSet';
import buildPermissionsString from './functions/buildPermissionsString';

const EditProfileScreen = (props) => {
  const { breadcrumbsPath, pageProps, resources } = props;
  const [permission, setPermission] = useState(props.permission);
  const [permissionName, setPermissionName] = useState({ value: props.permission.name, error: '' });
  const dispatch = useDispatch();
  const updateProfile = (data) => dispatch(permissionsActionsRedux.updateProfile(data));

  const headCells = [
    { key: 'key', label: 'Recurso' },
    { key: 'list', label: 'Listar' },
    { key: 'see', label: 'Visualizar' },
    { key: 'create', label: 'Criar' },
    { key: 'update', label: 'Editar' },
    { key: 'delete', label: 'Apagar' },
  ];

  const cellWidth = 12 / (Object.keys(headCells).length);

  async function handleSave () {
    if (!permissionName.value) {
      setPermissionName({ ...permissionName, error: 'Campo obrigatório' });
      toast.error('Erros no formulário');

      return;
    }

    const loading = toast.loading('');
    const stringValues = buildPermissionsString({ permission, resources });

    const data = {
      name: permissionName.value,
      permissions: stringValues,
    };

    await updateProfile({ id: permission.id, data })
      .then((res) => {
        ToastSet(loading, 'Atualizado.', 'success');
        Router.push(routes.private.internal.profile + res.data.id);
      }).catch(() => {
        ToastSet(loading, 'Algo aconteceu. Por favor tente mais tarde', 'error');
      });
  }

  function handleCheckboxClick ({ newValue, perm, type }) {
    const thisPermKey = resources.find(ele => ele.name === perm).codename.split('_')[1];

    setPermission({
      ...permission,
      listPermissions: {
        ...permission.listPermissions,
        [perm]: {
          ...permission.listPermissions[perm],
          [type]: newValue ? resources.find(ele => ele.codename === type + '_' + thisPermKey)?.id : false
        }
      }
    });
  }

  return <>
    <Navbar />
    <Notification />
    <Grid component='main' sx={{ padding: '0rem 2rem 4rem 2rem' }}>
      <CustomBreadcrumbs path={breadcrumbsPath} />
      <Content>
        <Grid container id='pad' md={12} justifyContent={{ md: 'space-between', sm: 'space-between', xs: 'center' }} >
          <Typography variant='title'>{breadcrumbsPath[1].title}</Typography>
          <ButtonGroup>
            <PrimaryBtn
              text='Guardar'
              icon={
                <Save
                  strokeWidth={pageProps?.globalVars?.iconStrokeWidth || 1}
                  size={pageProps?.globalVars?.iconSize || 20}
                />
              }
              onClick={handleSave}
            />
            <PrimaryBtn
              text='Cancelar'
              icon={
                <X
                  strokeWidth={pageProps?.globalVars?.iconStrokeWidth || 1}
                  size={pageProps?.globalVars?.iconSize || 20}
                />
              }
              light
              onClick={() => Router.back()}
            />
          </ButtonGroup>
        </Grid>
        <Grid container md={12} sm={12} xs={12}>
          <Grid container md={4} sm={6} xs={12} p={1}>
            <MyInput disabled={permissionName.value === 'Customers'} label='Nome' required value={permissionName.value} error={permissionName.error} onChange={(e) => setPermissionName({ ...permission, value: e.target.value, error: '' })}/>
          </Grid>
        </Grid>
        <Grid container md={12} sm={12} xs={12} sx={{ padding: 0, overflow: 'scroll', pb: 0 }}>
          <Grid container md={12} sm={12} xs={12} sx={{ minWidth: '1024px', height: 'fit-content' }}>
            <Grid container md={12} sm={12} xs={12}>
              {/* Header */}
              <Grid container md={12} sm={12} xs={12} bgcolor={'primary.main'} color='white'>
                {headCells.map((cell) => {
                  return <Grid key={cell.label} container alignItems='center' p={2}
                    md={cellWidth}
                    sm={cellWidth}
                    xs={cellWidth}>
                    {cell.label}
                  </Grid>;
                })}
              </Grid>
              {Object.keys(permission.listPermissions).sort((a, b) => (a > b) ? 1 : -1).map((perm, rowIndex) => {
                return headCells.map((cell, index) => {
                  return <Grid key={cell.label} container alignItems='center' p={0} bgcolor={rowIndex % 2 !== 0 && 'lightGray.edges'}
                    md={cellWidth}
                    sm={cellWidth}
                    xs={cellWidth}>
                    {index === 0
                      ? <Typography pl={2} variant='subtitle2'>{perm}</Typography>
                      : <>
                        {/* {cell.key}_{perm} */}
                        {resources.find(ele => ele.codename === `${cell.key}_${resources.find(ele => ele.name === perm).codename.split('_')[1]}`) && <Checkbox
                          checked={!!permission.listPermissions[perm][cell.key]}
                          onChange={(e) => handleCheckboxClick({ newValue: e.target.checked, perm, type: cell.key })} />}
                      </>
                    }
                  </Grid>;
                });
              })}
            </Grid>
          </Grid>
        </Grid>

      </Content>
    </Grid>
    <Footer />
  </>;
};

EditProfileScreen.propTypes = {
  breadcrumbsPath: PropTypes.arrayOf(PropTypes.object).isRequired,
  resources: PropTypes.arrayOf(PropTypes.object).isRequired,
  pageProps: PropTypes.any,
  permission: PropTypes.any,
};

export default EditProfileScreen;
