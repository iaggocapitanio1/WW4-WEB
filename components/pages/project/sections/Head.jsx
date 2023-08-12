/* eslint-disable consistent-return */
/* eslint-disable react/prop-types */
import { Edit2, Power, Trash } from 'lucide-react';
import React, { useState } from 'react';

//  PropTypes
import { CheckCircleOutline, Close } from '@mui/icons-material';
import { Box, Grid, Tooltip, Typography } from '@mui/material';
import moment from 'moment';
import { Router } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import routes from '../../../../navigation/routes';
import * as assemblyActionsRedux from '../../../../store/actions/assembly';
import * as expeditionsActionsRedux from '../../../../store/actions/expedition';
import * as projectsActionsRedux from '../../../../store/actions/project';
import Buttons from '../../../buttons/Buttons';
import ConfirmDialog from '../../../dialogs/ConfirmDialog';
import Notification from '../../../dialogs/Notification';
import CanDo from '../../../utils/CanDo';
import ToastSet from '../../../utils/ToastSet';
import HeaderGrid from '../../budget/sections/components/HeaderGrid';
import FinishProjectModal from '../modal/finishProjectModal';

const Head = (props) => {
  const { order, isInternalPage, pageProps, setOrder, finishProject } = props;
  const [changeToProdModal, setChangeToProdModal] = useState(false);
  const [changeToAssemblyModal, setChangeToAssemblyModal] = useState(false);
  const [changeToTransportModal, setChangeToTransportModal] = useState(false);
  const [changeToFinishedModal, setChangeToFinishedModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [finishModal, setFinishModal] = useState(finishProject === '1');
  const dispatch = useDispatch();
  const updateAssembly = (data) => dispatch(assemblyActionsRedux.updateAssembly(data));
  const updateProject = (data) => dispatch(projectsActionsRedux.updateProject(data));
  const updateExpedition = (data) => dispatch(expeditionsActionsRedux.updateExpedition(data));
  const deleteProject = (data) => dispatch(projectsActionsRedux.deleteProject(data));
  const reduxState = useSelector((state) => state);
  let totalBuilt = 0;

  // eslint-disable-next-line no-return-assign
  props.furnituresUnbuilt.filter(ele => ele.produced?.value).map((furni) => totalBuilt = totalBuilt + Number(furni.amount.value));
  console.log(order.amount.value);

  const [grids, setGrids] = useState({
    upperGrids: [
      {
        title: 'Orçamento',
        colls: [
          {
            label: 'Número',
            value: order.hasBudget?.object?.num?.value
          },
          {
            label: 'Data',
            value: order.hasBudget?.object?.dateRequest?.value
          },
          {
            label: 'Revisto a',
            value: moment(order.hasBudget?.object?.createdAt).format('DD/MM/YYYY')
          },
          {
            label: 'Entrega Acordada',
            value: order.hasBudget?.object?.dateAgreedDelivery?.value
          },
          {
            label: 'Valor',
            value: order.hasBudget?.object?.price?.value
          },
          {
            label: 'Entregue',
            value: order.hasBudget?.object?.dateDelivery?.value
          },
        ]
      },
      {
        title: 'Desenho',
        colls: [
          {
            label: 'Início',
            value: moment(order.createdAt).format('DD/MM/YYYY')
          },
          {
            label: 'Fim',
            value: order.startedProduction?.value && moment(order.startedProduction?.value, 'DD/MM/YYYY hh:mm:ss').format('DD/MM/YYYY')
          },
        ]
      },
    ],
    lowerGrids: [
      {
        title: 'Produção',
        colls: [
          {
            label: 'Início',
            value: order?.startedProduction?.value && moment(order?.startedProduction?.value, 'DD/MM/YYYY hh:mm:ss').format('DD/MM/YYYY')
          },
          {
            label: 'Fim',
            value: order?.assembly?.startTime?.value && moment(order?.assembly?.startTime?.value, 'DD/MM/YYYY hh:mm:ss').format('DD/MM/YYYY')
          },
          {
            label: '%',
            value: totalBuilt > 0 ? Number(totalBuilt / (Number(order.amount.value) !== 0 ? order.amount.value : 1) * 100).toFixed(0) : '0'
          },
        ]
      },
      {
        title: 'Montagem',
        colls: [
          {
            label: 'Início',
            value: order?.assembly?.startTime?.value && moment(order?.assembly?.startTime?.value, 'DD/MM/YYYY hh:mm:ss').format('DD/MM/YYYY')
          },
          {
            label: 'Fim',
            value: order?.assembly?.finishTime?.value && moment(order?.assembly?.finishTime?.value, 'DD/MM/YYYY hh:mm:ss').format('DD/MM/YYYY')
          },
        ]
      },
      {
        title: 'Embalamento',
        colls: [
          {
            label: 'Início',
            value: order?.assembly?.finishTime?.value && moment(order?.assembly?.finishTime?.value, 'DD/MM/YYYY hh:mm:ss').format('DD/MM/YYYY')
          },
          {
            label: 'Fim',
            value: order?.expedition?.expeditionTime?.value && moment(order?.expedition?.expeditionTime?.value, 'DD/MM/YYYY hh:mm:ss').format('DD/MM/YYYY')
          },
        ]
      },
      {
        title: 'Expedição',
        colls: [
          {
            label: 'Início',
            value: order?.expedition?.expeditionTime?.value && moment(order?.expedition?.expeditionTime?.value, 'DD/MM/YYYY hh:mm:ss').format('DD/MM/YYYY')
          },
          {
            label: 'Fim',
            value: order?.expedition?.deliveryTime?.value && moment(order?.expedition?.deliveryTime?.value, 'DD/MM/YYYY hh:mm:ss').format('DD/MM/YYYY')
          },
          {
            label: 'Entrega Acordada',
            value: order.hasBudget?.object?.dateDeliveryProject?.value && moment(order.hasBudget?.object?.dateDeliveryProject?.value, 'DD/MM/YYYY hh:mm:ss').format('DD/MM/YYYY')
          },
        ]
      },
    ]
  });

  async function handleChangeToProd (props) {
    setChangeToProdModal(false);

    const processing = toast.loading('');

    try {
      await updateProject({
        id: order.id,
        data: {
          type: order.type,
          status: { value: `${props}`, type: 'Property' }
        }
      }).then(async () => {
        setOrder({ ...order, status: { type: 'Property', value: `${props}` } });
        setChangeToProdModal(false);
        setChangeToAssemblyModal(false);
        setChangeToTransportModal(false);
        setFinishModal(false);

        if (props === 'finished') await updateExpedition({ id: order.expedition.id, deliveryFlag: 1, expeditionTime: moment().format('DD/MM/YYYY HH:mm:ss') }).then(res => setOrder({ ...order, expedition: { ...order.expedition, deliveryFlag: 1, expeditionTime: res.data.expeditionTime } }));

        ToastSet(processing, `Projeto passou a ${props === 'production' ? 'produção' : (props === 'testing' ? 'montagem' : (props === 'testing' ? 'transporte' : 'terminado'))}`, 'success');
      });
    } catch (err) { console.log(err); }
  }

  function onProjectScanned () {
    setChangeToFinishedModal(false);
    setFinishModal(true);
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

  async function handleChangeToProduction () {
    await updateProject({
      id: order.id,
      data: {
        status: { type: 'Property', value: 'production' },
        startedProduction: { type: 'Property', value: moment().format('DD/MM/YYYY HH:mm:ss') },
      }
    }).then(() => {
      const cpyProdGrid = JSON.parse(JSON.stringify({ ...grids }));

      cpyProdGrid.lowerGrids[0].colls[0].value = moment().format('DD/MM/YYYY');
      setGrids({ ...grids, ...cpyProdGrid });

      setOrder({
        ...order,
        status: { ...order.status, value: 'production' },
        startedProduction: { ...order.startedProduction, value: moment().format('DD/MM/YYYY HH:mm:ss') }
      });

      toast.success('Projeto passou a produção.');
    });
  }

  async function handleChangeToAssembly () {
    await updateProject({
      id: order.id,
      data: {
        status: { type: 'Property', value: 'testing' },
      }
    }).then(async () => {
      const cpyProdGrid = JSON.parse(JSON.stringify({ ...grids }));

      cpyProdGrid.lowerGrids[0].colls[1].value = moment().format('DD/MM/YYYY');
      cpyProdGrid.lowerGrids[1].colls[0].value = moment().format('DD/MM/YYYY');
      setGrids({ ...grids, ...cpyProdGrid });

      setOrder({
        ...order,
        status: { ...order.status, value: 'testing' },
      });

      if (!order.assembly.startTime.value) await updateAssembly({ id: order.assembly.id, data: { startTime: { type: 'Property', value: moment().format('DD/MM/YYYY HH:mm:ss') } } });

      toast.success('Projeto passou a montagem.');
    });
  }

  async function handleChangeToPacking () {
    await updateProject({
      id: order.id,
      data: {
        status: { type: 'Property', value: 'packing' },
      }
    }).then(async () => {
      await updateAssembly({ id: order.assembly.id, data: { finishTime: { type: 'Property', value: moment().format('DD/MM/YYYY HH:mm:ss') } } });

      const cpyProdGrid = JSON.parse(JSON.stringify({ ...grids }));

      cpyProdGrid.lowerGrids[1].colls[1].value = moment().format('DD/MM/YYYY');
      cpyProdGrid.lowerGrids[2].colls[0].value = moment().format('DD/MM/YYYY');
      setGrids({ ...grids, ...cpyProdGrid });

      setOrder({
        ...order,
        status: { ...order.status, value: 'packing' },
      });

      toast.success('Projeto passou a embalamento.');
    });
  }

  async function handleChangeToTransport () {
    await updateProject({
      id: order.id,
      data: {
        status: { type: 'Property', value: 'transport' },
      }
    }).then(async () => {
      await updateExpedition({ id: order.expedition.id, data: { expeditionTime: { type: 'Property', value: moment().format('DD/MM/YYYY HH:mm:ss') } } });

      const cpyProdGrid = JSON.parse(JSON.stringify({ ...grids }));

      cpyProdGrid.lowerGrids[2].colls[1].value = moment().format('DD/MM/YYYY');
      cpyProdGrid.lowerGrids[3].colls[0].value = moment().format('DD/MM/YYYY');
      setGrids({ ...grids, ...cpyProdGrid });

      setOrder({
        ...order,
        status: { ...order.status, value: 'transport' },
        expedition: { ...order.expedition, expeditionTime: { type: 'Property', value: moment().format('DD/MM/YYYY HH:mm:ss') } }
      });

      toast.success('Projeto passou a expedição.');
    });
  }

  async function handleChangeToFinished () {
    await updateProject({
      id: order.id,
      data: {
        status: { type: 'Property', value: 'finished' },
      }
    }).then(async () => {
      await updateExpedition({ id: order.expedition.id, data: { deliveryTime: { type: 'Property', value: moment().format('DD/MM/YYYY HH:mm:ss') } } });

      const cpyProdGrid = JSON.parse(JSON.stringify({ ...grids }));

      cpyProdGrid.lowerGrids[3].colls[1].value = moment().format('DD/MM/YYYY');
      setGrids({ ...grids, ...cpyProdGrid });

      setOrder({
        ...order,
        status: { ...order.status, value: 'finished' },
        expedition: { ...order.expedition, deliveryTime: { type: 'Property', value: moment().format('DD/MM/YYYY HH:mm:ss') } }
      });

      toast.success('Projeto passou a expedição.');
    });
  }

  async function onDelete () {
    const loading = toast.loading('');
    // eslint-disable-next-line react/prop-types

    await deleteProject(order.hasBudget.id)
      .then(() => {
        ToastSet(loading, 'Projeto removido', 'success');
        Router.push(routes.private.internal.projects);
      }).catch(() => {
        ToastSet(loading, 'Algo aconteceu. Por favor tente mais tarde.', 'error');
      });
  }

  const canEditProject = CanDo('update_project');
  const canDeleteProject = CanDo('delete_project');

  async function CancelProject () {
    const loading = toast.loading('');
    const data = { status: 'canceled' };

    try {
      await updateProject({ id: order.id, data }).then(() => {
        ToastSet(loading, 'Projeto cancelado.', 'success');

        setOrder({
          ...order,
          status: { type: 'Property', value: 'canceled' },
        });
      });
    } catch (err) { ToastSet(loading, 'Algo aconteceu. Por favor tente mais tarde.', 'error'); }
  }

  function ReopenProject () {
    setOrder({
      ...order,
      status: { type: 'Property', value: 'drawing' },
    });
  }

  const ActionButtonMobile = () => {
    if (!isInternalPage || !canEditProject) return;

    switch (order?.status?.value) {
    case 'drawing': return {
      text: 'Passar a produção',
      onClick: () => handleChangeToProduction(),
      icon: <CheckCircleOutline
        strokeWidth={pageProps?.globalVars?.iconSmStrokeWidth || 1.5}
        size={pageProps?.globalVars?.iconSize || 20}
      />,
      color: 'primary'
    };
    case 'production': return {
      text: 'Passar a montagem',
      onClick: () => handleChangeToAssembly(),
      hidden: grids.lowerGrids[0].colls[2].value !== '100',
      icon: <CheckCircleOutline
        strokeWidth={pageProps?.globalVars?.iconSmStrokeWidth || 1.5}
        size={pageProps?.globalVars?.iconSize || 20}
      />,
      color: 'primary'
    };
    case 'testing': return {
      text: 'Passar a embalamento',
      onClick: () => handleChangeToPacking(),
      icon: <CheckCircleOutline
        strokeWidth={pageProps?.globalVars?.iconSmStrokeWidth || 1.5}
        size={pageProps?.globalVars?.iconSize || 20}
      />,
      color: 'primary'
    };
    case 'packing': return {
      text: 'Passar a expedição',
      onClick: () => handleChangeToTransport(),
      icon: <CheckCircleOutline
        strokeWidth={pageProps?.globalVars?.iconSmStrokeWidth || 1.5}
        size={pageProps?.globalVars?.iconSize || 20}
      />,
      color: 'primary'
    };
    case 'transport': return {
      text: 'Terminar',
      onClick: () => handleChangeToFinished(),
      icon: <CheckCircleOutline
        strokeWidth={pageProps?.globalVars?.iconSmStrokeWidth || 1.5}
        size={pageProps?.globalVars?.iconSize || 20}
      />,
      color: 'primary'
    };
    }
  };

  return <Box id='pad'>
    <Notification />
    <ConfirmDialog
      open={deleteModal}
      handleClose={() => setDeleteModal(false)}
      onConfirm={() => onDelete()}
      message={'Está prestes a apagar um projeto, o que é irreversível, tem certeza que quer continuar?'}
    />
    <FinishProjectModal open={changeToFinishedModal} handleClose={() => setChangeToFinishedModal(false)} onConfirm={(e) => onProjectScanned(e)} />
    <ConfirmDialog
      open={changeToProdModal}
      handleClose={() => setChangeToProdModal(false)}
      onConfirm={() => handleChangeToProd('production')}
      message={'Está prestes a passar este projeto para produção. Tem a certeza que quer continuar?'}
    />
    <ConfirmDialog
      open={changeToAssemblyModal}
      handleClose={() => setChangeToAssemblyModal(false)}
      onConfirm={() => handleChangeToProd('testing')}
      message={'Está prestes a passar este projeto para montagem. Tem a certeza que quer continuar?'}
    />
    <ConfirmDialog
      open={changeToTransportModal}
      handleClose={() => setChangeToTransportModal(false)}
      onConfirm={() => handleChangeToProd('transport')}
      message={'Está prestes a passar este projeto para transporte. Tem a certeza que quer continuar?'}
    />
    <ConfirmDialog
      open={finishModal}
      handleClose={() => setFinishModal(false)}
      onConfirm={() => handleChangeToProd('finished')}
      message={'Está prestes a terminar este projeto. Tem a certeza que quer continuar?'}
    />
    <Box style={{ display: 'flex', marginBottom: '1rem' }}>
      <Grid container md={12} sm={12} xs={12}>
        <Typography variant="sm" color="lightTextSm.main" display={!isInternalPage && 'none'}>
          {'Cliente '}
          {order.orderBy.object?.isCompany ? 'Empresarial: ' : 'Particular: '}
          <Tooltip title={CanDo('see_client') ? 'Ver cliente' : ''}>
            <a href={ CanDo('see_client') && routes.private.internal.client + order.orderBy?.object?.id} target="_blank" rel="noreferrer" >
              <Typography variant='sm' color={CanDo('see_client') && 'primary.main'}> {`${order.orderBy?.object?.user?.first_name} ${order.orderBy?.object?.user?.last_name}`}</Typography>
            </a>
          </Tooltip>
        </Typography>
        <Grid container md={12} sm={12} xs={12}>
          <Typography variant='title'>{order.name.value}</Typography>
          <Box display={'flex'} alignItems='center' pl={2}>
            {order.status?.value === 'drawing' && <Typography variant='sm' className='drawingBalloon'>Pendente desenho</Typography>}
            {order.status?.value === 'production' && <Typography variant='sm' className='productionBalloon'>Pendente produção</Typography>}
            {order.status?.value === 'testing' && <Typography variant='sm' className='assemblyBalloon'>Pendente montagem</Typography>}
            {order.status?.value === 'packing' && <Typography variant='sm' className='packingBalloon'>Pendente Embalamento</Typography>}
            {order.status?.value === 'transport' && <Typography variant='sm' className='expeditionBalloon'>Pendente Expedição</Typography>}
            {order.status?.value === 'finished' && <Typography variant='sm' className='successBalloon'>Terminado</Typography>}
            {order.status?.value === 'canceled' && <Typography variant='sm' className='errorBalloon'>Cancelado</Typography>}
          </Box>
        </Grid>
      </Grid>
      <Buttons
        buttons={[
          {
            text: 'Editar',
            color: 'primary',
            hidden: !(order.status.value !== 'canceled' && canEditProject) || !isInternalPage,
            icon: <Edit2 strokeWidth={pageProps?.globalVars?.iconSmStrokeWidth || 1.5} size={pageProps?.globalVars?.iconSize || 20} />,
            href: routes.private.internal.editBudget + order.hasBudget.object.id,
            sx: { borderColor: 'transparent' }
          },
          {
            text: 'Apagar',
            color: 'error',
            hidden: !(canDeleteProject) || !isInternalPage,
            icon: <Trash strokeWidth={pageProps?.globalVars?.iconSmStrokeWidth || 1.5} size={pageProps?.globalVars?.iconSize || 20} />,
            onClick: () => setDeleteModal(true),
          },
          {
            text: 'Cancelar projeto',
            color: 'warning',
            hidden: !(order.status.value !== 'canceled' && canEditProject) || !isInternalPage,
            icon: <Close strokeWidth={pageProps?.globalVars?.iconSmStrokeWidth || 1.5} size={pageProps?.globalVars?.iconSize || 20} />,
            onClick: CancelProject,
            sx: { borderColor: 'transparent' }
          },
          {
            text: 'Reativar',
            color: 'warning',
            hidden: !(order.status.value === 'canceled' && canEditProject) || !isInternalPage || true,
            icon: <Power strokeWidth={pageProps?.globalVars?.iconSmStrokeWidth || 1.5} size={pageProps?.globalVars?.iconSize || 20} />,
            onClick: ReopenProject
          },
          {
            ...ActionButtonMobile(),
            divider: true,
            sx: { borderColor: 'transparent' }
          }
        ]}
      />

    </Box>
    <Grid container md={12}>
      <HeaderGrid grids={ grids.upperGrids }/>
      <HeaderGrid grids={ grids.lowerGrids }/>
      <Grid container md={12} p={1}>
        <Grid container style={{ width: 'fit-content' }}>
          <Grid container md={8}>
            <Grid container p={1}>
              <Grid container md={12} sm={12} xs={12} >
                {/* Headers */}
                <Grid container md={12} sm={12} xs={12} sx={{ borderBottom: '1px solid', p: 0.5, borderColor: 'divider' }}>
                  <Grid {...tableFirstCell} sx={{ border: 'none' }}><Typography fontWeight={'bold'} variant="subtitle2">Morada</Typography></Grid>
                  {/* <Grid {...tableLastCell} sx={{ border: 'none' }} ><Typography item color='lightTextSm.main'></Typography>Entrega</Grid> */}
                </Grid>
                {/* Postal Code */}
                <Grid container md={12} sm={12} xs={12}>
                  <Grid {...tableFirstCell}><Typography item color='lightTextSm.black'>Código Postal</Typography></Grid>
                  <Grid {...tableLastCell}><Typography item color='lightTextSm.black'>{order.hasBudget?.object?.deliveryAddress?.value?.postalCode}</Typography></Grid>
                </Grid>
                {/* Street */}
                <Grid container md={12} sm={12} xs={12}>
                  <Grid {...tableFirstCell}><Typography item color='lightTextSm.black'>Rua</Typography></Grid>
                  <Grid {...tableLastCell}><Typography item color='lightTextSm.black'>{order.hasBudget?.object?.deliveryAddress?.value?.streetAddress}</Typography></Grid>
                </Grid>
                {/* addressLocality */}
                <Grid container md={12} sm={12} xs={12}>
                  <Grid {...tableFirstCell}><Typography item color='lightTextSm.black'>Localidade</Typography></Grid>
                  <Grid {...tableLastCell}><Typography item color='lightTextSm.black'>{order.hasBudget?.object?.deliveryAddress?.value?.addressLocality}</Typography></Grid>
                </Grid>
                {/* addressRegion */}
                <Grid container md={12} sm={12} xs={12}>
                  <Grid {...tableFirstCell}><Typography item color='lightTextSm.black'>Região</Typography></Grid>
                  <Grid {...tableLastCell}><Typography item color='lightTextSm.black'>{order.hasBudget?.object?.deliveryAddress?.value?.addressRegion}</Typography></Grid>
                </Grid>
                {/* addressCountry */}
                <Grid container md={12} sm={12} xs={12} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Grid {...tableFirstCell}><Typography item color='lightTextSm.black'>País</Typography></Grid>
                  <Grid {...tableLastCell}><Typography item color='lightTextSm.black'>{reduxState?.countries?.data?.find(ele => ele.cca2 === order.hasBudget?.object?.deliveryAddress?.value?.addressCountry)?.name?.common}</Typography></Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  </Box>;
};

export default Head;
