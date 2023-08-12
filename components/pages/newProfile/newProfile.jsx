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

const NewProfileScreen = (props) => {
  const { breadcrumbsPath, pageProps, resources, profiles } = props;

  const [permission, setPermission] = useState({
    name: { value: '', required: true, error: '' },
    listPermissions: props.permissionsMap
  });

  const dispatch = useDispatch();
  const newProfile = (data) => dispatch(permissionsActionsRedux.newProfile(data));
  const updateProfile = (data) => dispatch(permissionsActionsRedux.updateProfile(data));

  const headCells = [
    { key: 'key', label: 'Opção' },
    { key: 'list', label: 'Listar' },
    { key: 'see', label: 'Visualizar' },
    { key: 'add', label: 'Criar' },
    { key: 'change', label: 'Editar' },
    { key: 'delete', label: 'Apagar' },
  ];

  const cellWidth = 12 / (Object.keys(headCells).length);

  async function handleSave () {
    if (!permission.name.value) {
      setPermission({ ...permission, name: { ...permission.name, error: 'Campo Obrigatório.' } });
      toast.error('Erros no formulário.');

      return;
    }

    if (profiles.find(ele => ele.name === permission.name.value)) {
      setPermission({ ...permission, name: { ...permission.name, error: 'Já existe um perfil com este nome.' } });
      toast.error('Erros no formulário.');

      return;
    }

    const loading = toast.loading('');
    const stringValues = [];

    for (const type in permission.listPermissions) {
      const permissions = permission.listPermissions[type];

      for (const action in permissions) {
        const value = permissions[action];

        if (typeof value === 'string') {
          stringValues.push(value);
        }
      }
    }

    const FormData = require('form-data');
    const data = new FormData();

    data.append('name', permission.name.value);

    const data2 = {
      name: permission.name.value,
      permissions: stringValues.length > 0 ? stringValues : [],
    };

    const qs = require('qs');
    const data1 = qs.stringify({ name: permission.name.value });

    try {
      const newProfileRes = await newProfile(data1);

      await updateProfile({ id: newProfileRes.data.id, data: { ...data2 } });
      ToastSet(loading, 'Perfil Criado.', 'success');
      Router.push(routes.private.internal.profile + newProfileRes.data.id);
    } catch (err) {
      console.log(err);
      ToastSet(loading, 'Algo aconteceu. Por favor tente mais tarde', 'error');
    }
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
        <Grid container id='pad' md={12} justifyContent={'space-between'} >
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
            <MyInput label='Nome' required value={permission.name.value} error={permission.name.error} onChange={(e) => setPermission({ ...permission, name: { ...permission.name, value: e.target.value, error: '' } })}/>
          </Grid>
        </Grid>
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
                    {resources.find(ele => ele.codename === `${cell.key}_${resources.find(ele => ele.name === perm).codename.split('_')[1]}`) &&
                      <Checkbox
                        checked={!!permission.listPermissions[perm][cell.key]}
                        onChange={(e) => handleCheckboxClick({ newValue: e.target.checked, perm, type: cell.key })} />
                    }
                  </>
                }
              </Grid>;
            });
          })}
        </Grid>
      </Content>
    </Grid>
    <Footer />
  </>;
};

NewProfileScreen.propTypes = {
  breadcrumbsPath: PropTypes.arrayOf(PropTypes.object).isRequired,
  resources: PropTypes.arrayOf(PropTypes.object).isRequired,
  profiles: PropTypes.arrayOf(PropTypes.object).isRequired,
  pageProps: PropTypes.any,
  permission: PropTypes.any,
  permissionsMap: PropTypes.any,
};

export default NewProfileScreen;
