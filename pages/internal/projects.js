import React, { useEffect, useState } from 'react';
import ProjectsScreen from '../../components/pages/projects/projects';
import routes from '../../navigation/routes';
import * as assemblysActionsRedux from '../../store/actions/assembly';
import * as budgetsActionsRedux from '../../store/actions/budget';
import * as clientsActionsRedux from '../../store/actions/client';
import * as expeditionsActionsRedux from '../../store/actions/expedition';
import * as projectsActionsRedux from '../../store/actions/project';
//  Icons
import { Layers, Network, PackageCheck, PackagePlus, PenTool, Truck } from 'lucide-react';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../components/loader/loader';
import { categories } from './new-project';

const Projects = ({ ...pageProps }) => {
  const dispatch = useDispatch();
  const reduxState = useSelector((state) => state);
  const getProjects = (data) => dispatch(projectsActionsRedux.projects(data));
  const getBudgets = (data) => dispatch(budgetsActionsRedux.budgets(data));
  const getClients = (data) => dispatch(clientsActionsRedux.clients(data));
  const getExpeditions = (data) => dispatch(expeditionsActionsRedux.expeditions(data));
  const getAssemblys = (data) => dispatch(assemblysActionsRedux.assemblys(data));
  const [loaded, setLoaded] = useState(false);

  async function fetchData () {
    let errors = false;

    try {
      await getBudgets();
      await getProjects();
      await getExpeditions();
      await getAssemblys();
      await getClients();
    } catch (err) { errors = true; }

    return !errors;
  }

  useEffect(() => {
    async function loadData () {
      setLoaded(await fetchData());
    }

    loadData();
  }, []);

  if (loaded) {
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

    // Breadcrumbs path feed
    const breadcrumbsPath = [
      {
        title: 'Projetos',
        href: `${routes.private.internal.projects}`,
      },
    ];

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
        id: 'ClienteLabel',
        numeric: false,
        disablePadding: false,
        label: 'Cliente',
        show: true,
      },
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
      {
        id: 'actions',
        numeric: true,
        disablePadding: false,
        label: 'Ações',
        show: true,
      },
    ];

    const clients = [...reduxState.clients?.data ?? []].map((client) => {
      return {
        ...client,
        Nome: client.user.first_name + ' ' + client.user.last_name + ' - ' + client.user.email,
        Email: client.user.email,
      };
    });

    const budgets = [...reduxState.budgets?.data ?? []].map((bud) => {
      const thisClient = clients.find(ele => ele.id === bud.orderBy.object.replace('urn:ngsi-ld:Owner:', ''));

      return bud?.budgetStatus?.value !== 'adjudicated' && {
        ...bud,
        Estado: bud?.budgetStatus?.value,
        Nome: bud?.name?.value.replace(/_/g, ' '),
        ClienteLabel: (thisClient?.user?.first_name || '') + ' ' + (thisClient?.user?.last_name || ''),
        Quantidade: bud?.amount?.value,
        Numero: bud.num?.value || 212453,
        Cliente: bud.orderBy.object,
        PrimeiroContacto: bud?.dateRequest?.value,
        EntregaProj: bud?.dateDeliveryProject?.value,

      };
    });

    const filteredBudgets = budgets.filter(item => item !== false);

    const projects = [...reduxState.projects?.data ?? []].map((proj) => {
      const thisClient = clients.find(ele => ele.id === proj.orderBy.object.replace('urn:ngsi-ld:Owner:', ''));
      const thisBudget = reduxState.budgets?.data.find((ele) => ele.id === proj.hasBudget?.object);
      const thisExpedition = reduxState.expeditions?.data.find((ele) => ele.id === proj.expedition?.object);
      const thisAssembly = reduxState.assemblys?.data.find((ele) => ele.id === proj.assembly?.object);

      return {
        ...proj,
        Quantidade: proj?.amount?.value,
        Estado: proj?.status?.value,
        Nome: proj?.name.value,
        hasBudget: { ...proj.hasBudget, ...(budgets.find((ele) => ele.id === proj.hasBudget?.object)) },
        Cliente: proj.orderBy.object,
        ClienteLabel: (thisClient?.user?.first_name || '') + ' ' + (thisClient?.user?.last_name || ''),
        Numero: thisBudget?.num?.value || 212453,
        Categoria: categories.find(c => c.id === thisBudget?.category?.value)?.label,
        Produced: proj.produced?.value,
        PrimeiroContacto: thisBudget?.dateRequest?.value,
        ExpeditionTime: thisExpedition?.expeditionTime.value && moment(thisExpedition?.expeditionTime.value, 'DD/MM/YYYY hh:mm:ss').format('DD/MM/YYYY'),
        InícioProd: proj?.startedProduction?.value && moment(proj?.startedProduction?.value, 'DD/MM/YYYY hh:mm:ss').format('DD/MM/YYYY'),
        TerminoProd: thisAssembly?.startTime?.value && moment(thisAssembly?.startTime?.value, 'DD/MM/YYYY hh:mm:ss').format('DD/MM/YYYY'),
        EntregaProj: thisBudget?.dateDeliveryProject?.value,
      };
    });

    const merged = [...projects, ...filteredBudgets];

    merged.sort((a, b) => a.PrimeiroContacto?.localeCompare(b.PrimeiroContacto));

    const props = {
      items: merged,
      counts,
      breadcrumbsPath,
      cards,
      pageProps,
      headCellsProjects,
      clients,
      budgets,
      projects: merged,
      detailPage: routes.private.internal.project,
      editPage: routes.private.internal.editBudget,
      detailPageBudgetTab: routes.private.internal.budget,
    };

    return <ProjectsScreen {...props} />;
  }

  return <Loader center={true} />;
};

export default Projects;
