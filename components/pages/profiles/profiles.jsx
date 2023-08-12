/* eslint-disable react/prop-types */
import { Grid, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import routes from '../../../navigation/routes';
import * as permissionsActionsRedux from '../../../store/actions/profile';
import AdvancedTable from '../../advancedTable/AdvancedTable';
import CustomBreadcrumbs from '../../breadcrumbs/breadcrumbs';
import PrimaryBtn from '../../buttons/primaryBtn';
import Content from '../../content/content';
import Notification from '../../dialogs/Notification';
// import MySelect from '../../inputs/select';
import MyInput from '../../inputs/myInput';
import Footer from '../../layout/footer/footer';
import Navbar from '../../layout/navbar/navbar';
import CanDo from '../../utils/CanDo';
import ToastSet from '../../utils/ToastSet';

const ProfilesScreen = (props) => {
  const { breadcrumbsPath, headCells } = props;
  // const [newResource, setNewResource] = useState({ name: '', codename: '' });
  const [profiles, setProfiles] = useState(props.permissions);

  const [filters, setFilters] = useState({
    id: ''
  });

  // const [resources, setResources] = useState([...props.resources].sort((a, b) => (a.name > b.name) ? 1 : -1));
  const dispatch = useDispatch();
  const deleteProfile = (data) => dispatch(permissionsActionsRedux.deleteProfile(data));
  // const deleteResource = (data) => dispatch(permissionsActionsRedux.deleteResource(data));
  // const updateResource = (data) => dispatch(permissionsActionsRedux.updateResource(data));
  // const newResourceFunc = (data) => dispatch(permissionsActionsRedux.newResource(data));

  async function onDelete (props) {
    const loading = toast.loading('');

    await deleteProfile(props).then(() => {
      ToastSet(loading, 'Perfil Apagado.', 'success');

      const old = [...profiles];
      const index = old.findIndex((item) => item.id === props);

      if (index !== -1) {
        const updatedItems = [...old];

        updatedItems.splice(index, 1);
        setProfiles(updatedItems);
        ToastSet(loading, 'Perfil apagado.', 'success');
      }
    }).catch((err) => {
      ToastSet(loading, 'Algo aconteceu. Por favor tente mais tarde.', 'error');
      console.log(err);
    });
  }

  // function onResourceChange (props) {
  //   const { newValue, field, index } = props;
  //   const newArray = [...resources]; // Create a copy of the original array

  //   if (index >= 0 && index < newArray.length) {
  //     const updatedItem = { ...newArray[index] }; // Create a copy of the item at the specified index

  //     updatedItem[field] = newValue; // Update the specified field with the new value
  //     newArray[index] = updatedItem; // Replace the item in the new array with the updated item
  //   }

  //   setResources(newArray);
  // }

  // async function handleResourceUpdate () {
  //   resources.map(async (resource) => {
  //     await updateResource({ id: resource.id, data: { name: resource.name, codename: resource.codename } }).then(res => console.log(res.data)).catch((err) => console.log(err));
  //   });
  // }

  // async function onResourceDelete (props) {
  //   await deleteResource(props).then(res => console.log(res.data)).catch((err) => console.log(err));
  // }
  // const resources = [
  //   {
  //     name: 'add_assembly',
  //     codename: 'add_assembly'
  //   },
  //   {
  //     name: 'Montagens',
  //     codename: 'delete_assembly'
  //   },
  //   {
  //     name: 'add_leftover',
  //     codename: 'add_leftover'
  //   },
  //   {
  //     name: 'Sobrantes',
  //     codename: 'view_leftover'
  //   },
  //   {
  //     name: 'change_leftover',
  //     codename: 'change_leftover'
  //   },
  //   {
  //     name: 'Sobrantes',
  //     codename: 'delete_leftover'
  //   },
  //   {
  //     name: 'add_budget',
  //     codename: 'add_budget'
  //   },
  //   {
  //     name: 'view_budget',
  //     codename: 'view_budget'
  //   },
  //   {
  //     name: 'change_budget',
  //     codename: 'change_budget'
  //   },
  //   {
  //     name: 'delete_budget',
  //     codename: 'delete_budget'
  //   },
  //   {
  //     name: 'add_consumable',
  //     codename: 'add_consumable'
  //   },
  //   {
  //     name: 'view_consumable',
  //     codename: 'view_consumable'
  //   },
  //   {
  //     name: 'change_consumable',
  //     codename: 'change_consumable'
  //   },
  //   {
  //     name: 'delete_consumable',
  //     codename: 'delete_consumable'
  //   },
  //   {
  //     name: 'add_expedition',
  //     codename: 'add_expedition'
  //   },
  //   {
  //     name: 'view_expedition',
  //     codename: 'view_expedition'
  //   },
  //   {
  //     name: 'delete_expedition',
  //     codename: 'delete_expedition'
  //   },
  //   {
  //     name: 'add_machine',
  //     codename: 'add_machine'
  //   },
  //   {
  //     name: 'Máquinas',
  //     codename: 'view_machine'
  //   },
  //   {
  //     name: 'change_machine',
  //     codename: 'change_machine'
  //   },
  //   {
  //     name: 'Máquinas',
  //     codename: 'delete_machine'
  //   },
  //   {
  //     name: 'add_organization',
  //     codename: 'add_organization'
  //   },
  //   {
  //     name: 'view_organization',
  //     codename: 'view_organization'
  //   },
  //   {
  //     name: 'change_organization',
  //     codename: 'change_organization'
  //   },
  //   {
  //     name: 'delete_organization',
  //     codename: 'delete_organization'
  //   },
  //   {
  //     name: 'add_owner',
  //     codename: 'add_owner'
  //   },
  //   {
  //     name: 'Clientes',
  //     codename: 'view_owner'
  //   },
  //   {
  //     name: 'change_owner',
  //     codename: 'change_owner'
  //   },
  //   {
  //     name: 'Clientes',
  //     codename: 'delete_owner'
  //   },
  //   {
  //     name: 'add_part',
  //     codename: 'add_part'
  //   },
  //   {
  //     name: 'view_part',
  //     codename: 'view_part'
  //   },
  //   {
  //     name: 'change_part',
  //     codename: 'change_part'
  //   },
  //   {
  //     name: 'delete_part',
  //     codename: 'delete_part'
  //   },
  //   {
  //     name: 'add_project',
  //     codename: 'add_project'
  //   },
  //   {
  //     name: 'Projetos',
  //     codename: 'view_project'
  //   },
  //   {
  //     name: 'change_project',
  //     codename: 'change_project'
  //   },
  //   {
  //     name: 'Projetos',
  //     codename: 'delete_project'
  //   },
  //   {
  //     name: 'add_worker',
  //     codename: 'add_worker'
  //   },
  //   {
  //     name: 'view_worker',
  //     codename: 'view_worker'
  //   },
  //   {
  //     name: 'change_worker',
  //     codename: 'change_worker'
  //   },
  //   {
  //     name: 'Utilizadores',
  //     codename: 'delete_worker'
  //   },
  //   {
  //     name: 'add_workerTask',
  //     codename: 'add_workerTask'
  //   },
  //   {
  //     name: 'view_workerTask',
  //     codename: 'view_workerTask'
  //   },
  //   {
  //     name: 'change_workerTask',
  //     codename: 'change_workerTask'
  //   },
  //   {
  //     name: 'delete_workerTask',
  //     codename: 'delete_workerTask'
  //   },
  //   {
  //     name: 'add_machineTask',
  //     codename: 'add_machineTask'
  //   },
  //   {
  //     name: 'view_machineTask',
  //     codename: 'view_machineTask'
  //   },
  //   {
  //     name: 'change_machineTask',
  //     codename: 'change_machineTask'
  //   },
  //   {
  //     name: 'delete_machineTask',
  //     codename: 'delete_machineTask'
  //   },
  //   {
  //     name: 'add_furniture',
  //     codename: 'add_furniture'
  //   },
  //   {
  //     name: 'view_furniture',
  //     codename: 'view_furniture'
  //   },
  //   {
  //     name: 'change_furniture',
  //     codename: 'change_furniture'
  //   },
  //   {
  //     name: 'delete_furniture',
  //     codename: 'delete_furniture'
  //   },
  //   {
  //     name: 'add_group',
  //     codename: 'add_group'
  //   },
  //   {
  //     name: 'view_group',
  //     codename: 'view_group'
  //   },
  //   {
  //     name: 'change_group',
  //     codename: 'change_group'
  //   },
  //   {
  //     name: 'delete_group',
  //     codename: 'delete_group'
  //   },
  //   {
  //     name: 'add_module',
  //     codename: 'add_module'
  //   },
  //   {
  //     name: 'view_module',
  //     codename: 'view_module'
  //   },
  //   {
  //     name: 'change_module',
  //     codename: 'change_module'
  //   },
  //   {
  //     name: 'delete_module',
  //     codename: 'delete_module'
  //   },
  //   {
  //     name: 'Recurso',
  //     codename: 'add_permission'
  //   },
  //   {
  //     name: 'Recurso',
  //     codename: 'change_permission'
  //   },
  //   {
  //     name: 'Recurso',
  //     codename: 'delete_permission'
  //   },
  //   {
  //     name: 'Recurso',
  //     codename: 'view_permission'
  //   },
  //   {
  //     name: 'Recurso',
  //     codename: 'list_permission'
  //   },
  //   {
  //     name: 'Projetos',
  //     codename: 'list_project'
  //   },
  //   {
  //     name: 'Stocks',
  //     codename: 'list_stock'
  //   },
  //   {
  //     name: 'Clientes',
  //     codename: 'list_client'
  //   },
  //   {
  //     name: 'Utilizadores',
  //     codename: 'list_worker'
  //   },
  //   {
  //     name: 'change_client',
  //     codename: 'change_client'
  //   },
  //   {
  //     name: 'view_client',
  //     codename: 'view_client'
  //   },
  //   {
  //     name: 'add_client',
  //     codename: 'add_client'
  //   },
  //   {
  //     name: 'Clientes',
  //     codename: 'delete_client'
  //   },
  //   {
  //     name: 'Chão de Fábrica',
  //     codename: 'view_factory'
  //   },
  //   {
  //     name: 'Chão de Fábrica',
  //     codename: 'list_factory'
  //   },
  //   {
  //     name: 'Montagens',
  //     codename: 'list_assembly'
  //   },
  //   {
  //     name: 'add_package',
  //     codename: 'add_package'
  //   },
  //   {
  //     name: 'Embalamentos',
  //     codename: 'list_package'
  //   },
  //   {
  //     name: 'Sobrantes',
  //     codename: 'list_leftover'
  //   },
  //   {
  //     name: 'Perfis',
  //     codename: 'view_profile'
  //   },
  //   {
  //     name: 'Stocks',
  //     codename: 'view_stock'
  //   },
  //   {
  //     name: 'add_stock',
  //     codename: 'add_stock'
  //   },
  //   {
  //     name: 'Mensagens',
  //     codename: 'list_message'
  //   },
  //   {
  //     name: 'Perfis',
  //     codename: 'list_profile'
  //   },
  //   {
  //     name: 'Perfis',
  //     codename: 'add_profile'
  //   },
  //   {
  //     name: 'Perfis',
  //     codename: 'change_profile'
  //   },
  //   {
  //     name: 'Máquinas',
  //     codename: 'list_machine'
  //   },
  //   {
  //     name: 'Perfis',
  //     codename: 'delete_profile'
  //   },
  //   {
  //     name: 'Projetos Similares',
  //     codename: 'list_similarProject'
  //   },
  //   {
  //     name: 'Perfis',
  //     codename: 'see_profile'
  //   },
  //   {
  //     name: 'Perfis',
  //     codename: 'update_profile'
  //   },
  //   {
  //     name: 'Perfis',
  //     codename: 'remove_profile'
  //   },
  //   {
  //     name: 'Projetos',
  //     codename: 'see_project'
  //   },
  //   {
  //     name: 'Chão de Fábrica',
  //     codename: 'see_factory'
  //   },
  //   {
  //     name: 'Clientes',
  //     codename: 'see_owner'
  //   },
  //   {
  //     name: 'Clientes',
  //     codename: 'see_client'
  //   },
  //   {
  //     name: 'Conta',
  //     codename: 'see_account'
  //   },
  //   {
  //     name: 'Máquinas',
  //     codename: 'see_machine'
  //   },
  //   {
  //     name: 'Recurso',
  //     codename: 'see_permission'
  //   },
  //   {
  //     name: 'Sobrantes',
  //     codename: 'see_leftover'
  //   },
  //   {
  //     name: 'Stocks',
  //     codename: 'see_stock'
  //   },
  //   {
  //     name: 'Utilizadores',
  //     codename: 'see_worker'
  //   },
  //   {
  //     name: 'view_budget',
  //     codename: 'see_budget'
  //   },
  //   {
  //     name: 'view_consumable',
  //     codename: 'see_consumable'
  //   },
  //   {
  //     name: 'view_furniture',
  //     codename: 'see_furniture'
  //   },
  //   {
  //     name: 'view_group',
  //     codename: 'see_group'
  //   },
  //   {
  //     name: 'view_machineTask',
  //     codename: 'see_machineTask'
  //   },
  //   {
  //     name: 'view_module',
  //     codename: 'see_module'
  //   },
  //   {
  //     name: 'view_organization',
  //     codename: 'see_organization'
  //   },
  //   {
  //     name: 'view_part',
  //     codename: 'see_part'
  //   },
  //   {
  //     name: 'view_workerTask',
  //     codename: 'see_workerTask'
  //   },
  //   {
  //     name: 'Mensagens',
  //     codename: 'add_message'
  //   },
  //   {
  //     name: 'Clientes',
  //     codename: 'list_owner'
  //   },
  //   {
  //     name: 'Chão de Fábrica',
  //     codename: 'add_factory'
  //   },
  //   {
  //     name: 'Stocks',
  //     codename: 'change_stock'
  //   },
  //   {
  //     name: 'Stocks',
  //     codename: 'delete_stock'
  //   },
  //   {
  //     name: 'Chão de Fábrica',
  //     codename: 'create_factory'
  //   },
  //   {
  //     name: 'add_organization',
  //     codename: 'create_organization'
  //   },
  //   {
  //     name: 'Clientes',
  //     codename: 'create_client'
  //   },
  //   {
  //     name: 'Clientes',
  //     codename: 'create_owner'
  //   },
  //   {
  //     name: 'Mensagens',
  //     codename: 'create_message'
  //   },
  //   {
  //     name: 'Embalamentos',
  //     codename: 'create_package'
  //   },
  //   {
  //     name: 'add_part',
  //     codename: 'create_part'
  //   },
  //   {
  //     name: 'add_workerTask',
  //     codename: 'create_workerTask'
  //   },
  //   {
  //     name: 'Perfis',
  //     codename: 'create_profile'
  //   },
  //   {
  //     name: 'Recurso',
  //     codename: 'create_permission'
  //   },
  //   {
  //     name: 'Máquinas',
  //     codename: 'create_machine'
  //   },
  //   {
  //     name: 'Projetos',
  //     codename: 'create_project'
  //   },
  //   {
  //     name: 'Stocks',
  //     codename: 'create_stock'
  //   },
  //   {
  //     name: 'Sobrantes',
  //     codename: 'create_leftover'
  //   },
  //   {
  //     name: 'Utilizadores',
  //     codename: 'create_worker'
  //   },
  //   {
  //     name: 'add_budget',
  //     codename: 'create_budget'
  //   },
  //   {
  //     name: 'add_consumable',
  //     codename: 'create_consumable'
  //   },
  //   {
  //     name: 'add_group',
  //     codename: 'create_group'
  //   },
  //   {
  //     name: 'add_furniture',
  //     codename: 'create_furniture'
  //   },
  //   {
  //     name: 'add_module',
  //     codename: 'create_module'
  //   },
  //   {
  //     name: 'add_machineTask',
  //     codename: 'create_machineTask'
  //   },
  //   {
  //     name: 'Clientes',
  //     codename: 'update_owner'
  //   },
  //   {
  //     name: 'Máquinas',
  //     codename: 'update_machine'
  //   },
  //   {
  //     name: 'Clientes',
  //     codename: 'update_client'
  //   },
  //   {
  //     name: 'Projetos',
  //     codename: 'update_project'
  //   },
  //   {
  //     name: 'Sobrantes',
  //     codename: 'update_leftover'
  //   },
  //   {
  //     name: 'Recurso',
  //     codename: 'update_permission'
  //   },
  //   {
  //     name: 'Stocks',
  //     codename: 'update_stock'
  //   },
  //   {
  //     name: 'change_budget',
  //     codename: 'update_budget'
  //   },
  //   {
  //     name: 'Utilizadores',
  //     codename: 'update_worker'
  //   },
  //   {
  //     name: 'change_consumable',
  //     codename: 'update_consumable'
  //   },
  //   {
  //     name: 'change_furniture',
  //     codename: 'update_furniture'
  //   },
  //   {
  //     name: 'change_group',
  //     codename: 'update_group'
  //   },
  //   {
  //     name: 'change_module',
  //     codename: 'update_module'
  //   },
  //   {
  //     name: 'change_machineTask',
  //     codename: 'update_machineTask'
  //   },
  //   {
  //     name: 'change_organization',
  //     codename: 'update_organization'
  //   },
  //   {
  //     name: 'change_part',
  //     codename: 'update_part'
  //   },
  //   {
  //     name: 'change_workerTask',
  //     codename: 'update_workerTask'
  //   },
  //   {
  //     name: 'Montagens',
  //     codename: 'create_assembly'
  //   },
  //   {
  //     name: 'change_assembly',
  //     codename: 'change_assembly'
  //   },
  //   {
  //     name: 'change_expedition',
  //     codename: 'change_expedition'
  //   },
  //   {
  //     name: 'view_assembly',
  //     codename: 'view_assembly'
  //   }
  // ];

  // async function handleCreate () {
  //   resources.map(async (ele) => {
  //     const qs = require('qs');
  //     const data = qs.stringify({ name: ele.name, codename: ele.codename });

  //     await newResourceFunc({ data }).then(res => console.log(res.data)).catch((err) => console.log(err));
  //     // if (ele.codename.includes('change_')) {

  //     // }
  //   });
  // }

  // async function handleNewResource () {
  //   const qs = require('qs');
  //   const data = qs.stringify({ ...newResource });

  //   await newResourceFunc({ data }).then(res => {
  //     console.log(res.data);
  //   }).catch((err) => console.log(err));
  // }

  function ClearFilters () {
    setFilters({ id: '' });
  }

  return <>
    <Navbar />
    <Notification />
    <Grid component='main' sx={{ padding: '0rem 2rem 4rem 2rem' }}>
      <CustomBreadcrumbs path={breadcrumbsPath} />
      <Content>
        <Grid id='pad' container md={12}>
          <Grid container md={12}>
            <Typography variant="titlexs">Filtros</Typography>
          </Grid>
          <Grid container md={4}>
            <MyInput value={filters.name} label='Nome' onChange={(e) => setFilters({ ...filters, name: e.target.value })}/>
            {/* <MySelect value={filters.id} label='Nome' options={profiles.sort((a, b) => (a.name > b.name) ? 1 : -1)} optionLabel='name' onChange={(e) => setFilters({ ...filters, id: e.target.value })} /> */}
          </Grid>
          <Grid container md={12} justifyContent={'end'}>
            <PrimaryBtn light text={'Limpar'} onClick={ClearFilters} />
          </Grid>
        </Grid>
      </Content>
      <Content>
        <Grid id='pad' md={12} container justifyContent={'space-between'}>
          <Typography variant='title'>Perfis</Typography>
          <PrimaryBtn text={'Adicionar'} hidden={!CanDo('add_profile')}
            href={routes.private.internal.newProfile} />
        </Grid>
        <AdvancedTable
          rows={profiles}
          headCells={headCells}
          filters={filters}
          onDelete={CanDo('delete_profile') && onDelete}
          editRoute={CanDo('update_profile') && routes.private.internal.editProfile}
          clickRoute={CanDo('see_profile') && routes.private.internal.profile}
        />

        {/* <PrimaryBtn text={'Create'} onClick={() => handleCreate()} /> */}
        {/* {false && <Grid container md={4} sm={12} xs={12} pb={10}>
          <PrimaryBtn text={'Guardar'} onClick={() => handleNewResource()} />
          <MyInput
            label={'Name'}
            value={newResource.name}
            onChange={(e) => setNewResource({ ...newResource, name: e.target.value })}
          />
          <MyInput
            label={'codename'}
            value={newResource.codename}
            onChange={(e) => setNewResource({ ...newResource, codename: e.target.value })}
          />

        </Grid>}
        {false && <Grid container md={12} sm={12} xs={12}>
          <PrimaryBtn text={'Guardar'} onClick={() => handleResourceUpdate()} />
          {[...resources]?.map((resource, index) => {
            return <Grid container key={resource.id}>
              <Grid container md={4} sm={12} xs={12}>
                <MyInput onChange={(e) => onResourceChange({ newValue: e.target.value, field: 'name', index })} label='name' value={resource.name} />
              </Grid>
              <Grid container md={4} sm={12} xs={12}>
                <MyInput onChange={(e) => onResourceChange({ newValue: e.target.value, field: 'codename', index })} label='codename' value={resource.codename} />
              </Grid>
              <Grid container md={4} sm={12} xs={12}>
                <PrimaryBtn text={'Remove'} onClick={() => onResourceDelete(resource.id)} />
              </Grid>
            </Grid>;
          })}
        </Grid>} */}
      </Content>
    </Grid>
    <Footer />
  </>;
};

export default ProfilesScreen;
