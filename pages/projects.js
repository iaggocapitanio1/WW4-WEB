import { Layers, Network, PackageCheck, PackagePlus, PenTool, Truck } from 'lucide-react';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/loader/loader';
import OrdersScreen from '../components/pages/projects/projects';
import routes from '../navigation/routes';
import * as assemblysActionsRedux from '../store/actions/assembly';
import * as budgetsActionsRedux from '../store/actions/budget';
import * as clientsActionsRedux from '../store/actions/client';
import * as expeditionsActionsRedux from '../store/actions/expedition';
import * as projectsActionsRedux from '../store/actions/project';

const Orders = ({ ...pageProps }) => {
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();
  const reduxState = useSelector((state) => state);
  const getProjects = (data) => dispatch(projectsActionsRedux.myProjects(data));
  const getBudgets = (data) => dispatch(budgetsActionsRedux.myBudgets(data));
  const getClients = (data) => dispatch(clientsActionsRedux.clients(data));
  const getExpeditions = (data) => dispatch(expeditionsActionsRedux.expeditions(data));
  const getAssemblys = (data) => dispatch(assemblysActionsRedux.assemblys(data));

  async function fetchData () {
    let errors = false;

    try {
      await getProjects(reduxState.auth.me.id);
      await getClients();
      await getExpeditions();
      await getAssemblys();
      await getBudgets();
    } catch (err) {
      errors = true;
    }

    return !errors;
  }

  useEffect(() => {
    async function loadData () {
      setLoaded(await fetchData(dispatch));
    }

    loadData();
  }, []);

  if (loaded) {
    //  Breadcrumbs path feed
    const breadcrumbsPath = [
      {
        title: 'Projetos',
        href: `${routes.private.internal.projects}`,
      },
    ];

    const counts = {
      waitingBudget: 0,
      waitingAdjudication: 0,
      drawing: 0,
      production: 0,
      expedition: 0,
      concluded: 0,
      packing: 0,
      testing: 0,
    };

    reduxState.budgets?.data?.forEach((bud) => {
      switch (bud.budgetStatus?.value) {
      case 'needs analysis':
        counts.waitingAdjudication++;

        break;
      case 'waiting budget':
        counts.waitingAdjudication++;

        break;
      case 'waiting adjudication':
        counts.waitingAdjudication++;

        break;
      }
    });

    reduxState.projects?.data?.forEach((proj) => {
      switch (proj.status?.value) {
      case 'drawing':
        counts.drawing++;

        break;
      case 'production':
        counts.production++;

        break;
      case 'transport':
        counts.expedition++;

        break;
      case 'testing':
        counts.testing++;

        break;
      case 'packing':
        counts.packing++;

        break;
      case 'finished':
        counts.concluded++;

        break;
      }
    });

    const cards = [
      {
        id: ['waiting adjudication', 'needs analysis', 'waiting budget'],
        num: 1,
        title: 'Pré Adjudicação',
        amount: counts.waitingAdjudication,
        icon: (
          <Layers
            size={'60%'}
            strokeWidth={pageProps?.globalVars?.iconStrokeWidth || 1}
          />
        ),
        color: '#225EE8',
      },
      {
        id: 'drawing',
        num: 2,
        title: 'Pendente Desenho',
        amount: counts.drawing,
        icon: (
          <PenTool
            size={'60%'}
            strokeWidth={pageProps?.globalVars?.iconStrokeWidth || 1}
          />
        ),
        color: '#602778',
      },
      {
        id: 'production',
        num: 3,
        title: 'Pendente Produção',
        amount: counts.production,
        icon: (
          <PackagePlus
            size={'60%'}
            strokeWidth={pageProps?.globalVars?.iconStrokeWidth || 1}
          />
        ),
        color: '#02B0FA',
      },
      {
        id: 'testing',
        num: 4,
        title: 'Pendente Montagem',
        amount: counts.testing,
        icon: (
          <Network
            size={'60%'}
            strokeWidth={pageProps?.globalVars?.iconStrokeWidth || 1}
          />
        ),
        color: '#2C9200',
      },
      {
        id: 'packing',
        num: 4,
        title: 'Pendente Embalamento',
        amount: counts.packing,
        icon: (
          <PackageCheck
            size={'60%'}
            strokeWidth={pageProps?.globalVars?.iconStrokeWidth || 1}
          />
        ),
        color: '#DF9100',
      },
      {
        id: 'transport',
        num: 5,
        title: 'Pendente Expedição',
        amount: counts.expedition,
        icon: (
          <Truck
            size={'60%'}
            strokeWidth={pageProps?.globalVars?.iconStrokeWidth || 1}
          />
        ),
        color: '#BB3D03',
      },
    ];

    const headCellsProjects = [
      {
        id: 'Nome',
        numeric: false,
        disablePadding: false,
        label: 'Nome',
        show: true,
      },
      {
        id: 'Numero',
        numeric: false,
        disablePadding: false,
        label: 'Número',
        show: true,
      },
      {
        id: 'Estado',
        numeric: false,
        disablePadding: false,
        label: 'Estado',
        show: true,
      },
      {
        id: 'PrimeiroContacto',
        numeric: false,
        disablePadding: false,
        label: 'Data',
        show: true,
      },
      {
        id: 'InícioProd',
        numeric: false,
        disablePadding: false,
        label: 'Início Prod.',
        show: true,
      },
      {
        id: 'TerminoProd',
        numeric: false,
        disablePadding: false,
        label: 'Fim Prod.',
        show: true,
      },
      {
        id: 'ExpeditionTime',
        numeric: false,
        disablePadding: false,
        label: 'Entrada Expedição',
        show: true,
      },
      {
        id: 'EntregaProj',
        numeric: false,
        disablePadding: false,
        label: 'Entrega Acordada',
        show: true,
      },
    ];

    const budgets = [...reduxState.budgets?.data ?? []].map((bud) => {
      return bud?.status?.value !== 'adjudicated' && {
        ...bud,
        Estado: bud?.budgetStatus?.value,
        Nome: bud?.name?.value.replace(/_/g, ' '),
        Created: moment(bud?.createdAt).format('DD/MM/YYYY'),
        PrimeiroContacto: bud?.dateRequest?.value,
        Entregue: bud?.dateDelivery?.value,
        Referência: `${bud?.name?.value.replace(/_/g, ' ')} ECL 2023/000100`,
        Numero: bud?.num?.value,
        EntregaProj: bud?.dateDeliveryProject?.value,
      };
    });

    const filteredBudgets = budgets.filter(item => item !== false);

    const projects = [...reduxState.projects?.data ?? []].map((proj) => {
      const thisBudget = reduxState.budgets?.data.find((ele) => ele.id === proj.hasBudget?.object);
      const thisExpedition = reduxState.expeditions?.data.find((ele) => ele.id === proj.expedition.object);
      const thisAssembly = reduxState.assemblys?.data.find((ele) => ele.id === proj.assembly?.object);

      return {
        ...proj,
        Estado: proj?.status?.value,
        Nome: proj?.name?.value?.replace(/_/g, ' '),
        budget: thisBudget,
        Início: moment(proj?.createdAt).format('DD/MM/YYYY'),
        Termino: thisExpedition?.deliveryTime?.value,
        Entregue: thisBudget?.dateDelivery?.value,
        Numero: thisBudget?.num?.value || 212453,
        Referência: `${proj?.id.replace('urn:ngsi-ld:Project:', '').replace(/_/g, ' ')} ECL 2023/000100`,
        EntregaProj: thisBudget?.dateDeliveryProject?.value,
        PrimeiroContacto: thisBudget?.dateRequest?.value,
        InícioProd: proj?.startedProduction?.value && moment(proj?.startedProduction?.value, 'DD/MM/YYYY hh:mm:ss').format('DD/MM/YYYY'),
        ExpeditionTime: thisExpedition?.expeditionTime?.value && moment(thisExpedition?.expeditionTime?.value, 'DD/MM/YYYY hh:mm:ss').format('DD/MM/YYYY'),
        TerminoProd: thisAssembly?.startTime?.value && moment(thisAssembly?.startTime?.value, 'DD/MM/YYYY hh:mm:ss').format('DD/MM/YYYY'),
      };
    }
    );

    const merged = [...projects, ...filteredBudgets.filter((ele) => ele.Estado !== 'adjudicated')];

    merged.sort((a, b) => a.PrimeiroContacto?.localeCompare(b.PrimeiroContacto));

    const props = {
      counts,
      breadcrumbsPath,
      cards,
      pageProps,
      headCellsProjects,
      budgets,
      items: merged,
      projects,
      detailPage: routes.private.project,
      editPage: routes.private.editProject,
      detailPageBudgetTab: routes.private.budget,
    };

    return <OrdersScreen {...props} />;
  }

  return <Loader center={true} />;
};

Orders.propTypes = {
};

export default Orders;
