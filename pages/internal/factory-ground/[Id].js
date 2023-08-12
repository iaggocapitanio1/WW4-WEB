//  Nodes
import React, { useEffect, useState } from 'react';

import FactoryGroundProjectScreen from '../../../components/pages/factoryGroundProject/factoryGroundProject';

import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import Loader from '../../../components/loader/loader';
import routes from '../../../navigation/routes';
import * as clientsActionsRedux from '../../../store/actions/client';
import * as consumablesActionsRedux from '../../../store/actions/consumable';
import * as furnituresActionsRedux from '../../../store/actions/furniture';
import * as machineActionsRedux from '../../../store/actions/machine';
import * as partsActionsRedux from '../../../store/actions/part';
import * as projectsActionsRedux from '../../../store/actions/project';
import * as workerTasksActionsRedux from '../../../store/actions/workerTask';

const Order = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [machines, setMachines] = useState();
  const [parts, setParts] = useState();
  const [client, setClient] = useState();
  const [consumables, setConsumables] = useState();
  const [furniture, setFurniture] = useState();
  const [logsWorkerTasks, setLogsWorkerTasks] = useState();
  const [project, setProject] = useState();
  const [activeWorkerTasks, setActiveWorkerTasks] = useState();
  const getConsumables = (data) => dispatch(consumablesActionsRedux.projectConsumables(data));
  const getMachines = (data) => dispatch(machineActionsRedux.machines(data));
  const getWorkerTasks = (data) => dispatch(workerTasksActionsRedux.workerTasks(data));
  const getParts = (data) => dispatch(partsActionsRedux.projectParts(data));
  const getProject = (data) => dispatch(projectsActionsRedux.projects(data));
  const getFurniture = (data) => dispatch(furnituresActionsRedux.furniture(data));
  const getClient = (data) => dispatch(clientsActionsRedux.client(data));

  useEffect(() => {
    async function load () {
      const { data: furniture } = await getFurniture(router.query.Id);
      const { data: project } = await getProject({ hasBudget: furniture.hasBudget.object });
      const { data: machines } = await getMachines();
      const { data: client } = await getClient(project[0].orderBy.object);
      const { data: parts } = await getParts([{ key: 'belongsTo', value: project[0].id }, { key: 'belongsToFurniture', value: furniture.id }]);
      const { data: consumables } = await getConsumables([{ key: 'belongsTo', value: project[0].id }, { key: 'belongsToFurniture', value: furniture.id }]);
      const { data: logsWorkerTasks } = await getWorkerTasks({ onProject: project[0].id });

      setClient(client);

      const builtParts = parts.map((part) => ({
        ...part,
        logs: logsWorkerTasks.filter((ele) => ele.executedOn.object === part.id),
        ...Object.fromEntries(
          Object.entries(part).map(([key, value]) => [
            key,
            value.type === 'Property' ? value.value : value.type === 'Relationship' ? value.object : value,
          ])
        ),
        inProduction: false,
        f: !!part.f2 || !!part.f3 || !!part.f4 || !!part.f5,
        orla: !!part.orla2 || !!part.orla3 || !!part.orla4 || !!part.orla5,
      }));

      const mappedMachines = machines.map((machine) => ({
        ...machine,
        Nome: machine.name?.value || machine.id.replace('urn:ngsi-ld:Machine:', ''),
      }));

      const grouped = mappedMachines.reduce((acc, machine) => {
        const machineType = machine.machineType.value;

        acc[machineType] = acc[machineType] || [];
        acc[machineType].push(machine);

        return acc;
      }, {});

      const result = Object.entries(grouped).flatMap(([machineType, machines]) => [
        { subheader: true, Nome: machineType },
        ...machines,
      ]);

      setMachines(result);
      setParts(builtParts);
      setFurniture(furniture);
      setConsumables(consumables);
      setProject(project[0]);
      setActiveWorkerTasks(logsWorkerTasks.filter((ele) => !ele.finishTime?.value));
      setLogsWorkerTasks(logsWorkerTasks);
    }

    load().then(() => setLoaded(true));
  }, []);

  if (loaded) {
    const breadcrumbsPath = [
      {
        title: 'Chão de Fabrica',
        href: `${routes.private.internal.factorys}`,
      }, {
        title: furniture?.name?.value,
        href: `${routes.private.internal.factory}`,
      }
    ];

    const props = {
      breadcrumbsPath,
      machines,
      parts,
      consumables,
      furniture,
      logsWorkerTasks,
      project,
      client,
      activeWorkerTasks,
    };

    return <FactoryGroundProjectScreen {...props} />;
  }

  return <Loader center={true} />;
};

export default Order;
