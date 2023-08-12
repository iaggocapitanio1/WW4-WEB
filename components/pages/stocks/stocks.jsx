//  Nodes
import CssBaseline from '@mui/material/CssBaseline';
import React, { useState } from 'react';

import CustomBreadcrumbs from '../../breadcrumbs';

import PrimaryBtn from '../../buttons/primaryBtn';
import Content from '../../content/content';
//  PropTypes
import { Autocomplete, Box, Grid, InputLabel, Slider, TextField, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import routes from '../../../navigation/routes';
import AdvancedTable from '../../advancedTable/AdvancedTable';
import MyInput from '../../inputs/myInput';
import MySelect from '../../inputs/select';
import Footer from '../../layout/footer/footer';
import Navbar from '../../layout/navbar/navbar';
import CanDo from '../../utils/CanDo';
import ToastSet from '../../utils/ToastSet';

const Stock = ({ ...props }) => {
  const { breadcrumbsPath, headCells } = props;

  //  States
  const [filters, setFilters] = useState({
    available: '',
    material: '',
    warehouse: ''
  });

  const [stocks, setStocks] = useState(props.stocks);
  const [sizesFilter, setSizesFilter] = useState(props.filtersSizes);

  function onMaterialChange ({ value, event }) {
    if (typeof value === 'object') setFilters({ ...filters, material: value?.material || '' });
    else if (typeof value === 'undefined') setFilters({ ...filters, material: event.target.value || '' });
  }

  const ClearFilters = () => {
    setSizesFilter({
      Largura: {
        values: [Math.min(...stocks.map(o => o.width)), Math.max(...stocks.map(o => o.width))],
        min: Math.min(...stocks.map(o => o.width)),
        max: Math.max(...stocks.map(o => o.width))
      },
      Espessura: {
        values: [Math.min(...stocks.map(o => o.thickness)), Math.max(...stocks.map(o => o.thickness))],
        min: Math.min(...stocks.map(o => o.thickness)),
        max: Math.max(...stocks.map(o => o.thickness))
      },
      Comprimento: {
        values: [Math.min(...stocks.map(o => o.height)), Math.max(...stocks.map(o => o.height))],
        min: Math.min(...stocks.map(o => o.height)),
        max: Math.max(...stocks.map(o => o.height))
      },
    });

    setFilters({
      available: '',
      material: '',
      warehouse: ''
    });
  };

  function onFilterChange (props) {
    const sizes = { ...sizesFilter };

    // eslint-disable-next-line react/prop-types
    sizes[props.e.target.name].values = props.e.target.value;
    setSizesFilter(sizes);
  }

  function SliderValueLabel (value) {
    return value + ' mm';
  }

  async function onDelete (props) {
    const loading = toast.loading('');

    ToastSet(loading, 'Cliente Removido!', 'error');

    const old = [...stocks];
    const index = old.findIndex((item) => item.id === props);

    if (index !== -1) {
      const updatedItems = [...old];

      updatedItems.splice(index, 1);
      setStocks(updatedItems);
      ToastSet(loading, 'Stock Removido.', 'success');
    }
  }

  return (
    <>
      <Navbar />
      <Grid component='main' sx={{ padding: '0rem 2rem 4rem 2rem' }}>
        <CssBaseline />
        <CustomBreadcrumbs path={breadcrumbsPath} />
        <Content>
          <Grid container md={12} id='pad'>
            <Grid container md={12} sm={12} xs={12} >
              <Typography className='headerTitleSm'>Filtros</Typography>
            </Grid>
            <Grid container md={4} sm={6} xs={12} p={1}>
              <InputLabel htmlFor='name'>Material</InputLabel>
              <Autocomplete
                options={([...stocks])?.sort((a, b) => a.material - b.material) }
                fullWidth
                getOptionLabel={(option) => option.material}
                onChange={(event, value) => onMaterialChange({ value, event })}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    onChange={(event, value) => onMaterialChange({ event, value })}
                  />
                )}
              />
            </Grid>
            <Grid container md={4} sm={6} xs={12} p={1} >
              <MySelect label={'Estado'} value={filters.available} options={[{ id: true, label: 'Disponível' }, { id: false, label: 'Indisponivel' }]} onChange={(e) => setFilters({ ...filters, available: e.target.value })} />
            </Grid>
            <Grid container md={4} sm={6} xs={12} p={1}>
              <MyInput label="Armazem" value={filters.warehouse} onChange={(e) => setFilters({ ...filters, warehouse: e.target.value })}/>
            </Grid>
            <Grid container md={4} sm={6} xs={12} p={1} pl={2} pr={2}>
              <InputLabel>Comprimento</InputLabel>
              <Box sx={{ width: '100%', display: 'flex' }} justifyContent='center'>
                <Slider
                  getAriaLabel={() => 'Width range'}
                  value={sizesFilter.Comprimento.values}
                  name='Comprimento'
                  onChange={(e) => onFilterChange({ e })}
                  disableSwap
                  max={sizesFilter.Comprimento.max}
                  min={sizesFilter.Comprimento.min}
                  sx={{ width: '90%' }}
                  valueLabelDisplay="none"
                  step={sizesFilter.Comprimento.max / 10}
                  valueLabelFormat={value => <>{SliderValueLabel(value)}</>}
                  marks={[
                    {
                      value: sizesFilter.Comprimento.min,
                      label: `${sizesFilter.Comprimento.values[0]} mm`
                    },
                    {
                      value: sizesFilter.Comprimento.max,
                      label: `${sizesFilter.Comprimento.values[1]} mm`
                    },
                  ]}
                />
              </Box>
            </Grid>
            <Grid container md={4} sm={6} xs={12} p={1} pl={2} pr={2}>
              <InputLabel>Largura</InputLabel>
              <Box sx={{ width: '100%', display: 'flex' }} justifyContent='center'>
                <Slider
                  getAriaLabel={() => 'Width range'}
                  value={sizesFilter.Largura.values}
                  name='Largura'
                  onChange={(e) => onFilterChange({ e })}
                  disableSwap
                  max={sizesFilter.Largura.max}
                  min={sizesFilter.Largura.min}
                  sx={{ width: '90%' }}
                  valueLabelDisplay="none"
                  step={sizesFilter.Largura.max / 10}
                  valueLabelFormat={value => <>{SliderValueLabel(value)}</>}
                  marks={[
                    {
                      value: sizesFilter.Largura.min,
                      label: `${sizesFilter.Largura.values[0]} mm`
                    },
                    {
                      value: sizesFilter.Largura.max,
                      label: `${sizesFilter.Largura.values[1]} mm`
                    },
                  ]}
                />
              </Box>
            </Grid>
            <Grid container md={4} sm={6} xs={12} p={1} pl={2} pr={2}>
              <InputLabel>Espessura</InputLabel>
              <Box sx={{ width: '100%', display: 'flex' }} justifyContent='center'>
                <Slider
                  getAriaLabel={() => 'Width range'}
                  value={sizesFilter.Espessura.values}
                  name='Espessura'
                  onChange={(e) => onFilterChange({ e })}
                  disableSwap
                  max={sizesFilter.Espessura.max}
                  min={sizesFilter.Espessura.min}
                  sx={{ width: '90%' }}
                  valueLabelDisplay="none"
                  step={sizesFilter.Espessura.max / 10}
                  valueLabelFormat={value => <>{SliderValueLabel(value)}</>}
                  marks={[
                    {
                      value: sizesFilter.Espessura.min,
                      label: `${sizesFilter.Espessura.values[0]} mm`
                    },
                    {
                      value: sizesFilter.Espessura.max,
                      label: `${sizesFilter.Espessura.values[1]} mm`
                    },
                  ]}
                />
              </Box>
            </Grid>
            <Grid container md={12} sm={12} xs={12} justifyContent='end'>
              <PrimaryBtn text='Limpar' light onClick={ClearFilters} />
            </Grid>
          </Grid>
        </Content>
        <Content>
          <Box
            id='pad'
            className='flex'
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <Box>
              <Typography variant='title'>{breadcrumbsPath[0].title}</Typography>
            </Box>
            <PrimaryBtn
              hidden={!CanDo('add_stock')}
              text='Adicionar'
              href={routes.private.internal.newStock}
            />
          </Box>
          <AdvancedTable
            rows={stocks}
            headCells={headCells}
            clickRoute={CanDo('see_stock') && routes.private.internal.stock}
            editRoute={CanDo('update_stock') && routes.private.internal.editStock}
            filters={filters}
            setFilters={setFilters}
            rangeFilters={sizesFilter}
            setRangeFilters={setSizesFilter}
            onDelete={CanDo('delete_stock') && onDelete}
          />
        </Content>
      </Grid>
      <Footer/>
    </>
  );
};

Stock.propTypes = {
  breadcrumbsPath: PropTypes.array,
  headCells: PropTypes.array,
  stocks: PropTypes.array,
  filtersSizes: PropTypes.object
};

export default Stock;
