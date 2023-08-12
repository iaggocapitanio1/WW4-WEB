//  Nodes
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

//  Preloader
import Loader from '../../components/loader/loader';

//  Page Component
import OrdersScreen from '../../components/pages/ordersSimilar/projects-similar';

//  Navigation
import routes from '../../navigation/routes';

//  Services
import moment from 'moment/moment';
import displayDateDifference from '../../components/utils/DisplayDateDifference';
import * as assemblyActionsRedux from '../../store/actions/assembly';
import * as budgetsActionsRedux from '../../store/actions/budget';
import * as clientsActionsRedux from '../../store/actions/client';
import * as expeditionsActionsRedux from '../../store/actions/expedition';
import * as furnituresActionsRedux from '../../store/actions/furniture';
import * as projectsActionsRedux from '../../store/actions/project';
import * as workerTasksActionsRedux from '../../store/actions/workerTask';

const OrdersSimilar = () => {
  const [loaded, setLoaded] = useState(false);
  const [projects, setProjects] = useState();
  const reduxState = useSelector((state) => state);
  const dispatch = useDispatch();
  const getProjects = (data) => dispatch(projectsActionsRedux.projects(data));
  const getClients = (data) => dispatch(clientsActionsRedux.clients(data));
  const getBudgets = (data) => dispatch(budgetsActionsRedux.budgets(data));
  const getExpeditions = (data) => dispatch(expeditionsActionsRedux.expeditions(data));
  const getFurnitures = (data) => dispatch(furnituresActionsRedux.furnitures(data));
  const getWorkerTasks = (data) => dispatch(workerTasksActionsRedux.workerTasks(data));
  const getAssemblys = (data) => dispatch(assemblyActionsRedux.assemblys(data));

  function getTaskTimeRange (tasks) {
    const startTimes = tasks.map(task => moment(task.startTime.value, 'DD/MM/YYYY HH:mm:ss'));
    const finishTimes = tasks.map(task => moment(task.finishTime.value, 'DD/MM/YYYY HH:mm:ss'));
    const minStartTime = new Date(Math.min(...startTimes));
    const maxFinishTime = new Date(Math.max(...finishTimes));

    return { minStartTime: moment(minStartTime).format('DD/MM/YYYY HH:mm'), maxFinishTime: moment(maxFinishTime).format('DD/MM/YYYY HH:mm') };
  }

  useEffect(() => {
    const getData = async () => {
      const [
        clientsResponse,
        expeditionsResponse,
        assemblysResponse,
        budgetsResponse,
        projectsResponse,
        furnituresResponse,
      ] = await Promise.all([
        getClients(),
        getExpeditions([{ key: 'deliveryTime', value: '', operator: '!=' }]),
        getAssemblys([{ key: 'finishTime', value: '', operator: '!=' }]),
        getBudgets({ status: 'adjudicated' }),
        getProjects({ status: 'finished' }),
        getFurnitures(),
      ]);

      const clients = clientsResponse.data.results;
      const expeditions = expeditionsResponse.data;
      const assemblys = assemblysResponse.data;
      const budgets = budgetsResponse.data;
      const projectsData = projectsResponse.data;
      const furnitures = furnituresResponse.data;

      const projectBudgets = await Promise.all(
        projectsData?.map(async (project) => {
          const budget = budgets.find((ele) => ele.id === project.hasBudget.object);
          const assembly = assemblys.find((ele) => ele.id === project.assembly.object);
          const expedition = expeditions.find((ele) => ele.id === project.expedition.object);

          const furnitures1 = furnitures.filter(
            (ele) => ele.hasBudget.object === project.hasBudget.object && ele.furnitureType.value === 'furniture'
          );

          const client = clients.find((ele) => ele.id === project.orderBy.object.replace('urn:ngsi-ld:Owner:', ''));
          const { data: logsWorkerTasks } = await getWorkerTasks({ onProject: project.id });

          const furnitures2 = furnitures1
            .sort((a, b) => (a.lineNumber?.value > b.lineNumber?.value ? 1 : -1))
            .map((furni) => {
              const { minStartTime, maxFinishTime } = getTaskTimeRange(
                logsWorkerTasks.filter((ele) => ele.onFurniture?.value === furni.id)
              );

              return {
                ...furni,
                beginProd: { value: minStartTime !== 'Invalid date' ? minStartTime : '' },
                endProd: { value: maxFinishTime !== 'Invalid date' ? maxFinishTime : '' },
              };
            });

          const projCreated = moment(project.createdAt);
          const predicted = displayDateDifference(projCreated, budget?.dateDeliveryProject?.value);
          const done = displayDateDifference(projCreated, expedition?.deliveryTime?.value);
          const desvio = displayDateDifference(projCreated, budget?.dateDeliveryProject?.value);

          return {
            ...project,
            Início: moment(project.createdAt).format('DD/MM/YYYY'),
            begin: { value: moment(project.createdAt).format('DD/MM/YYYY') },
            end: {
              value: expedition?.expeditionTime?.value
                ? moment(expedition?.expeditionTime?.value, 'DD/MM/YYYY hh:mm:ss').format('DD/MM/YYYY')
                : '',
            },
            beginAssembly: { value: assembly?.startTime.value },
            endAssembly: { value: assembly?.finishTime.value },
            budget,
            predicted,
            done,
            client,
            assembly,
            furnitures: furnitures2,
            desvio,
            Desvio: desvio,
            Realizado: done,
            Número: budget?.num?.value,
            Nome: project.name?.value,
            ClienteLabel: client?.user?.first_name + ' ' + client?.user?.last_name,
            Cliente: client?.id,
            Previsto: predicted,
            Quantidade: project?.amount?.value,
            Fim: expedition?.expeditionTime?.value
              ? moment(expedition?.expeditionTime?.value, 'DD/MM/YYYY hh:mm:ss').format('DD/MM/YYYY')
              : '',
          };
        })
      );

      setProjects(projectBudgets);
      setLoaded(true);
    };

    getData();
  }, []);

  if (loaded) {
    //  Breadcrumbs path feed
    const breadcrumbsPath = [
      {
        title: 'Projetos Similares',
        href: `${routes.private.internal.similarProjects}`,
      },
    ];

    //  Page Props
    const props = {
      projects,
      breadcrumbsPath,
      clients: [...reduxState.clients?.data].map(client => {
        const client2 = { ...client };

        client2.Nome = client.user.first_name + ' ' + client.user.last_name;
        client2.Email = client.user.email;

        return client2;
      }),
    };

    //  Verifies if all data as been loaded and set page to fully Loaded
    return <OrdersScreen {...props} />;
  }

  return <Loader center={true} />;
};

export default OrdersSimilar;
