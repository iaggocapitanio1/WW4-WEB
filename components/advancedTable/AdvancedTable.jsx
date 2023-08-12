/* eslint-disable react/prop-types */
/* eslint-disable consistent-return */
/* eslint-disable no-return-assign */
/* eslint-disable array-callback-return */
/* eslint-disable no-case-declarations */
// Node modules
import Router from 'next/router';
import React, { useEffect, useState } from 'react';

//  PropTypes

//  Material Ui
import {
  Box,
  Chip, Grid,
  IconButton, MenuItem, Pagination, Paper,
  Popover,
  Skeleton,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  TextField, Tooltip, Typography
} from '@mui/material';

//  Icons
import { Filter } from 'lucide-react';

//  Utlis
import { FilterItem } from '../utils/FilterItem';
import { MultiFilterArray } from '../utils/MultiFilterArray';

//  Dialogs
import ConfirmDialog from '../dialogs/ConfirmDialog';
import Notification from '../dialogs/Notification';

//  Navigation
import routes from '../../navigation/routes';

//  Utils
import Link from 'next/link';
import { useSelector } from 'react-redux';
import DisplayActionButtons from './components/DisplayActionButtons';
import EnhancedTableHead from './components/EnhancedTableHead';

const AdvancedTable = ({
  rows,
  headCells,
  clickRoute,
  actionId,
  noPagination,
  editRoute,
  filters,
  setFilters,
  rangeFilters,
  setRangeFilters,
  onDelete,
  onReactivation,
  onCancel
}) => {
  const [state, setState] = useState({
    order: 'asc',
    orderBy: headCells[0].id,
    page: 0,
    rowsPerPage: 10,
    rows,
    filteredItems: rows,
    data: {},
    deleteItemId: '',
    dialogOpen: false,
    dialogOpenReactivation: false,
    dialogMessage: '',
    anchorEl: null,
    cellsFilter: headCells,
    loaded: true,
    rowsPerPageOptions: [10, 25, 50]
  });

  const reduxState = useSelector((state) => state);

  useEffect(() => {
    const getData = async () => {
      const allData = {
        clients: reduxState.clients?.data
      };

      setState({ ...state, data: allData });
    };

    const getWhatDisplaying = () => {
      switch (Router.route) {
      case routes.private.internal.projects:

        break;
      case routes.private.internal.similarProjects:
        setState({ ...state, dialogMessage: 'Está prestes a apagar um projeto o que é irreversível, tem certeza que quer continuar?' });

        break;
      case routes.private.internal.stocks:

        break;
      case routes.private.internal.clients:
        setState({ ...state, dialogMessage: 'Está prestes a apagar um cliente o que é irreversível, tem certeza que quer continuar?' });

        break;
      case routes.private.internal.workers:
        setState({ ...state, dialogMessage: 'Está prestes a apagar um utilizador o que é irreversível, tem certeza que quer continuar?' });

        break;
      }
    };

    function RebuildHeadCellsWithFilterState () {
      setState((prevState) => ({
        ...prevState,
        cellsFilter: prevState.cellsFilter.map((cell) => ({
          ...cell,
          show: true,
        })),
      }));
    }

    Promise.all([getData(), RebuildHeadCellsWithFilterState(), getWhatDisplaying()]).then(() => {
      setState({ ...state, loaded: true });
    });
  }, []);

  function onDeleteClick (row) {
    setState({ ...state, dialogOpen: true, deleteItemId: row.id });
  }

  function onReactivationClick (row) {
    setState({ ...state, dialogOpenReactivation: true, deleteItemId: row.id });
  }

  function OnFilterChange (i) {
    const oldState = state.cellsFilter;
    const newState = state.cellsFilter[i];

    newState.show = !newState.show;
    oldState[i] = newState;
    setState({ ...state, cellsFilter: oldState });
  }

  function showAllHeaders () {
    setState((prevState) => ({
      ...prevState,
      cellsFilter: prevState.cellsFilter.map((cell) => ({
        ...cell,
        show: true,
      })),
    }));
  }

  const handleRequestSort = (event, property) => {
    const isAsc = state.orderBy === property && state.order === 'asc';

    setState({ ...state, order: isAsc ? 'desc' : 'asc', orderBy: property });
  };

  const handleChangePage = (event, newPage) => {
    setState({ ...state, page: newPage });
  };

  const handleChangeRowsPerPage = (event) => {
    setState({ ...state, page: 0, rowsPerPage: parseInt(event.target.value, 10) });
  };

  function descendingComparator (a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }

    if (b[orderBy] > a[orderBy]) {
      return 1;
    }

    return 0;
  }

  function getComparator (order, orderBy) {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  function stableSort (array, comparator) {
    const stabilizedThis = array?.map((el, index) => [el, index]);

    stabilizedThis?.sort((a, b) => {
      const order = comparator(a[0], b[0]);

      if (order !== 0) return order;

      return a[1] - b[1];
    });

    return stabilizedThis?.map((el) => el[0]);
  }

  function filterByProperties (array, filters) {
    return array.filter(item => {
      return Object.keys(filters).every(key => {
        const { values, min, max } = filters[key];
        const value = item[key];

        return value >= min && value <= max && value >= values[0] && value <= values[1];
      });
    });
  }

  useEffect(() => {
    if (filters || rangeFilters) {
      const filtered2 = rangeFilters ? filterByProperties(rows, rangeFilters) : rows;
      const filtered = MultiFilterArray(filtered2, filters);

      setState({ ...state, filteredItems: filtered });
    } else {
      setState({ ...state, filteredItems: state.rows });
    }
  }, [filters, rows, rangeFilters]);

  useEffect(() => {
    setState({ ...state, page: 0 });
  }, [state.rowsPerPage]);

  function onFilterRemove (filterName) {
    const filtersToWork = { ...filters };

    delete filtersToWork[filterName];
    setFilters(filtersToWork);
  }

  function onFilterSizeRemove (filterName) {
    const rangeFiltersToWork = { ...rangeFilters };

    rangeFiltersToWork[filterName].values = [rangeFiltersToWork[filterName].min, rangeFiltersToWork[filterName].max];
    setRangeFilters(rangeFiltersToWork);
  }

  const CustomTablePagination = () => {
    return <Box display="flex" alignItems="center" justifyContent="end" sx={{ width: '100%' }} >
      <Box display="flex" alignItems="center" justifyContent="end" p={1}>
        <Grid container md={12} sm={12} xs={12}>
          <Grid container md={4} sm={4} xs={12}
            alignItems={'center'}
            justifyContent={{ md: 'start', sm: 'start', xs: 'center' }}
          >
            <Box display={'flex'} justifyContent={{ md: 'start', sm: 'start', xs: 'center' }} sx={{ alignItems: 'center', minWidth: '200px' }}>
              <Typography variant="subtitle2" pr={1}>Mostrar </Typography>
              <TextField
                value={state.rowsPerPage}
                variant="standard"
                select
                InputProps={{ disableUnderline: true }}
                onChange={(e) => setState({ ...state, rowsPerPage: e.target.value })}
              >
                {state.rowsPerPageOptions.map((row) => (
                  <MenuItem key={row} value={row}>
                    <Typography variant='sm'>{row}</Typography>
                  </MenuItem>
                ))}
              </TextField>
              <Typography variant="subtitle2" pl={1} pr={1}>
                {
                  state.page === 0
                    ? `${state.filteredItems.length > 0 ? '1' : '0'} - ${Math.min(state.rowsPerPage, state.filteredItems.length)} de ${state.filteredItems.length}`
                    : `${state.page * state.rowsPerPage + 1} - ${Math.min((state.page + 1) * state.rowsPerPage, state.filteredItems.length)} de ${state.filteredItems.length}`
                }
              </Typography>
            </Box>

          </Grid>
          <Grid container md={8} sm={8} xs={12} alignItems={'center'} justifyContent={{ md: 'end', sm: 'end', xs: 'center' }}>
            {!noPagination && (
              <Pagination
                siblingCount={1}
                boundaryCount={0}
                pl={1}
                variant="outlined"
                count={Math.ceil(state.filteredItems.length / state.rowsPerPage)}
                rowsPerPage={state.rowsPerPage}
                page={state.page + 1 || 1}
                showLastButton
                showFirstButton
                onChange={(e, p) => setState({ ...state, page: p - 1 })}
                color="primary"
                sx={{ border: '0px solid', borderColor: 'lightGray.edges', pb: 0.2, pt: 0.2, borderRadius: '20px' }}

              />
            )}
          </Grid>
        </Grid>
      </Box>
    </Box>;
  };

  return (
    <Box sx={{ width: '100%' }}>
      <ConfirmDialog
        open={state.dialogOpen}
        handleClose={() => setState({ ...state, dialogOpen: false })}
        onConfirm={() => {
          !!onDelete && onDelete(state.deleteItemId);
          setState({ ...state, dialogOpen: false });
        }}
        message={state.dialogMessage}
      />
      <ConfirmDialog
        open={state.dialogOpenReactivation}
        handleClose={() => setState({ ...state, dialogOpenReactivation: false }) }
        onConfirm={() => {
          !!onReactivation && onReactivation(state.deleteItemId);
          setState({ ...state, dialogOpenReactivation: false });
        } }
        message={'Está prestes a fazer uma reabertura. Tem certeza que quer continuar?'}
      />

      <Notification />
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Box className='tableChips'>
          <Box>
            {false && Object.keys(filters || {})?.map((x) => {
              if (filters[x]) return <Chip key={x} label={x} onDelete={() => onFilterRemove(x)} />;
            })}
            {false && Object.keys(rangeFilters || {})?.map((x) => {
              if (JSON.stringify(rangeFilters[x].values) !== JSON.stringify([rangeFilters[x].min, rangeFilters[x].max])) return <Chip key={x} label={x} onDelete={() => onFilterSizeRemove(x)} />;
            })}

          </Box>
          {noPagination
            ? null
            : state.loaded
              ? <>
                <CustomTablePagination />

                {false && <TablePagination
                  showFirstButton
                  showLastButton
                  component='div'
                  sx={{ marginLeft: 'auto' }}
                  rowsPerPageOptions={state.rowsPerPageOptions}
                  count={state.filteredItems ? state.filteredItems?.length : state.filteredItems?.length}
                  rowsPerPage={state.rowsPerPage}
                  page={state.page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  labelRowsPerPage={'Mostrar'}
                  labelDisplayedRows={({ count, from, to }) => {
                    return `${from} - ${to} de ${count}`;
                  }}
                />}
                <Box display='flex' justifyContent={{ md: 'start', sm: 'start', xs: 'center' }}>
                  <Tooltip title='Filtrar colunas'>
                    <IconButton onClick={(e) => setState({ ...state, anchorEl: e.currentTarget })}>
                      <Filter size={20} strokeWidth={1.5} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </>
              : <Skeleton animation="wave" width='100%' />
          }
          <Popover
            open={Boolean(state.anchorEl)}
            anchorEl={state.anchorEl}
            onClose={() => setState({ ...state, anchorEl: null })}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
            <Box p={1}>
              <Grid container>
                <Grid >
                  <Grid id='align' container Item sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Switch checked={!state.cellsFilter.find(item => item.show === false)} onClick={() => showAllHeaders()} />Mostrar todas
                  </Grid>
                  {state.cellsFilter.map((headCell, i) => {
                    return <Grid id='align' container item key={headCell.label} >
                      <Switch checked={headCell.show} onClick={() => OnFilterChange(i)} />{headCell.label}
                    </Grid>;
                  })}
                </Grid>
              </Grid>
            </Box>
          </Popover>
        </Box>
        <TableContainer >
          <Table aria-labelledby='tableTitle'>
            <EnhancedTableHead
              order={state.order}
              orderBy={state.orderBy}
              onRequestSort={handleRequestSort}
              rowCount={state.filteredItems?.length}
              state={state}
            />
            {state.filteredItems && <TableBody>
              {(stableSort(state.filteredItems, getComparator(state.order, state.orderBy)))
                .slice(state.page * state.rowsPerPage, state.page * state.rowsPerPage + state.rowsPerPage)
                .map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;

                  function clickPath () {
                    if (!clickRoute) return;

                    //  Verifies if im in a internal page
                    const isInternalPage = Object.values(routes.private.internal).includes(Router.route.replace('[Id]', ''));

                    //  Verifies if im in a internal page AND in a projects section
                    if (isInternalPage && Router.route.includes('projects')) {
                      return (`${row.id.includes('urn:ngsi-ld:Budget:') ? routes.private.internal.budget : routes.private.internal.project}${row[actionId || 'id']}`);
                    //  Verifies if im NOT in a internal page AND in a projects section
                    } else if (!isInternalPage && Router.route.includes('projects')) {
                      return (`${row.id.includes('urn:ngsi-ld:Budget:') ? routes.private.budget : routes.private.project}${row[actionId || 'id']}`);
                    //  if its not on a projects section, just use the click route
                    }

                    return (`${clickRoute}${row[actionId || 'id']}`);
                  }

                  return (
                    <TableRow
                      hover
                      role='checkbox'
                      tabIndex={-1}
                      key={row.id}
                    >
                      {state.cellsFilter.map((headCell) => {
                        const href = clickPath();

                        return headCell.show && <TableCell
                          id={labelId}
                          key={headCell.id}
                          align={headCell.numeric ? 'right' : 'left'}
                          padding={
                            headCell.disablePadding ? 'none' : 'normal'
                          }
                          href={href}
                          component={href && headCell.id !== 'actions' && Link}
                          sx={{
                            borderRight: headCell.borderRight && '1px solid var(--grayEdges)',
                            borderLeft: headCell.borderLeft && '1px solid var(--grayEdges)',
                            padding: headCell.id !== 'actions' && 2,
                            paddingLeft: !headCell.disablePadding && 1,
                            paddingRight: !headCell.disablePadding && 1,
                          }}
                        >
                          {state.loaded
                            ? <>
                              {headCell.id === 'actions'
                                ? (
                                  <DisplayActionButtons
                                    headCell={headCell}
                                    editRoute={editRoute}
                                    Router={Router}
                                    row={row}
                                    onReactivation={onReactivation}
                                    onReactivationClick={onReactivationClick}
                                    onCancel={onCancel}
                                    onDelete={onDelete}
                                    onDeleteClick={onDeleteClick}
                                  />
                                )
                                : FilterItem(state.data, row, headCell.id)}
                            </>
                            : <Skeleton animation="wave" width='100%' />}
                        </TableCell>;
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>}

          </Table>
        </TableContainer>
      </Paper>
    </Box >
  );
};

export default AdvancedTable;
