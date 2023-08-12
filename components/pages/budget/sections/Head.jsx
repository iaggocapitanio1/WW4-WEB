/* eslint-disable consistent-return */
/* eslint-disable react/prop-types */
import { Box, Grid, TextField, Tooltip, Typography } from '@mui/material';
import React, { useState } from 'react';
//  PropTypes
import { CheckCircleOutline, Close } from '@mui/icons-material';
import PropTypes from 'prop-types';
import routes from '../../../../navigation/routes';
import AdjudicateBudgetModal from './modals/AdjudicateBudgetModal';
import DeliverBudgetModal from './modals/DeliverBudgetModal';

//  Actions
import { Edit2, Power, Trash } from 'lucide-react';
import moment from 'moment';
import Router from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
//  Services
import * as assemblysActionsRedux from '../../../../store/actions/assembly';
import * as budgetsActionsRedux from '../../../../store/actions/budget';
import * as expeditionsActionsRedux from '../../../../store/actions/expedition';
import * as projectsActionsRedux from '../../../../store/actions/project';
import Buttons from '../../../buttons/Buttons';
import ConfirmDialog from '../../../dialogs/ConfirmDialog';
import Notification from '../../../dialogs/Notification';
import CurrencyInput from '../../../inputs/CurrencyInput';
import MySelect from '../../../inputs/select';
import CanDo from '../../../utils/CanDo';
import formatString from '../../../utils/FormatString';
import ToastSet from '../../../utils/ToastSet';
import HeaderGrid from './components/HeaderGrid';

export const EditableCell = ({ active, onDoubleClick, value, type, name, options, onChange, isInternalPage }) => {
  const isCategory = name === 'category';
  const label = isCategory ? options.find((ele) => ele.id === value)?.label : value;
  const currencySymbol = type === 'currency' ? ' €' : '';
  const tooltipTitle = isInternalPage ? 'Dois cliques para alterar.' : '';

  const commonProps = {
    value,
    name,
    options,
    onChange,
    variant: 'standard',
    type: type || 'text'
  };

  if (!active) {
    return <Tooltip title={tooltipTitle} sx={{ cursor: isInternalPage && 'pointer' }}>
      <Typography variant='sm' onDoubleClick={() => isInternalPage && onDoubleClick(name)}>
        {label}
        {currencySymbol}
      </Typography>
    </Tooltip>;
  }

  switch (type) {
  case 'currency': return <CurrencyInput {...commonProps} />;
  case 'select': return <MySelect {...commonProps} />;
  default: return <TextField {...commonProps} />;
  }
};

EditableCell.propTypes = {
  active: PropTypes.bool,
  isInternalPage: PropTypes.bool,
  onDoubleClick: PropTypes.func,
  value: PropTypes.any,
  type: PropTypes.string,
  name: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.object),
  onChange: PropTypes.func
};

