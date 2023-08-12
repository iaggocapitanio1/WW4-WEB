//  Nodes
import React, { useEffect, useState } from 'react';

import MachineScreen from '../../../components/pages/machine/machine';

import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import Loader from '../../../components/loader/loader';
import displayDateDifference from '../../../components/utils/DisplayDateDifference';
import routes from '../../../navigation/routes';
import * as machineActionsRedux from '../../../store/actions/machine';
import * as workersActionsRedux from '../../../store/actions/worker';
import * as workerTasksActionsRedux from '../../../store/actions/workerTask';

const Machine = ({ pageProps }) => {
  const [loaded, setLoaded] = useState(false);
  const [machine, setMachine] = useState();
  const [machineActivity, setMachineActivity] = useState();
  const dispatch = useDispatch();
  const router = useRouter();
  const getMachine = (data) => dispatch(machineActionsRedux.machine(data));
  const getWorkers = (data) => dispatch(workersActionsRedux.workers(data));
  const getWorkerTasks = (data) => dispatch(workerTasksActionsRedux.workerTasks(data));

  useEffect(() => {
    async function load () {
      await getMachine(router.query.Id).then((res) => setMachine(res.data));

      const { data: workers } = await getWorkers();
      const { data: logsWorkerTasks } = await getWorkerTasks({ machine: router.query.Id });

      setMachineActivity(logsWorkerTasks.map((ele) => {
        const worker = workers.results?.find(worker => worker.user.id === ele.executedBy?.object.replace('urn:ngsi-ld:Worker:', ''));
        const spaceIndex = ele.executedOn.object.replace(/_/g, ' ').indexOf(' ');
        let resultString = '';

        if (spaceIndex !== -1) resultString = ele.executedOn.object.substring(spaceIndex + 1);

        return {
          ...ele,
          StartedAt: ele.startTime.value,
          FinishedAt: ele.finishTime.value,
          UsedIn: resultString.replace(/_/g, ' '),
          Duration: displayDateDifference(ele.startTime.value, ele.finishTime.value),
          DoneBy: worker && worker.user?.first_name + ' ' + worker.user?.last_name,
        };
      }));
    }

    load().then(() => setLoaded(true));
  }, []);

  if (loaded) {
    const breadcrumbsPath = [
      {
        title: 'Máquinas',
        href: `${routes.private.internal.machines}`,
      },
      {
        title: machine.name.value,
        href: `${routes.private.internal.profile}${machine.id}`,
      },
    ];

    const headCells = [
      {
        id: 'UsedIn',
        numeric: false,
        disablePadding: false,
        label: 'Usada em',
        show: true,
      },
      {
        id: 'DoneBy',
        numeric: false,
        disablePadding: false,
        label: 'Usada por',
        show: true,
      },
      {
        id: 'StartedAt',
        numeric: false,
        disablePadding: false,
        label: 'Inicio',
        show: true,
      },
      {
        id: 'FinishedAt',
        numeric: false,
        disablePadding: false,
        label: 'Fim',
        show: true,
      },
      {
        id: 'Duration',
        numeric: false,
        disablePadding: false,
        label: 'Duração',
        show: true,
      },
    ];

    const props = {
      breadcrumbsPath,
      pageProps,
      machine,
      machineActivity,
      headCells
    };

    return <MachineScreen {...props} />;
  }

  return <Loader center={true} />;
};

Machine.propTypes = {
  pageProps: PropTypes.any,
};

export default Machine;
