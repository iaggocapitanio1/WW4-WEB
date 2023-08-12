/* eslint-disable react/prop-types */
import {
  Autocomplete,
  Box, Chip,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography
} from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import routes from '../../../navigation/routes';
import * as budgetsActionsRedux from '../../../store/actions/budget';
import * as projectsActionsRedux from '../../../store/actions/project';
import AdvancedTable from '../../advancedTable/AdvancedTable';
import CustomBreadcrumbs from '../../breadcrumbs';
import PrimaryBtn from '../../buttons/primaryBtn';
import InfoCard from '../../cards/InfoCard';
import Content from '../../content/content';
import MyAutocomplete from '../../inputs/myAutocomplete/myAutocomplete';
import MyInput from '../../inputs/myInput';
import Footer from '../../layout/footer/footer';
import Navbar from '../../layout/navbar/navbar';
import CanDo from '../../utils/CanDo';
import ToastSet from '../../utils/ToastSet';

const ProjectsScreen = (props) => {
  const path = useRouter();
  const isInternalPage = Object.values(routes.private.internal).includes(path.route.replace('[Id]', ''));
  const dispatch = useDispatch();
  const updateProject = (data) => dispatch(projectsActionsRedux.updateProject(data));
  const updateBudget = (data) => dispatch(budgetsActionsRedux.updateBudget(data));
  const deleteBudget = (data) => dispatch(budgetsActionsRedux.deleteBudget(data));
  const theme = useSelector((state) => state.appStates.theme);

  const {
    breadcrumbsPath,
    detailPage,
    cards,
    clients,
    editPage,
    headCellsProjects,
  } = props;

  const router = useRouter();
  const [number, setNumber] = useState(router.query.order || '');
  const [client, setClient] = useState('');
  const [telephone, setTelephone] = useState('');
  const [category, setCategory] = useState('');
  const [producao, setProducao] = useState('');
  const [filters, setFilters] = useState({});
  const [product, setProduct] = useState('');
  const [referencia, setReferência] = useState('');
  const [items, setItems] = useState(props.items);

  const States = [
    {
      subheader: true,
      label: '--- Orçamentação'
    },
    {
      id: 'needs analysis',
      label: 'Pendente Análise Necessidades'
    },
    {
      id: 'waiting budget',
      label: 'Pendente Orçamentação'
    },
    {
      id: 'waiting adjudication',
      label: 'Pendente Adjudicação'
    },
    {
      id: 'canceled',
      label: 'Cancelado',
      notDefault: true
    },
    {
      subheader: true,
      label: '--- Execução'
    },
    {
      id: 'drawing',
      label: 'Pendente Desenho'
    },
    {
      id: 'production',
      label: 'Pendente Produção'
    },
    {
      id: 'testing',
      label: 'Pendente Montagem'
    },
    {
      id: 'packing',
      label: 'Pendente Embalamento'
    },
    {
      id: 'transport',
      label: 'Pendente Expedição'
    },
    {
      id: 'finished',
      label: 'Terminado',
      notDefault: true
    },
  ];

  const [personName, setPersonName] = useState(States.filter(ele => ele.subheader !== true).filter(ele => ele.notDefault !== true).map(ele => ele.id));

  const ClearFilters = () => {
    setProduct('');
    setReferência('');
    setNumber('');
    setClient('');
    setCategory('');
    setProducao(States.filter(ele => ele.subheader !== true).filter(ele => ele.notDefault !== true).map(ele => ele.id));
    setPersonName(States.filter(ele => ele.subheader !== true).filter(ele => ele.notDefault !== true).map(ele => ele.id));
    setFilters({});
  };

  //  Triggers when a filter input changes

  useEffect(() => {
    setFilters({
      Nome: number,
      Cliente: client,
      Estado: personName,
      telemovel: telephone,
      Numero: referencia
    });
  }, [number, producao, client, category, product, telephone, referencia, personName]);

  useEffect(() => {
    setNumber(filters.Nome || '');
    setReferência(filters.Numero || '');
    setClient(filters.Cliente || '');
    setProducao(filters.Estado || '');
    setTelephone(filters.telemovel || '');
  }, [filters]);

  async function onReactivationItem (props) {
    const loading = toast.loading('');
    // eslint-disable-next-line react/prop-types
    const isProject = props.includes('urn:ngsi-ld:Project:');

    const data = {
      id: props,
      data: { status: { type: 'Property', value: isProject ? 'drawing' : 'waiting budget' } }
    };

    try {
      isProject
        ? await updateProject(data)
        : await updateBudget(data);
    } catch (err) {
      ToastSet(loading, 'Algo aconteceu. Por favor tente mais tarde.', 'error');
    }

    const old = [...items];
    const index = old.findIndex((item) => item.id === props);

    if (index !== -1) {
      const updatedItem = {
        ...items[index], // Copy the existing item
        status: { type: 'Property', value: isProject ? 'drawing' : 'waiting budget' },
        Estado: isProject ? 'drawing' : 'waiting budget'
      };

      const updatedItems = [
        ...items.slice(0, index), // Copy the items before the updated item
        updatedItem, // Add the updated item
        ...items.slice(index + 1) // Copy the items after the updated item
      ];

      setItems(updatedItems);
      ToastSet(loading, `${isProject ? 'Projeto' : 'Projeto'} reaberto.`, 'success');
    }
  }

  async function onCancelProject (props) {
    const loading = toast.loading('');
    const isProject = props.type === 'Project';
    const update = isProject ? updateProject : updateBudget;

    const data = {
    };

    isProject
      ? data.status = { type: 'Property', value: 'canceled' }
      : data.budgetStatus = { type: 'Property', value: 'canceled' };

    try {
      true && await update({ id: props.id, data }).then(() => {
        const old = [...items];
        const index = old.findIndex((item) => item.id === props.id);

        if (index !== -1) {
          const updatedItem = {
            ...items[index], // Copy the existing item
            ...data,
            Estado: 'canceled'
          };

          const updatedItems = [
            ...items.slice(0, index), // Copy the items before the updated item
            updatedItem, // Add the updated item
            ...items.slice(index + 1) // Copy the items after the updated item
          ];

          setItems(updatedItems);
          ToastSet(loading, 'Projeto Cancelado.', 'success');
        }
      });
    } catch (err) { console.log(err); }
  }

  async function onDeleteItem (props) {
    const loading = toast.loading('');
    // eslint-disable-next-line react/prop-types
    const toDelete = items.find(ele => ele.id === props);

    if (toDelete.type === 'Project') {
      await deleteBudget(toDelete.hasBudget.object);
    } else {
      await deleteBudget(props);
    }

    const old = [...items];
    const index = old.findIndex((item) => item.id === props);

    if (toDelete) {
      if (index !== -1) {
        const updatedItems = [...old];

        updatedItems.splice(index, 1);
        setItems(updatedItems);
        ToastSet(loading, 'Projeto apagado.', 'success');
      }
    }
  }

  function getStyles (name, personName, theme) {
    return {
      fontWeight:
        personName.indexOf(name) === -1
          ? theme?.typography?.fontWeightRegular
          : theme?.typography?.fontWeightMedium,
    };
  }

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <>
      <Navbar />
      <Grid component='main' sx={{ padding: '0rem 2rem 4rem 2rem' }} >
        {/* <Button onClick={() => fixAll()}>fix</Button> */}
        <CssBaseline />
        {/* Breadcrumbs */}
        <CustomBreadcrumbs path={breadcrumbsPath} />
        {/* Statistics Cards */}
        <Grid container md={12} sx={12} xs={12}>
          {cards?.map((card) => (
            <Grid container item key={card.num} lg={4} md={4} sm={6} xs={12} p={1} onClick={() => {
              setPersonName(Array.isArray(card.id) ? card.id : [card.id]);
            }}>
              <InfoCard
                amount={card.amount}
                color={card.color}
                icon={card.icon}
                title={card.title}
              />
            </Grid>
          ))}
        </Grid>
        {/* Filters */}
        <Content>
          <Grid id='pad' md={12} container>
            <Grid container item md={12}><Typography variant='titlexs'>Filtros</Typography></Grid>
            {isInternalPage && <Grid container item md={4} sm={6} xs={12} p={1}>
              <Box sx={{ width: '100%' }}>
                <InputLabel htmlFor='email'>Cliente</InputLabel>
                <Autocomplete
                  name='client'
                  id='client'
                  fullWidth
                  disablePortal
                  options={clients.sort((a, b) =>
                    a.Nome > b.Nome ? 1 : a.Nome < b.Nome ? -1 : 0
                  )}
                  getOptionLabel={(option) => option.Nome }
                  getOptionValue={(option) => option.id}
                  onChange={(e, value) => {
                    setClient(value?.id || '');
                  }}
                  renderOption={(props, option) => {
                    return (
                      <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                        {option.Nome}
                      </Box>
                    );
                  }}
                  renderInput={(params) => (
                    <TextField
                      value={client}
                      {...params}
                      inputProps={{
                        ...params.inputProps,
                        autoComplete: 'new-password', // disable autocomplete and autofill
                      }}
                    />
                  )}
                />
                {false && <MyAutocomplete
                  value={client}
                  options={clients}
                  optionLabel={'Nome'}
                  optionValue={'id'}
                  onChange={(e) => setClient(e || '')}
                />}
              </Box>
            </Grid>}
            <Grid container item md={isInternalPage ? 4 : 3} sm={6} xs={12} p={1}>
              <MyInput
                fullWidth
                label='Nome'
                id='name'
                name='name'
                autoComplete='name'
                value={number}
                onChange={(e) => setNumber(e.target.value)}
              />
            </Grid>
            <Grid container item md={isInternalPage ? 4 : 3} sm={6} xs={12} p={1}>
              <MyInput
                fullWidth
                label='Número'
                type='number'
                id='Numero'
                name='Numero'
                autoComplete='name'
                value={referencia}
                onChange={(e) => setReferência(e.target.value)}
              />
            </Grid>
            <Grid container item md={isInternalPage ? 12 : 6} sm={12} xs={12} p={1}>
              <Grid container item md={12} sm={6} xs={12}>
                <InputLabel id="state-select">Estado</InputLabel>
              </Grid>
              <Select
                multiple
                value={personName}
                onChange={handleChange}
                input={<OutlinedInput id="select-multiple-chip" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={States.filter(ele => ele.subheader !== true).find(ele => ele.id === value)?.label.replace('Pendente', '')} />
                    ))}
                  </Box>
                )}
                sx={{ width: 'fit-content', minWidth: '32.5%' }}
              >
                {States.map((value) => (
                  <MenuItem
                    key={value.id}
                    value={value.id}
                    disabled={value.subheader}
                    style={getStyles(name, personName, theme)}
                  >
                    {value.label}
                  </MenuItem>
                ))}
              </Select>

            </Grid>
            <Grid container item md={12} sx={{ display: 'flex', justifyContent: 'end' }}>
              <PrimaryBtn text={'Repor'} light onClick={() => ClearFilters()} />
            </Grid>
          </Grid>
        </Content>
        {/* Projects */}
        <Content>
          <Box id='pad' sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant='title'>{breadcrumbsPath[0].title}</Typography>
            <PrimaryBtn
              hidden={!(isInternalPage && CanDo('add_project'))}
              text='Adicionar'
              href={routes.private.internal.newProject}
            />
          </Box>
          <AdvancedTable
            rows={items}
            headCells={headCellsProjects}
            filters={filters}
            onCancel={onCancelProject}
            clickRoute={CanDo('see_project') && detailPage}
            editRoute={CanDo('update_project') && editPage}
            setFilters={setFilters}
            onDelete={ CanDo('delete_project') && onDeleteItem}
            onReactivation={onReactivationItem}
          />
        </Content>
      </Grid>
      <Footer/>
    </>
  );
};

ProjectsScreen.propTypes = {
  breadcrumbsPath: PropTypes.array,
  detailPage: PropTypes.string,
  cards: PropTypes.array,
  clients: PropTypes.array,
  editPage: PropTypes.string,
  headCellsProjects: PropTypes.array,
  items: PropTypes.array,
};

export default ProjectsScreen;