const Head = (props) => {
  const { isInternalPage, pageProps } = props;
  const [deliverModal, setDeliverModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [initiateBudgeting, setInitiateBudgeting] = useState(false);
  const [adjudicateModal, setAdjudicateModal] = useState(false);
  const [budget, setBudget] = useState({ ...props.budget });
  const dispatch = useDispatch();
  const updateBudget = (data) => dispatch(budgetsActionsRedux.updateBudget(data));
  const deleteBudget = (data) => dispatch(budgetsActionsRedux.deleteBudget(data));
  const newExpedition = (data) => dispatch(expeditionsActionsRedux.newExpedition(data));
  const newProject = (data) => dispatch(projectsActionsRedux.newProject(data));
  const newAssembly = (data) => dispatch(assemblysActionsRedux.newAssembly(data));
  const reduxState = useSelector((state) => state);

  const upperGrids = [
    {
      title: 'Orçamento',
      colls: [
        {
          label: 'Número',
          value: budget.num?.value
        },
        {
          label: 'Data',
          value: budget?.dateRequest?.value
        },
        {
          label: 'Revisto a',
          value: moment(budget?.createdAt).format('DD/MM/YYYY')
        },
        {
          label: 'Entrega Acordada',
          value: budget?.dateAgreedDelivery?.value
        },
        {
          label: 'Valor',
          value: budget?.price?.value
        },
        {
          label: 'Entregue',
          value: budget?.dateDelivery?.value
        },
      ]
    },
    {
      title: 'Desenho',
      colls: [
        {
          label: 'Início',
          value: ''
        },
        {
          label: 'Fim',
          value: ''
        },
      ]
    },
  ];

  const lowerGrids = [
    {
      title: 'Produção',
      colls: [
        {
          label: 'Início',
          value: ''
        },
        {
          label: 'Fim',
          value: ''
        },
        {
          label: '%',
          value: ''
        },
      ]
    },
    {
      title: 'Montagem',
      colls: [
        {
          label: 'Início',
          value: ''
        },
        {
          label: 'Fim',
          value: ''
        },
      ]
    },
    {
      title: 'Embalamento',
      colls: [
        {
          label: 'Início',
          value: ''
        },
        {
          label: 'Fim',
          value: ''
        },
        {
          label: 'Quantidade',
          value: ''
        },
      ]
    },
    {
      title: 'Expedição',
      colls: [
        {
          label: 'Início',
          value: ''
        },
        {
          label: 'Entrega Acordada',
          value: budget.dateDeliveryProject?.value
        },
        {
          label: 'Fim',
          value: ''
        },
      ]
    },
  ];

  async function InitiateBudgeting () {
    const loading = toast.loading('');

    const data = {
      budgetStatus: { type: 'Property', value: 'waiting budget' },
    };

    await updateBudget({ id: budget.id, data })
      .then(() => {
        ToastSet(loading, 'Projeto iniciou Orçamentação!', 'success');

        setBudget({
          ...budget,
          budgetStatus: { type: 'Property', value: 'waiting budget' },
        });

        setInitiateBudgeting(false);
      })
      .catch(() => {
        setInitiateBudgeting(false);
        ToastSet(loading, 'Projeto não alterado. Se o problema persistir, contacte a gerencia.', 'error');
      });
  }

  async function handleConfirmation ({
    price,
    dateAgreedDelivery,
    dateDeliveryProject
  }) {
    const processing = toast.loading('');

    const data = {
      ...budget,
      price: { value: String(price?.value)?.replace(/ /g, '').replace(/€/g, ''), type: 'Property' },
      budgetStatus: { value: 'waiting adjudication', type: 'Property' },
      dateDelivery: { value: moment().format('DD/MM/YYYY'), type: 'Property' },
      dateAgreedDelivery: { value: moment(dateAgreedDelivery.value).format('DD/MM/YYYY'), type: 'Property' },
      dateDeliveryProject: { value: moment(dateDeliveryProject.value).format('DD/MM/YYYY'), type: 'Property' },
    };

    delete data.createdAt;
    delete data.modifiedAt;
    delete data.orderBy;
    delete data.id;

    await updateBudget({ data, id: budget.id }).then(() => {
      setBudget({
        ...budget,
        price: { value: String(price?.value)?.replace(/ /g, '').replace(/€/g, ''), type: 'Property' },
        budgetStatus: { value: 'waiting adjudication', type: 'Property' },
        dateDelivery: { value: moment().format('DD/MM/YYYY'), type: 'Property' },
        dateAgreedDelivery: { value: moment(dateAgreedDelivery.value).format('DD/MM/YYYY'), type: 'Property' },
        dateDeliveryProject: { value: moment(dateDeliveryProject.value).format('DD/MM/YYYY'), type: 'Property' },
      });

      setDeliverModal(false);
      ToastSet(processing, 'Orçamento entregue', 'success');
    }).catch((err) => {
      console.log(err);
      ToastSet(processing, 'Projeto não entregue. Se o problema persistir, contacte a gerência.', 'error');
    });
  }

  async function handleAdjudication () {
    //  Steps for Project Creation
    //  1 -> Update Budget
    //  2 -> Create Project
    //  3 -> Create Expedition
    //  4 -> Create Assembly
    //  5 -> Send email project was adjudicated
    try {
      await newExpedition({
        id: 'urn:ngsi-ld:Expedition:' + budget.orderBy.object.id + '_' + formatString(budget.name.value),
        type: 'Expedition',
        expeditionTime: {
          type: 'Property',
          value: ''
        },
        deliveryTime: {
          type: 'Property',
          value: ''
        },
        deliveryFlag: {
          type: 'Property',
          value: 0
        },
        belongsTo: {
          type: 'Relationship',
          object: 'urn:ngsi-ld:Project:' + budget.orderBy.object.id + '_' + formatString(budget.name.value)
        },
      });

      await newAssembly({
        id: 'urn:ngsi-ld:Assembly:' + budget.orderBy.object.id + '_' + formatString(budget.name.value),
        type: 'Assembly',
        startTime: {
          type: 'Property',
          value: ''
        },
        finishTime: {
          type: 'Property',
          value: ''
        },
        statusAssembly: {
          type: 'Property',
          value: 1
        },
        belongsTo: {
          type: 'Relationship',
          object: 'urn:ngsi-ld:Project:' + budget.orderBy.object.id + '_' + formatString(budget.name.value)
        },
      });

      const built = {
        id: 'urn:ngsi-ld:Project:' + budget.orderBy.object.id + '_' + formatString(budget.name.value),
        type: 'Project',
        orderBy: { type: 'Relationship', object: 'urn:ngsi-ld:Owner:' + budget.orderBy?.object.id },
        name: { type: 'Property', value: budget.name.value },
        status: { type: 'Property', value: 'drawing' },
        hasBudget: { type: 'Relationship', object: budget.id },
        produced: { type: 'Property', value: '0' },
        amount: { type: 'Property', value: String(budget.amount.value).replace(/ /g, '').replace(/€/g, '') },
        expedition: { type: 'Relationship', object: 'urn:ngsi-ld:Expedition:' + budget.orderBy.object.id + '_' + formatString(budget.name.value) },
        assembly: { type: 'Relationship', object: 'urn:ngsi-ld:Assembly:' + budget.orderBy.object.id + '_' + formatString(budget.name.value) },
        startedProduction: { type: 'Property', value: '' },
      };

      await newProject(built)
        .catch((err) => console.log(err));

      await updateBudget(
        {
          id: budget.id,
          data: {
            approvedDate: { type: 'Property', value: moment().format('DD/MM/YYYY') },
            approvedBy: { type: 'Relationship', object: 'urn:ngsi-ld:Owner:' + reduxState.auth.me.id },
            budgetStatus: { type: 'Property', value: 'adjudicated' },
          }
        }
      );

      setAdjudicateModal(false);
      toast.success('Projeto adjudicado! Passou para desenho.');
      Router.push(routes.private.internal.project + 'urn:ngsi-ld:Project:' + budget.orderBy.object.id + '_' + formatString(budget.name.value));
    } catch (err) {
      console.log(err);
      setAdjudicateModal(false);
      toast.error('Algo aconteceu. Por favor tente mais tarde.');
    }
  }

  const tableFirstCell = {
    container: true,
    sx: { borderLeft: '1px solid', borderRight: '1px solid', borderColor: 'divider' },
    md: 4,
    sm: 4,
    xs: 4,
    p: 0.5
  };

  const tableLastCell = {
    container: true,
    sx: { borderRight: '1px solid ', borderColor: 'divider' },
    md: 8,
    sm: 8,
    xs: 8,
    p: 0.5
  };

  const canChangeProject = CanDo('change_project');

  // const ActionButton = () => {
  //   if (!isInternalPage || !canChangeProject) return;

  //   switch (budget?.budgetStatus?.value) {
  //   case 'needs analysis': return <PrimaryBtn
  //     text={'Iniciar Orçamentação'}
  //     onClick={() => setInitiateBudgeting(true) }
  //     icon={
  //       <CheckCircleOutline
  //         strokeWidth={pageProps?.globalVars?.iconSmStrokeWidth || 1.5}
  //         size={pageProps?.globalVars?.iconSize || 20}
  //       />
  //     }
  //   />;
  //   case 'waiting budget': return <PrimaryBtn
  //     text={'Entregar Orçamento' }
  //     onClick={() => setDeliverModal(!deliverModal) }
  //     icon={
  //       <CheckCircleOutline
  //         strokeWidth={pageProps?.globalVars?.iconSmStrokeWidth || 1.5}
  //         size={pageProps?.globalVars?.iconSize || 20}
  //       />
  //     }
  //   />;
  //   case 'waiting adjudication' : return <PrimaryBtn
  //     text={'Adjudicar projeto'}
  //     onClick={() => setAdjudicateModal(!adjudicateModal)}
  //     icon={
  //       <CheckCircleOutline
  //         strokeWidth={pageProps?.globalVars?.iconSmStrokeWidth || 1.5}
  //         size={pageProps?.globalVars?.iconSize || 20}
  //       />
  //     }
  //   />;
  //   }
  // };

  const ActionButtonMobile = () => {
    if (!isInternalPage || !canChangeProject) return;

    switch (budget?.budgetStatus?.value) {
    case 'needs analysis': return {
      text: 'Iniciar Orçamentação',
      onClick: () => setInitiateBudgeting(true),
      icon: <CheckCircleOutline
        strokeWidth={pageProps?.globalVars?.iconSmStrokeWidth || 1.5}
        size={pageProps?.globalVars?.iconSize || 20}
      />,
      color: 'primary'
    };
    case 'waiting budget': return {
      text: 'Entregar Orçamento',
      onClick: () => setDeliverModal(true),
      icon: <CheckCircleOutline
        strokeWidth={pageProps?.globalVars?.iconSmStrokeWidth || 1.5}
        size={pageProps?.globalVars?.iconSize || 20}
      />,
      color: 'primary'
    };
    case 'waiting adjudication': return {
      text: 'Adjudicar projeto',
      onClick: () => setAdjudicateModal(true),
      icon: <CheckCircleOutline
        strokeWidth={pageProps?.globalVars?.iconSmStrokeWidth || 1.5}
        size={pageProps?.globalVars?.iconSize || 20}
      />,
      color: 'primary'
    };
    }
  };

  async function onDelete () {
    const loading = toast.loading('');
    // eslint-disable-next-line react/prop-types

    await deleteBudget(budget.id)
      .then(() => {
        ToastSet(loading, 'Projeto removido', 'success');
        Router.push(routes.private.internal.projects);
      }).catch(() => {
        ToastSet(loading, 'Algo aconteceu. Por favor tente mais tarde.', 'error');
      });
  }

  async function CancelProject () {
    const loading = toast.loading('');
    const data = { budgetStatus: 'canceled' };

    try {
      await updateBudget({ id: budget.id, data }).then(() => {
        ToastSet(loading, 'Projeto cancelado.', 'success');

        setBudget({
          ...budget,
          budgetStatus: { type: 'Property', value: 'canceled' },
        });
      });
    } catch (err) { ToastSet(loading, 'Algo aconteceu. Por favor tente mais tarde.', 'error'); }
  }

  function ReopenProject () {
    setBudget({
      ...budget,
      budgetStatus: { type: 'Property', value: 'needs analysis' },
    });
  }

  const canEditProject = CanDo('update_project');
  const canDeleteProject = CanDo('delete_project');

  return (
    <>
      <Notification />
      <DeliverBudgetModal {...props} open={deliverModal} handleClose={() => setDeliverModal(false)} onConfirm={handleConfirmation} />
      <AdjudicateBudgetModal {...props} open={adjudicateModal} handleClose={() => setAdjudicateModal(false)} onConfirm={handleAdjudication} />
      <ConfirmDialog
        open={initiateBudgeting}
        handleClose={() => setInitiateBudgeting(false)}
        onConfirm={() => InitiateBudgeting()}
        icon='Check'
        message={'Está prestes a iniciar orçamentação. Quer continuar?'}
      />
      <ConfirmDialog
        open={deleteModal}
        handleClose={() => setDeleteModal(false)}
        onConfirm={() => onDelete()}
        message={'Está prestes a apagar um projeto, o que é irreversível, tem certeza que quer continuar?'}
      />
      <Box id='pad'>
        <Grid container md={12} sm={12} xs={12} sx={{ marginBottom: '1rem' }}>
          <Grid container md={6} sm={6} xs={11}>
            <Grid container md={12} sm={12} xs={12} display={!isInternalPage && 'none'}>
              <Typography variant="sm" color="lightTextSm.main" >
                {'Cliente '}
                {budget.orderBy.object?.isCompany ? 'Empresarial: ' : 'Particular: '}
                <Tooltip title='Ver cliente'>
                  <a href={routes.private.internal.client + budget.orderBy?.object?.id} target="_blank" rel="noreferrer" >
                    <Typography variant='sm' color={CanDo('see_client') && 'primary.main'}> {`${budget.orderBy?.object?.user?.first_name} ${budget.orderBy?.object?.user?.last_name}`}</Typography>
                  </a>
                </Tooltip>
              </Typography>
            </Grid>
            <Grid container alignItems={'center'}>
              <Typography variant='title'>{budget.name.value}</Typography>
              <Box pl={2} >
                {budget.budgetStatus?.value === 'canceled' && <Typography variant='sm' className='errorBalloon'>Cancelado</Typography>}
                {budget.budgetStatus?.value === 'needs analysis' && <Typography variant='sm' className="analisysBalloon">Pendente Análise Necessidades</Typography>}
                {budget.budgetStatus?.value === 'waiting adjudication' && <Typography variant='sm' className='infoBalloon'>Pendente Adjudicação</Typography>}
                {budget.budgetStatus?.value === 'waiting budget' && <Typography variant='sm' className='waitingBudgetBalloon'>Pendente Orçamentação</Typography>}
              </Box>
            </Grid>
          </Grid>
          <Grid container md={6} sm={6} xs={1} justifyContent='end' alignItems={'center'}>
            <Buttons buttons={[
              {
                text: 'Editar',
                color: 'primary',
                href: routes.private.internal.editBudget + budget.id,
                hidden: !(budget.budgetStatus.value !== 'canceled' && canEditProject) || !isInternalPage,
                icon: <Edit2 strokeWidth={pageProps?.globalVars?.iconSmStrokeWidth || 1.5} size={pageProps?.globalVars?.iconSize || 20} />
              },
              {
                text: 'Cancelar projeto',
                color: 'warning',
                hidden: !(budget.budgetStatus.value !== 'canceled' && canEditProject) || !isInternalPage,
                variant: 'outlined',
                icon: <Close strokeWidth={pageProps?.globalVars?.iconSmStrokeWidth || 1.5} size={pageProps?.globalVars?.iconSize || 20} />,
                onClick: CancelProject
              },
              {
                text: 'Reativar',
                color: 'warning',
                hidden: !(budget.budgetStatus.value === 'canceled' && canEditProject) || !isInternalPage || true,
                icon: <Power strokeWidth={pageProps?.globalVars?.iconSmStrokeWidth || 1.5} size={pageProps?.globalVars?.iconSize || 20} />,
                onClick: ReopenProject
              },
              {
                text: 'Apagar',
                color: 'error',
                variant: 'outlined',
                hidden: !(canDeleteProject) || !isInternalPage,
                icon: <Trash strokeWidth={pageProps?.globalVars?.iconSmStrokeWidth || 1.5} size={pageProps?.globalVars?.iconSize || 20} />,
                onClick: () => setDeleteModal(true)
              },
              {
                ...ActionButtonMobile(),
                divider: true,
                variant: 'outlined'
              }
            ]} />
          </Grid>
        </Grid>
        <Grid container md={12} sm={12} xs={12}>
          <HeaderGrid grids={ upperGrids }/>
          <HeaderGrid grids={ lowerGrids }/>
          <Grid container md={12} p={1}>
            <Grid container style={{ width: 'fit-content' }}>
              <Grid container md={4} display={'none'}>
                <Grid md={12} sm={12} xs={12}>
                  <Typography color={'lightTextSm.main'}>Cliente</Typography>
                  <Tooltip title='Ver cliente'>
                    <Typography color={'primary.main'}>
                      <a href={routes.private.internal.client + budget.orderBy?.object?.id} target="_blank" rel="noreferrer" >
                        {`${budget.orderBy?.object?.user?.first_name} ${budget.orderBy?.object?.user?.last_name}`}
                      </a>
                    </Typography>
                  </Tooltip>
                </Grid>
                <Grid md={12} sm={12} xs={12}>
                  <Typography color={'lightTextSm.main'}>Tipo</Typography>
                  <Typography >{budget.orderBy.object?.isCompany ? 'Empresarial' : 'Particular'}</Typography>
                </Grid>
              </Grid>
              <Grid container md={8}>
                <Grid container p={1}>
                  <Grid container md={12} sm={12} xs={12} >
                    {/* Headers */}
                    <Grid container md={12} sm={12} xs={12} sx={{ borderBottom: '1px solid', p: 0, borderColor: 'divider' }}>
                      <Grid {...tableFirstCell} sx={{ border: 'none' }}><Typography fontWeight={'bold'} variant="subtitle2">Morada</Typography></Grid>
                      {/* <Grid {...tableLastCell} sx={{ border: 'none' }} ><Typography item variant="subtitle2"color='lightTextSm.main'></Typography>Entrega</Grid> */}
                    </Grid>
                    {/* Postal Code */}
                    <Grid container md={12} sm={12} xs={12}>
                      <Grid {...tableFirstCell}><Typography item variant="subtitle2"color='lightTextSm.black'>Código Postal</Typography></Grid>
                      <Grid {...tableLastCell}><Typography item variant="subtitle2" color='lightTextSm.black'>{budget.deliveryAddress?.value?.postalCode}</Typography></Grid>
                    </Grid>
                    {/* Street */}
                    <Grid container md={12} sm={12} xs={12}>
                      <Grid {...tableFirstCell}><Typography item variant="subtitle2"color='lightTextSm.black'>Rua</Typography></Grid>
                      <Grid {...tableLastCell}><Typography item variant="subtitle2"color='lightTextSm.black'>{budget.deliveryAddress?.value?.streetAddress}</Typography></Grid>
                    </Grid>
                    {/* addressLocality */}
                    <Grid container md={12} sm={12} xs={12}>
                      <Grid {...tableFirstCell}><Typography item variant="subtitle2"color='lightTextSm.black'>Localidade</Typography></Grid>
                      <Grid {...tableLastCell}><Typography item variant="subtitle2"color='lightTextSm.black'>{budget.deliveryAddress?.value?.addressLocality}</Typography></Grid>
                    </Grid>
                    {/* addressRegion */}
                    <Grid container md={12} sm={12} xs={12}>
                      <Grid {...tableFirstCell}><Typography item variant="subtitle2"color='lightTextSm.black'>Região</Typography></Grid>
                      <Grid {...tableLastCell}><Typography item variant="subtitle2"color='lightTextSm.black'>{budget.deliveryAddress?.value?.addressRegion}</Typography></Grid>
                    </Grid>
                    {/* addressCountry */}
                    <Grid container md={12} sm={12} xs={12} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
                      <Grid {...tableFirstCell}><Typography item variant="subtitle2"color='lightTextSm.black'>País</Typography></Grid>
                      <Grid {...tableLastCell}><Typography item variant="subtitle2"color='lightTextSm.black'>{reduxState?.countries?.data?.find(ele => ele.cca2 === budget.deliveryAddress?.value?.addressCountry)?.name?.common}</Typography></Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>

  );
};

export default Head;
