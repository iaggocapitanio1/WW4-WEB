/* eslint-disable array-callback-return */
/* eslint-disable react/prop-types */
//  Nodes
import Router from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';

//  Material Ui
import { ButtonGroup, Grid, Typography } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';

//  Icons
import { Save, X } from 'lucide-react';

//  Actions
//  Page Component Styles

//  Breadcrumbs Component
import CustomBreadcrumbs from '../../breadcrumbs';

//  Custom Components
import PrimaryBtn from '../../buttons/primaryBtn';
import Content from '../../content/content';

//  Dialogs
import { toast } from 'react-toastify';
import ConfirmDialog from '../../dialogs/ConfirmDialog';
import Notification from '../../dialogs/Notification';

//  Loader
import Loader from '../../loader/loader';

//  Utils
import { useDropzone } from 'react-dropzone';

//  Device "Detector"
import moment from 'moment';
import { useDispatch } from 'react-redux';
import * as budgetsActionsRedux from '../../../store/actions/budget';
import * as furnituresActionsRedux from '../../../store/actions/furniture';
import * as projectsActionsRedux from '../../../store/actions/project';

import routes from '../../../navigation/routes';
import Footer from '../../layout/footer/footer';
import Navbar from '../../layout/navbar/navbar';
import ConvertFilesToObj from '../../utils/ConvertFilesToObj';
import ConvertString from '../../utils/ConvertString';
import ToastSet from '../../utils/ToastSet';
import ObservationsTab from './Tabs/observationsTab';
import ProductLinesTab from './Tabs/productLinesTab';
import RequestTab from './Tabs/requestTab';

