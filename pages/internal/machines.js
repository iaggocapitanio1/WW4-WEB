/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Loader from '../../components/loader/loader';
import Machinescreen from '../../components/pages/machines/machines';
import routes from '../../navigation/routes';
//  Actions
import * as machinesActionsRedux from '../../store/actions/machine';

const Machines = () => {
  const [loaded, setLoaded] = useState(false);
  const [machines, setMachines] = useState();
  const [machinesTypes, setMachinesTypes] = useState();
  const dispatch = useDispatch();
  const getMachines = (data) => dispatch(machinesActionsRedux.machines(data));

  useEffect(() => {
    const getData = async () => {
      const { data: machinesData } = await getMachines();

      const mappedMachines = machinesData.map((mach) => {
        return { ...mach, Nome: mach.name?.value, Tipo: mach.machineType?.value, Occupied: !!mach.currentlyOn?.value };
      });

      const types = mappedMachines.reduce((acc, machine) => {
        const machineType = machine.machineType.value;

        if (!acc.includes(machineType)) {
          acc.push(machineType);
        }

        return acc;
      }, []);

      setMachinesTypes(types);
      setMachines(mappedMachines);
    };

    Promise.all([getData()]).then(() => setLoaded(true));
  }, []);

  if (loaded && machines) {
    const breadcrumbsPath = [
      {
        title: 'Máquinas',
        href: `${routes.private.internal.machines}`,
      }
    ];

    const headCells = [
      {
        id: 'Nome',
        label: 'Nome',
        show: true,
      },
      {
        id: 'Tipo',
        label: 'Tipo',
        show: true,
      },
      {
        id: 'Occupied',
        label: 'Estado',
        show: true,
      },
      {
        id: 'actions',
        numeric: true,
        label: 'Ações',
        show: true,
      },
    ];

    const props = {
      breadcrumbsPath,
      headCells,
      machines,
      machinesTypes: machinesTypes.map((mach) => { return { id: mach, label: mach }; })
    };

    return <Machinescreen {...props} />;
  }

  return <Loader center={true} />;
};

export default Machines;
