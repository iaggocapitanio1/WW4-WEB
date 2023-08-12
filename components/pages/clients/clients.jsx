//  Nodes
import CssBaseline from '@mui/material/CssBaseline';
import React, { useEffect, useState } from 'react';

import Grid from '@mui/material/Grid';
import CustomBreadcrumbs from '../../breadcrumbs';

import PrimaryBtn from '../../buttons/primaryBtn';
import Content from '../../content/content';

//  PropTypes
import {
  Autocomplete,
  Box,
  InputLabel,
  TextField,
  Typography
} from '@mui/material';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import * as clientsActionsRedux from '../../../store/actions/client';
import AdvancedTable from '../../advancedTable/AdvancedTable';
import MyInput from '../../inputs/myInput';
import Footer from '../../layout/footer/footer';
import Navbar from '../../layout/navbar/navbar';
import CanDo from '../../utils/CanDo';
import ToastSet from '../../utils/ToastSet';

const Clients = ({ ...props }) => {
  const {
    breadcrumbsPath,
    profiles,
    headCells,
    editRoute,
    detailRoute,
    newRoute,
  } = props;

  //  States
  const [nome, setNome] = useState('');
  const [clients, setClients] = useState(props.items);
  const [email, setEmail] = useState('');
  const [profilesFilter, setProfilesFilter] = useState('');
  const [filters, setFilters] = useState({});
  const dispatch = useDispatch();
  const deleteClient = (data) => dispatch(clientsActionsRedux.deleteClient(data));

  useEffect(() => {
    setFilters({
      Nome: nome,
      Email: email,
      perfilId: profilesFilter
    });
  }, [nome, email, profiles, profilesFilter]);

  useEffect(() => {
    setEmail(filters.Email || '');
    setNome(filters.Nome || '');
  }, [filters]);

  const ClearFilters = () => {
    setNome('');
    setEmail('');
    setProfilesFilter('');
  };

  async function onDelete (props) {
    const loading = toast.loading('');

    try {
      await deleteClient(props).then(() => {
        ToastSet(loading, 'Cliente Removido!', 'error');
      });
    } catch (err) {
      console.log(err);
      ToastSet(loading, 'Algo aconteceu. Por favor tente mais tarde.', 'error');
    }

    const old = [...clients];
    const index = old.findIndex((item) => item.id === props);

    if (index !== -1) {
      const updatedItems = [...old];

      updatedItems.splice(index, 1);
      setClients(updatedItems);
      ToastSet(loading, 'Cliente Removido.', 'success');
    }
  }

  return (
    <>
      <Navbar />
      <Grid component='main' sx={{ padding: '0rem 2rem 4rem 2rem' }}>
        <CssBaseline />
        <CustomBreadcrumbs path={breadcrumbsPath} />
        {/* Filters */}
        <Content>
          <Grid id='pad' container md={12} sm={12} xs={12}>
            <Grid container md={12} sm={12} xs={12}>
              <Typography variant='titlexs'>Filtros</Typography>
            </Grid>
            <Grid container md={4} sm={4} xs={12} p={1}>
              <InputLabel htmlFor='email'>Cliente</InputLabel>
              <Autocomplete
                name="client"
                id="client"
                fullWidth
                disablePortal
                options={clients.sort((a, b) => (a.NomeDropdown > b.NomeDropdown ? 1 : a.NomeDropdown < b.NomeDropdown ? -1 : 0))}
                getOptionLabel={(option) => option.NomeDropdown}
                getOptionValue={(option) => option.id}
                onChange={(e, value) => setNome(value?.Nome || '')}
                renderOption={(props, option) => (
                  <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                    {option.NomeDropdown}
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: 'new-password', // disable autocomplete and autofill
                    }}
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                  />
                )}
              />
            </Grid>
            <Grid container md={4} sm={4} xs={12} p={1}>
              <MyInput label='Email' value={email} onChange={(e) => setEmail(e.target.value)}/>
            </Grid>
            <Grid container md={12} sm={12} xs={12} justifyContent={'end'}>
              <PrimaryBtn text='Limpar' light onClick={ClearFilters} />
            </Grid>
          </Grid>
        </Content>

        <Content>
          <Box
            id='pad'
            className='flex'
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <Box>
              <a className='headerTitleXl'>{breadcrumbsPath[0].title}</a>
            </Box>
            <Box
              style={{
                marginLeft: 'auto',
                display: 'flex',
                alignItems: 'end',
                flexDirection: 'column',
                color: 'var(--grayTexts)',
                fontSize: 'small',
              }}
            >
              <Box>
                <PrimaryBtn
                  text='Adicionar'
                  hidden={!CanDo('create_client')}
                  href={newRoute}
                />
              </Box>
            </Box>
          </Box>
          <AdvancedTable
            rows={clients.sort((a, b) =>
              a.Nome > b.Nome ? 1 : a.Nome < b.Nome ? -1 : 0
            )}
            headCells={headCells}
            clickRoute={ CanDo('see_client') && detailRoute}
            editRoute={ CanDo('update_client') && editRoute}
            filters={filters}
            setFilters={setFilters}
            onDelete={onDelete}
          />
        </Content>
      </Grid>
      <Footer/>
    </>
  );
};

Clients.propTypes = {
  breadcrumbsPath: PropTypes.array,
  items: PropTypes.array,
  profiles: PropTypes.array,
  headCells: PropTypes.array,
  editRoute: PropTypes.string,
  detailRoute: PropTypes.string,
  newRoute: PropTypes.string,
};

export default Clients;
