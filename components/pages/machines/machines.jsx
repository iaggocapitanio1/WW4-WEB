import { Grid, Typography } from '@mui/material';
import Router from 'next/router';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import routes from '../../../navigation/routes';
import * as machinesActionsRedux from '../../../store/actions/machine';
import AdvancedTable from '../../advancedTable/AdvancedTable';
import CustomBreadcrumbs from '../../breadcrumbs/breadcrumbs';
import PrimaryBtn from '../../buttons/primaryBtn';
import Content from '../../content/content';
import Notification from '../../dialogs/Notification';
import MyInput from '../../inputs/myInput';
import MySelect from '../../inputs/select';
import Footer from '../../layout/footer/footer';
import Navbar from '../../layout/navbar/navbar';
import CanDo from '../../utils/CanDo';
import ToastSet from '../../utils/ToastSet';

const MachinesScreen = (props) => {
  const { breadcrumbsPath, headCells, machinesTypes } = props;
  const dispatch = useDispatch();
  const deleteMachine = (data) => dispatch(machinesActionsRedux.deleteMachine(data));
  const [machines, setMachines] = useState(props.machines);

  const [filters, setFilters] = useState({
    Nome: '',
    Tipo: '',
    Occupied: ''
  });

  async function onDelete (props) {
    const loading = toast.loading('');

    await deleteMachine(props).then(() => {
      ToastSet(loading, 'Máquina Apagada.', 'success');
      Router.push(routes.private.internal.machines);

      const old = [...machines];
      const index = old.findIndex((item) => item.id === props);

      if (index !== -1) {
        const updatedItems = [...old];

        updatedItems.splice(index, 1);
        setMachines(updatedItems);
        ToastSet(loading, 'Projeto apagado.', 'success');
      }
    }).catch((err) => {
      ToastSet(loading, 'Algo aconteceu. Por favor tente mais tarde.', 'error');
      console.log(err);
    });
  }

  function ClearFilters () {
    setFilters({
      Nome: '',
      Tipo: '',
      Occupied: ''
    });
  }

  return <>
    <Navbar />
    <Notification />

    <Grid component='main' sx={{ padding: '0rem 2rem 4rem 2rem' }}>
      <CustomBreadcrumbs path={breadcrumbsPath} />
      <Content>
        <Grid id='pad' container md={12} sm={12} xs={12}>
          <Grid container md={12} sm={12} xs={12}>
            <Typography className='headerTitleSm'>Filtros</Typography>
          </Grid>
          <Grid container md={4} sm={6} xs={12} p={1}>
            <MyInput label={'Nome'} value={filters.Nome} onChange={(e) => setFilters({ ...filters, Nome: e.target.value })} />
          </Grid>
          <Grid container md={4} sm={6} xs={12} p={1} >
            <MySelect label={'Tipo'} value={filters.Tipo} options={machinesTypes} onChange={(e) => setFilters({ ...filters, Tipo: e.target.value })} />
          </Grid>
          <Grid container md={4} sm={6} xs={12} p={1} >
            <MySelect label={'Estado'} value={filters.Occupied} options={[{ id: true, label: 'Em utilização' }, { id: false, label: 'Disponível' }]} onChange={(e) => setFilters({ ...filters, Occupied: e.target.value })} />
          </Grid>
          <Grid container md={12} sm={12} xs={12} justifyContent={'end'}>
            <PrimaryBtn light text={'Limpar'} onClick={ClearFilters}/>
          </Grid>
        </Grid>
      </Content>
      <Content>
        <Grid id='pad' md={12} container justifyContent={'space-between'}>
          <Typography variant='title'>Máquinas</Typography>
          <PrimaryBtn text={'Adicionar'}
            hidden={!CanDo('add_machine')}
            href={routes.private.internal.newMachine}
          />
        </Grid>
        <AdvancedTable
          rows={machines}
          headCells={headCells}
          onDelete={ CanDo('delete_machine') && onDelete}
          editRoute={ CanDo('change_machine') && routes.private.internal.editMachine}
          clickRoute={ CanDo('see_machine') && routes.private.internal.machine}
          filters={filters}
        />
      </Content>
    </Grid>
    <Footer />
  </>;
};

MachinesScreen.propTypes = {
  headCells: PropTypes.arrayOf(PropTypes.object).isRequired,
  machinesTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
  machines: PropTypes.arrayOf(PropTypes.object).isRequired,
  breadcrumbsPath: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default MachinesScreen;