const EditBudget = ({ ...props }) => {
  const { breadcrumbsPath, pageProps, clients, budget, budgets } = props;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState();
  const [linesErrors, setLinesErrors] = useState({ group: false, subGroup: false, item: false });
  const dispatch = useDispatch();
  const updateProject = (data) => dispatch(projectsActionsRedux.updateProject(data));
  const updateBudget = (data) => dispatch(budgetsActionsRedux.updateBudget(data));
  const newFurniture = (data) => dispatch(furnituresActionsRedux.newFurniture(data));
  const updateFurniture = (data) => dispatch(furnituresActionsRedux.updateFurniture(data));
  const deleteFurniture = (data) => dispatch(furnituresActionsRedux.deleteFurniture(data));

  const onDrop = useCallback(acceptedFiles => {
    // Do something with the files
    const obj = ConvertFilesToObj(acceptedFiles);

    setUploadedFiles(obj);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, noClick: false });

  const [budgetData, setBudgetData] = useState({
    num: { value: budget?.num?.value, error: '', required: true },
    name: { value: budget?.name?.value, error: '', required: true },
    obs: { value: ConvertString(budget?.obs?.value), type: 'area' },
    price: { value: budget?.price?.value, error: '' },
    client: { value: budget?.orderBy?.object.id, error: '', required: true },
    dateRequest: { value: moment(budget?.dateRequest?.value, 'DD/MM/YYYY'), error: '', required: true, type: 'date' },
    dateDelivery: { value: moment(budget?.dateDelivery?.value, 'DD/MM/YYYY'), error: '', required: false, type: 'date' },
    dateAgreedDelivery: { value: moment(budget?.dateAgreedDelivery?.value, 'DD/MM/YYYY'), error: '', required: true, type: 'date' },
    dateDeliveryProject: { value: moment(budget?.dateDeliveryProject?.value, 'DD/MM/YYYY'), error: '', required: false, type: 'date' },
    streetAddress: { value: budget?.deliveryAddress?.value?.streetAddress, error: '', required: true },
    postalCode: { value: budget?.deliveryAddress?.value?.postalCode, error: '', required: true },
    addressLocality: { value: budget?.deliveryAddress?.value?.addressLocality, error: '', required: true },
    addressRegion: { value: budget?.deliveryAddress?.value?.addressRegion, error: '', required: false },
    addressCountry: { value: budget?.deliveryAddress?.value?.addressCountry, error: '', required: true },
  });

  const [lines, setLines] = useState(props.furnitures2);

  useEffect(() => {
    let totalPrice = 0;
    let totalAmount = 0;

    lines.map((group) => {
      group.subGroups?.map((subgroup) => {
        subgroup.items.map(item => {
          totalPrice += Number((String(item?.price?.value) || '0€')?.replace(/ /g, '').replace(/€/g, ''));
          totalAmount += Number(item?.amount?.value);
        });
      });
    });

    budgetData.price.value = totalPrice;
    setBudgetData({ ...budgetData, price: { ...budgetData.price, value: totalPrice }, amount: { ...budgetData.price, value: totalAmount } });
  }, [lines]);

  function onBudgetChange (props) {
    const data = { ...budgetData };

    if (data[props.name]?.type === 'date') {
      const date = moment(props.value);

      if (date.isValid()) {
        data[props.name].error = '';
      } else {
        data[props.name].error = 'Data Invalida';
      }
    } else data[props.name].error = '';

    if (props.name === 'category') {
      if (data[props.name].value === '' || data.name.value === '') data.name.value = props.value + data.name.value;
      else data.name.value = data.name.value.replace(data.category?.value, props.value);

      data.name.error = '';
    }

    if (props.name === 'client') {
      const client = clients.find(ele => ele.id === props.value);

      data.postalCode.error = '';
      data.streetAddress.error = '';
      data.postalCode.value = client?.address?.postalCode;
      data.streetAddress.value = client?.address?.streetAddress || '';
      data.addressLocality.value = client?.address?.addressLocality;
      data.addressRegion.value = client?.address?.addressRegion;
      data.addressCountry.value = client?.address?.addressCountry;

      if (data.name.error === 'Este cliente, já tem 1 projeto com este nome') data.name.error = '';
    }

    data[props.name].value = props.value;
    setBudgetData(data);
  }

  function ValidateLines () {
    const obj = [...lines];
    let hasErrors = false;

    if (lines.length === 0) {
      toast.error('Tem que ter pelo menos 1 grupo.'); hasErrors = true;
      setLinesErrors({ ...linesErrors, group: true });

      return true;
    } else if (lines[0].subGroups.length === 0) {
      toast.error('Tem que ter pelo menos 1 subgrupo.'); hasErrors = true;
      setLinesErrors({ ...linesErrors, subGroup: true });

      return true;
    } else if (lines[0].subGroups[0].items.length === 0) {
      toast.error('Tem que ter pelo menos 1 móvel ou acessório.'); hasErrors = true;
      setLinesErrors({ ...linesErrors, item: true });

      return true;
    }

    //  if there are 0 items in the 1st group, return true = errors
    if (obj[0]?.subGroups?.length === 0 || typeof obj[0]?.subGroups === 'undefined') return true;

    obj.map((group) => {
      group.subGroups.map((subgroup) => {
        subgroup.items.map((item) => {
          Object.entries(item).forEach(([, value]) => {
            if (typeof value === 'object' && 'error' in value && (value.value === '' || value.value === '0') && value.required) {
              value.error = 'Campo obrigatorio';
              hasErrors = true;
            } else if (typeof value === 'object' && 'error' in value) {
              value.error = '';
            }
          });
        });
      });
    });

    setLines(obj);
    hasErrors && toast.error('Erros no formulário');

    return hasErrors;
  }

  function ValidateData () {
    let hasErrors = false;
    const data = { ...budgetData };

    Object.keys(budgetData).map((prop) => {
      if (data[prop].value !== '' && data[prop].value !== undefined && data[prop].required) {
        if (data[prop]?.type === 'date') {
          const date = moment(data[prop].value);

          if (date.isValid()) data[prop].error = '';
          else {
            data[prop].error = 'Data Invalida';
            hasErrors = true;
          }
        }
      } else if (data[prop].required) {
        data[prop].error = 'Campo Obrigatório';
        hasErrors = true;
      }
    });

    if (budgets.find((ele) => ele.orderBy.object === ('urn:ngsi-ld:Owner:' + budgetData.client.value) && ele.name.value === budgetData.name.value) && budgetData.name.value !== budget.name.value) {
      data.name.error = 'Este cliente, já tem 1 projeto com este nome';
      hasErrors = true;
    }

    if (hasErrors) {
      toast.error('Erros no formulário');
      setBudgetData(data);

      return !hasErrors;
    }

    if (ValidateLines()) return false;

    handleSave();

    return !hasErrors;
  }

  function ClearAll () {
    setSuccessOpen(false);
  }

  const successModalProps = {
    open: successOpen,
    handleClose: ClearAll,
    message: 'Projeto criado com sucesso, que deseja fazer agora?',
    icon: 'Verified',
    iconType: 'success',
    okTxt: 'Ver projeto',
    cancelTxt: 'Criar novo projeto',
  };

  function formatString (str) {
    // Replace all spaces with underscores
    str = str?.replace(/ /g, '_');
    // Replace accented characters
    str = str?.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    // Replace all non-alphanumeric characters except for underscores
    str = str?.replace(/[^a-zA-Z0-9_]/g, '');

    return str;
  }

  async function UpdateBudgetData () {
    const onlyValues = {};

    Object.keys(budgetData).map((key) => { onlyValues[key] = { value: budgetData[key].value, type: 'Property' }; });

    const built = {
      ...onlyValues,
      type: 'Budget',
      approvedDate: { type: 'Property', value: moment().format('DD/MM/YYYY') },
      dateDeliveryProject: { type: 'Property', value: moment(onlyValues.dateDeliveryProject?.value).format('DD/MM/YYYY') !== 'Invalid date' ? moment(onlyValues.dateDeliveryProject?.value).format('DD/MM/YYYY') : '' },
      dateDelivery: { type: 'Property', value: moment(onlyValues.dateDelivery?.value).format('DD/MM/YYYY') !== 'Invalid date' ? moment(onlyValues.dateDelivery?.value).format('DD/MM/YYYY') : '' },
      dateRequest: { type: 'Property', value: moment(onlyValues.dateRequest?.value).format('DD/MM/YYYY') !== 'Invalid date' ? moment(onlyValues.dateRequest?.value).format('DD/MM/YYYY') : '' },
      dateAgreedDelivery: { type: 'Property', value: moment(onlyValues.dateAgreedDelivery?.value).format('DD/MM/YYYY') !== 'Invalid date' ? moment(onlyValues.dateAgreedDelivery?.value).format('DD/MM/YYYY') : '' },
      amount: { type: 'Property', value: '0' },
      deliveryAddress: {
        type: 'Property',
        value: {
          postalCode: budgetData.postalCode.value,
          streetAddress: budgetData.streetAddress.value,
          addressLocality: budgetData.addressLocality.value,
          addressRegion: budgetData.addressRegion.value,
          addressCountry: budgetData.addressCountry.value,
        }
      },
      price: { value: String(onlyValues.price?.value)?.replace(/ /g, '').replace(/€/g, ''), type: 'Property' },
    };

    delete built.client;
    delete built.postalCode;
    delete built.streetAddress;
    delete built.addressLocality;
    delete built.addressRegion;
    delete built.addressCountry;
    await updateBudget({ id: budget.id, data: built }).catch((err) => console.log(err));
  }

  async function handleSave () {
    const loading = toast.loading();

    const currentItems = lines.map(group => {
      const items = [{
        id: group.id,
        furnitureType: { type: 'Property', value: 'group' },
        name: { type: 'Property', value: formatString(group.name.value).replace(/_/g, ' ') },
        hasBudget: { object: budget.id, type: 'Relationship' },
        type: 'Furniture'
      }];

      delete items[0].subGroups;

      const lines = group.subGroups?.map(subgroup => {
        //  Aqui tenho cada subgrupo com os items dentro

        const items = [{
          id: subgroup.id,
          furnitureType: { type: 'Property', value: 'subGroup' },
          name: { type: 'Property', value: formatString(subgroup.name.value).replace(/_/g, ' ') },
          hasBudget: { object: budget.id, type: 'Relationship' },
          group: { value: group.name.value, type: 'Property' },
          type: 'Furniture',

        }];

        delete items[0].items;

        const items2 = subgroup.items.map((item) => {
          const valuesOnly = {};

          Object.keys(item).map(key => {
            valuesOnly[key] = {
              type: 'Property',
              value: typeof item[key].value !== 'undefined' ? item[key].value : item[key]
            };
          });

          valuesOnly.id = item.id;
          valuesOnly.type = 'Furniture';
          valuesOnly.name = { ...valuesOnly.name, value: formatString(valuesOnly.name.value).replace(/_/g, ' ') };
          valuesOnly.subGroup = { value: subgroup.name.value, type: 'Property' };
          valuesOnly.group = { value: group.name.value, type: 'Property' };
          valuesOnly.hasBudget = { object: budget.id, type: 'Relationship' };
          valuesOnly.produced = { value: false, type: 'Property' };
          valuesOnly.assembled = { value: false, type: 'Property' };

          return valuesOnly;
        });

        return items.concat(...items2);
      });

      return items.concat(...lines);
    });

    const oldItems = props.furnitures2.map(group => {
      const items = [{
        id: group.id,
        furnitureType: { type: 'Property', value: 'group' },
        name: { type: 'Property', value: group.name.value },
        hasBudget: { object: budget.id, type: 'Relationship' },
        type: 'Furniture'
      }];

      delete items[0].subGroups;

      const lines = group.subGroups?.map(subgroup => {
        //  Aqui tenho cada subgrupo com os items dentro

        const items = [{
          id: subgroup.id,
          furnitureType: { type: 'Property', value: 'subGroup' },
          name: { type: 'Property', value: subgroup.name.value },
          hasBudget: { object: budget.id, type: 'Relationship' },

          type: 'Furniture'
        }];

        delete items[0].items;

        const items2 = subgroup.items.map((item) => {
          const valuesOnly = {};

          Object.keys(item).map(key => {
            valuesOnly[key] = {
              type: 'Property',
              value: typeof item[key].value !== 'undefined' ? item[key].value : item[key]
            };
          });

          valuesOnly.id = item.id;
          valuesOnly.type = 'Furniture';
          valuesOnly.subGroup = { value: subgroup.name.value, type: 'Property' };
          valuesOnly.group = { value: group.name.value, type: 'Property' };
          valuesOnly.hasBudget = { object: budget.id, type: 'Relationship' };

          return valuesOnly;
        });

        return items.concat(...items2);
      });

      return items.concat(...lines);
    });

    const currentItemsArray = currentItems.reduce((mergedArray, array) => mergedArray.concat(array), []).map((item, index) => {
      return {
        ...item,
        lineNumber: { value: index, type: 'Property' },
        id: item.id || 'urn:ngsi-ld:Furniture:' + formatString(budgetData.name.value) + '_' + formatString(item.group.value) + '_' + formatString(item.subGroup.value) + '_' + formatString(item.name.value) + moment().diff(moment().startOf('day'), 'seconds') + '_new',
      };
    });

    const mergedArrayOld = oldItems.reduce((mergedArray, array) => mergedArray.concat(array), []).map((item, index) => {
      return { ...item, lineNumber: { value: index, type: 'Property' }, id: item.id || 'urn:ngsi-ld:Furniture:' + formatString(budgetData.name.value) + '_' + index + '_new' };
    });

    const toDelete = mergedArrayOld.filter((row1) => {
      const index = currentItemsArray.findIndex((row2) => row2.id === row1.id);

      return index === -1;
    });

    const toCreate = currentItemsArray
      .filter((ele) => ele.id?.includes('_new'))
      .map((ele) => ({ ...ele, id: ele.id.replace('_new', '') }));

    const toUpdate = currentItemsArray.filter((row1) => {
      const index = mergedArrayOld.find((row2) => row2.id === row1.id);

      if ((JSON.stringify(row1) !== JSON.stringify(index)) && !row1.id.includes('_new')) {
        return row1;
      }

      return !row1.id.includes('_new') && row1;
    });

    await UpdateBudgetData();
    toDelete && await DeleteRows(toDelete);
    toCreate && await CreateBudgetRows(toCreate);
    await UpdateRows(toUpdate);
    ToastSet(loading, 'Projeto atualizado.', 'success');

    if (budget.budgetStatus.value === 'adjudicated' && budgetData.name.value !== budget.name.value) await updateProject({ id: budget.id.replace(/Budget/g, 'Project'), data: { name: { type: 'Property', value: budgetData.name.value } } });

    if (budget.budgetStatus.value === 'adjudicated') Router.push(routes.private.internal.project + budget.id.replace(/Budget/g, 'Project'));
    else Router.push(breadcrumbsPath[1].href);
  }

  async function DeleteRows (rows) {
    try {
      rows.map(async (row) => await deleteFurniture(row.id).catch((err) => console.log(err)));

      return true;
    } catch (err) { return false; }
  }

  async function UpdateRows (rows) {
    try {
      rows.map(async (item) => {
        const id = item.id;

        delete item.id;
        delete item.hasBudget;
        await updateFurniture({ id, data: item }).catch((err) => console.log(err));
      });
    } catch (err) {
      console.log(err);
    }
  }

  async function CreateBudgetRows (rows) {
    const fixed = rows.map((item) => {
      return { ...item, id: item.id + formatString(budgetData.name.value) };
    });

    try {
      rows.length > 0 && await newFurniture(fixed).catch((err) => console.log(err));
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <Navbar />
      <Grid component='main'sx={{ padding: '0rem 2rem 4rem 2rem' }} >
        <CssBaseline />
        <Notification />
        <CustomBreadcrumbs path={breadcrumbsPath} />
        {/* Confirm Create Order Modal */}
        <ConfirmDialog
          open={dialogOpen}
          handleClose={() => setDialogOpen(false)}
          onConfirm={() => handleSave()}
          message={'Está prestes a alterar um projeto, tem certeza que quer continuar?'}
          icon='AlertOctagon'
        />
        {processing && <Loader center={true} backdrop />}
        {/* What do do after Create Modal */}
        <ConfirmDialog {...successModalProps} />
        <Content>
          <Grid container md={12} sx={{ p: '24px', display: 'flex', alignItems: 'center' }}>
            <Grid container md={10} sm={10} xs={12}>
              <Typography variant='titlexxl'>{breadcrumbsPath[1].title}</Typography>
            </Grid >
            <Grid container md={2} sm={2} xs={12} justifyContent='end'>
              <ButtonGroup>
                <PrimaryBtn
                  onClick={() => ValidateData()}
                  text={'Guardar'}
                  icon={ <Save size={pageProps?.globalVars?.iconSize || 20} strokeWidth={pageProps?.globalVars?.iconStrokeWidth || 1} />}
                />
                <PrimaryBtn
                  text='Cancelar'
                  icon={<X size={pageProps?.globalVars?.iconSize || 20} strokeWidth={pageProps?.globalVars?.iconStrokeWidth || 1} />}
                  light
                  onClick={() => Router.back()}
                />
              </ButtonGroup>
            </Grid>
          </Grid>
        </Content>
        <Grid container sx={{ width: '100%' }}>
          <Grid container md={12}>
            <Content>
              <RequestTab {...props}
                onProcessing={setProcessing}
                budgetData={budgetData}
                onBudgetChange={onBudgetChange}
                noDetail
              />
            </Content>
          </Grid>
          {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TextField type='time'></TextField>
          </LocalizationProvider> */}
          <Grid container md={12}>
            <Content>
              <ProductLinesTab {...props}
                dragDrop={{ getRootProps, getInputProps, isDragActive }}
                budgetData={budgetData}
                onBudgetChange={onBudgetChange}
                docs={{ uploadedFiles, setUploadedFiles }}
                noDrop
                lines={lines}
                setLines={setLines}
                linesErrors={linesErrors}
                setLinesErrors={setLinesErrors}
              />
            </Content>
          </Grid>
          <Grid container md={12}>
            <Content>
              <ObservationsTab {...props}
                budgetData={budgetData}
                onBudgetChange={onBudgetChange}
                docs={{ uploadedFiles, setUploadedFiles }}
                noDrop
                lines={lines}
                setLines={setLines}
              />
            </Content>
          </Grid>
        </Grid>
      </Grid >
      <Footer />
    </>
  );
};

export default EditBudget;
