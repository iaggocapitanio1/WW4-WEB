/* eslint-disable array-callback-return */
/* eslint-disable react/prop-types */
//  Nodes
import Router, { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

//  Material Ui
import { ButtonGroup, Grid, Typography } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';

//  Icons
import { Save, X } from 'lucide-react';

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

//  Device "Detector"
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import * as budgetsActionsRedux from '../../../store/actions/budget';
import * as furnituresActionsRedux from '../../../store/actions/furniture';

import routes from '../../../navigation/routes';
import Footer from '../../layout/footer/footer';
import Navbar from '../../layout/navbar/navbar';
import CanDo from '../../utils/CanDo';
import formatString from '../../utils/FormatString';
import ObservationsTab from './Tabs/observationsTab';
import ProductLinesTab from './Tabs/productLinesTab';
import RequestTab from './Tabs/requestTab';

const NewOrder = ({ ...props }) => {
  const { breadcrumbsPath, pageProps, clients, budgets } = props;
  const [successOpen, setSuccessOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState();
  const [lines, setLines] = useState([]);
  const [linesErrors, setLinesErrors] = useState({ group: false, subGroup: false, item: false });
  const dispatch = useDispatch();
  const newBudget = (data) => dispatch(budgetsActionsRedux.newBudget(data));
  const newFurniture = (data) => dispatch(furnituresActionsRedux.newFurniture(data));
  const reduxState = useSelector((state) => state);
  const path = useRouter();
  const isInternalPage = Object.values(routes.private.internal).includes(path.route.replace('[Id]', ''));

  useEffect(() => {
    let totalPrice = 0;
    let totalAmount = 0;

    lines.map((group) => {
      group.subGroups?.map((subgroup) => {
        subgroup.items.filter(ele => ele.furnitureType.value === 'furniture').map(item => {
          totalPrice += Number(item?.price?.value?.replace(/ /g, '').replace(/€/g, ''));
          totalAmount += Number(item?.amount?.value);
        });
      });
    });

    budgetData.price.value = totalPrice;
    setBudgetData({ ...budgetData, price: { ...budgetData.price, value: totalPrice }, amount: { ...budgetData.price, value: totalAmount } });
  }, [lines]);

  const [budgetData, setBudgetData] = useState({
    num: { value: '', error: '', required: true },
    name: { value: '', error: '', required: true },
    obs: { value: '', type: 'area' },
    price: { value: '', error: '', type: 'currency', disabled: true },
    client: { value: '', error: '', required: true },
    dateRequest: { value: moment(moment(), 'DD/MM/YYYY'), error: '', required: true, type: 'date' },
    dateDelivery: { value: '', error: '', required: false, type: 'date' },
    dateAgreedDelivery: { value: '', error: '', required: true, type: 'date' },
    dateDeliveryProject: { value: '', error: '', required: false, type: 'date' },
    streetAddress: { value: '', error: '', required: true },
    postalCode: { value: '', error: '', required: true },
    addressLocality: { value: '', error: '', required: true },
    addressRegion: { value: '', error: '', required: false },
    addressCountry: { value: '', error: '', required: true },
  });

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

    if (props.name === 'client') {
      const client = clients.find(ele => ele.id === props.value);

      data.postalCode = { ...data.postalCode, error: '', value: client?.address?.postalCode };
      data.streetAddress = { ...data.streetAddress, error: '', value: client?.address?.streetAddress };
      data.addressLocality = { ...data.addressLocality, error: '', value: client?.address?.addressLocality };
      data.addressRegion = { ...data.addressRegion, error: '', value: client?.address?.addressRegion };
      data.addressCountry = { ...data.addressCountry, error: '', value: client?.address?.addressCountry };

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
            } else value.error = '';
          });
        });
      });
    });

    setLines(obj);
    hasErrors && toast.error('Prencha todos os campos.');

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

    if (budgets.find((ele) => ele.orderBy.object === ('urn:ngsi-ld:Owner:' + budgetData.client.value) && ele.name.value === budgetData.name.value)) {
      data.name.error = 'Este cliente, já tem 1 projeto com este nome';
      hasErrors = true;
    }

    if (hasErrors) {
      toast.error('Prencha todos os campos.');
      setBudgetData(data);

      return !hasErrors;
    }

    if (ValidateLines()) return false;

    CreateOrder();
  }

  async function CreateOrder () {
    setProcessing(true);

    const data = {
      id: `urn:ngsi-ld:Budget:${budgetData?.client?.value}_${formatString(budgetData.name.value)}`, // ${moment().diff(moment().startOf('day'), 'seconds')}
      type: 'Budget',
      name: {
        type: 'Property',
        value: budgetData.name.value
      },
      num: {
        type: 'Property',
        value: budgetData.num.value
      },
      amount: {
        type: 'Property',
        value: budgetData.amount.value
      },
      price: {
        type: 'Property',
        value: String(budgetData.price.value)
      },
      approvedDate: {
        type: 'Property',
        value: ''
      },
      dateRequest: {
        type: 'Property',
        value: budgetData.dateRequest.value !== '' ? moment(budgetData.dateRequest.value).format('DD/MM/YYYY') : ''
      },
      dateAgreedDelivery: {
        type: 'Property',
        value: budgetData.dateAgreedDelivery.value !== '' ? moment(budgetData.dateAgreedDelivery.value).format('DD/MM/YYYY') : ''
      },
      dateDeliveryProject: {
        type: 'Property',
        value: budgetData.dateDeliveryProject.value !== '' ? moment(budgetData.dateDeliveryProject.value).format('DD/MM/YYYY') : ''
      },
      obs: {
        type: 'Property',
        value: budgetData.obs.value
      },
      budgetStatus: {
        type: 'Property',
        value: budgetData.price.value && budgetData.dateDelivery.value && budgetData.dateDeliveryProject.value ? 'waiting adjudication' : 'needs analysis'
      },
      orderBy: {
        type: 'Relationship',
        object: 'urn:ngsi-ld:Owner:' + budgetData.client.value
      },
      approvedBy: {
        type: 'Relationship',
        object: 'urn:ngsi-ld:Worker:' + reduxState.auth.me.id
      },
      belongsTo: {
        type: 'Relationship',
        object: `urn:ngsi-ld:Project:${formatString(budgetData.name.value)}`
      },
      dateDelivery: {
        type: 'Property',
        value: budgetData.dateDelivery?.value !== '' ? moment(budgetData.dateDelivery.value).format('DD/MM/YYYY') : ''
      },
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
    };

    await newBudget(data).then(async () => {
      CreateFurnitures(data.id).then(() => {
        toast.success('Projeto Criado!');
        Router.push(routes.private.internal.budget + data.id);
      });
    }).catch(() => toast.error('Algo aconteceu. Por favor tente mais tarde!'));

    // await BudgetActions.saveBudget(built).then(() => toast.success('Criado.')).catch(() => toast.error('Algo aconteceu'));
    setProcessing(false);
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

  async function CreateFurnitures (budgetId) {
    const items = lines.map(group => {
      const items = [{
        id: 'urn:ngsi-ld:Furniture:' + formatString(budgetData.name.value) + group.id + budgetData.client.value,
        furnitureType: { type: 'Property', value: 'group' },
        name: { type: 'Property', value: formatString(group.name).replace(/_/g, ' ') },
        hasBudget: { object: budgetId, type: 'Relationship' },
        type: 'Furniture'
      }];

      delete items[0].subGroups;

      const lines = group.subGroups?.map(subgroup => {
        //  Aqui tenho cada subgrupo com os items dentro

        const items = [{
          id: 'urn:ngsi-ld:Furniture:' + formatString(budgetData.name.value) + '_' + group.id + '_' + subgroup.id + budgetData.client.value,
          furnitureType: { type: 'Property', value: 'subGroup' },
          name: { type: 'Property', value: formatString(subgroup.name).replace(/_/g, ' ') },
          hasBudget: { object: budgetId, type: 'Relationship' },
          type: 'Furniture',
          group: { value: group.name, type: 'Property' }

        }];

        delete items[0].items;

        const items2 = subgroup.items.map((item) => {
          const valuesOnly = {};

          Object.keys(item).map(key => {
            valuesOnly[key] = {
              type: 'Property',
              value: item[key].value
            };
          });

          valuesOnly.id = 'urn:ngsi-ld:Furniture:' + formatString(budgetData.name.value) + '_' + group.id + '_' + subgroup.id + '_' + formatString(item.name.value) + budgetData.client.value;
          valuesOnly.type = 'Furniture';
          valuesOnly.name = { ...valuesOnly.name, value: formatString(valuesOnly.name.value).replace(/_/g, ' ') };
          valuesOnly.subGroup = { value: subgroup.name, type: 'Property' };
          valuesOnly.group = { value: group.name, type: 'Property' };
          valuesOnly.hasBudget = { object: budgetId, type: 'Relationship' };
          valuesOnly.produced = { value: false, type: 'Property' };
          valuesOnly.assembled = { value: false, type: 'Property' };

          return valuesOnly;
        });

        return items.concat(...items2);
      });

      return items.concat(...lines);
    });

    const mergedArray = [].concat(...items).map((item, index) => {
      const normalizedItem = { ...item, lineNumber: { type: 'Property', value: index } };

      if (normalizedItem.name && normalizedItem.name.value) {
        const normalizedNameValue = normalizedItem.name.value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const normalizedName = { ...normalizedItem.name, value: normalizedNameValue };

        normalizedItem.name = normalizedName;
      }

      if (normalizedItem.group && normalizedItem.group.value) {
        const normalizedGroupNameValue = normalizedItem.group.value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const normalizedGroup = { ...normalizedItem.group, value: normalizedGroupNameValue };

        normalizedItem.group = normalizedGroup;
      }

      if (normalizedItem.subGroup && normalizedItem.subGroup.value) {
        const normalizedSubGroupNameValue = normalizedItem.subGroup.value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const normalizedSubGroup = { ...normalizedItem.subGroup, value: normalizedSubGroupNameValue };

        normalizedItem.subGroup = normalizedSubGroup;
      }

      return normalizedItem;
    });

    const fixed = mergedArray.map((item) => { return { ...item, id: item.id + formatString(budgetData.name.value) }; });

    try {
      // fixed.map(async (ele) => await newFurniture(ele));
      await newFurniture(fixed);
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
        {processing && <Loader center={true} backdrop />}
        {/* What do do after Create Modal */}
        <ConfirmDialog {...successModalProps} />
        <Content>
          <Grid container md={12} sx={{ p: '24px', display: 'flex', alignItems: 'center' }}>
            <Grid container md={10} sm={10} xs={12}>
              <Typography variant='titlexxl'>{breadcrumbsPath[1]?.title}</Typography>
            </Grid >
            <Grid container md={2} sm={2} xs={12} justifyContent='end'>
              <ButtonGroup>
                <PrimaryBtn
                  onClick={() => ValidateData()}
                  hidden={!isInternalPage && !CanDo('add_project')}
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
                onClientChange={onBudgetChange}
              />
            </Content>
          </Grid>
          <Grid container md={12} >
            <Content>
              <ProductLinesTab {...props}
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

export default NewOrder;
