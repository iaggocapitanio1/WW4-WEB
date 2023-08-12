/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable react/prop-types */
import { AppBar, Box, Button, Dialog, Grid, Grow, IconButton, Menu, Popover, Tab, Tabs, Toolbar, Tooltip, Typography } from '@mui/material';
import * as icons from 'lucide-react';
import { Check, CheckCircle, Eye, MinusCircle, Play, X } from 'lucide-react';
import moment from 'moment';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import routes from '../../../../navigation/routes';
import companyLogo from '../../../../public/Logotipo_Vetorizado.png';
import woodWorkyLogo from '../../../../public/logo_bw_ww40_inv-big.png';
import * as consumablesActionsRedux from '../../../../store/actions/consumable';
import * as furnituresActionsRedux from '../../../../store/actions/furniture';
import * as machineActionsRedux from '../../../../store/actions/machine';
import * as partsActionsRedux from '../../../../store/actions/part';
import * as projectActionsRedux from '../../../../store/actions/project';
import * as workerTasksActionsRedux from '../../../../store/actions/workerTask';
import CustomBreadcrumbs from '../../../breadcrumbs/breadcrumbs';
import PrimaryBtn from '../../../buttons/primaryBtn';
import Content from '../../../content/content';
import Notification from '../../../dialogs/Notification';
import MySelect from '../../../inputs/select';
import Loader from '../../../loader/loader';
import formatString from '../../../utils/FormatString';
import TabPanel from '../../dashboard/TabPanel';
import { Transition } from '../factoryGround';

export const PartStatus = ({ part }) => {
  // if (part.complete) return <Typography variant='sm'className='successBalloon'>Completo</Typography>;

  const actions = {
    isNest: part.nestingFlag,
    isCnc: part.cncFlag,
    isOrla: part.orla || part.orla2 || part.orla3 || part.orla4 || part.orla5,
    isFuroFace: part.f || part.f2 || part.f3 || part.f4 || part.f5,
    isTupia: part.tupia,
  };

  console.log(part);

  let complete = true;

  if (actions.isNest) {
    const haveLogs = part.logs?.find(log => log?.action?.value === 'nestingFlag' && log?.finishTime?.value !== '');

    if (!haveLogs) complete = false;
  }

  if (actions.isCnc) {
    const haveLogs = part.logs?.find(log => log?.action?.value === 'cncFlag' && log?.finishTime?.value !== '');

    if (!haveLogs) complete = false;
  }

  if (actions.isOrla) {
    const haveLogs = part.logs?.find(log => log?.action?.value === 'orla' && log?.finishTime?.value !== '');

    if (!haveLogs) complete = false;
  }

  if (actions.isFuroFace) {
    const haveLogs = part.logs?.find(log => log?.action?.value === 'f' && log?.finishTime?.value !== '');

    if (!haveLogs) complete = false;
  }

  if (actions.isTupia) {
    const haveLogs = part.logs?.find(log => log?.action?.value === 'tupia' && log?.finishTime?.value !== '');

    if (!haveLogs) complete = false;
  }

  if (complete) return <Typography variant='sm'className='successBalloon'>Completo</Typography>;
  else if (part.logs?.find(ele => ele.finishTime.value === '')) return <Typography variant='sm'className='infoBalloon'>Em produção</Typography>;
};

const FurnitureDetails = (props) => {
  const { open, detailOnly, onClose, furnitureProject } = props;
  const reduxState = useSelector((state) => state);
  // const [state, setState] = useState({
  //   open: props.open,
  //   detailOnly: props.detailOnly,
  //   onClose: props.onClose,
  //   furnitureProject: props.furnitureProject,
  //   productionDetailModal: false,
  //   myMachine: null,
  //   chosenFurniture: props.chosenFurniture,
  //   machines: props.machines,
  //   consumables: null,
  //   fullyLoaded: false,
  //   openPopover: null,
  //   value: 0,
  //   activeWorkerTasks: '',
  //   me: reduxState.auth.me
  // });
  const [productionDetailModal, setProductionDetailModal] = useState(false);
  const [myMachine, setMyMachine] = useState();
  const [chosenFurniture, setChosenFurniture] = useState(props.chosenFurniture);
  const [machines, setMachines] = useState(props.machines);
  const [consumables, setConsumables] = useState();
  const [fullyLoaded, setFullyLoaded] = useState(false);
  const [openPopover, setOpenPopover] = useState(null);
  const [value, setValue] = useState(0);
  const [activeWorkerTasks, setActiveWorkerTasks] = useState();
  const me = reduxState.auth.me;
  const dispatch = useDispatch();
  const getWorkerTasks = (data) => dispatch(workerTasksActionsRedux.workerTasks(data));
  const newWorkerTask = (data) => dispatch(workerTasksActionsRedux.newWorkerTask(data));
  const updateWorkerTask = (data) => dispatch(workerTasksActionsRedux.updateWorkerTask(data));
  const getParts = (data) => dispatch(partsActionsRedux.projectParts(data));
  const updatePart = (data) => dispatch(partsActionsRedux.updatePart(data));
  const newPart = (data) => dispatch(partsActionsRedux.newPart(data));
  const newConsumable = (data) => dispatch(consumablesActionsRedux.newConsumable(data));
  const updateMachine = (data) => dispatch(machineActionsRedux.updateMachine(data));
  const getConsumables = (data) => dispatch(consumablesActionsRedux.projectConsumables(data));
  const getMachines = (data) => dispatch(machineActionsRedux.machines(data));
  const updateProject = (data) => dispatch(projectActionsRedux.updateProject(data));
  const updateFurniture = (data) => dispatch(furnituresActionsRedux.updateFurniture(data));
  const IconComponent = icons.Loader;

  useEffect(() => {
    async function loadData () {
      try {
        const { data: machines } = await getMachines();

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

        const { data: logsWorkerTasks } = await getWorkerTasks({ onProject: furnitureProject.id });

        setActiveWorkerTasks(logsWorkerTasks.filter((ele) => !ele.finishTime?.value));

        const activeLogWorkerTask = logsWorkerTasks.find((ele) => ele.executedBy?.object === `urn:ngsi-ld:Worker:${me.id}` && !ele.finishTime?.value);

        setMyMachine(activeLogWorkerTask ? mappedMachines.find((ele) => ele.id === activeLogWorkerTask.machine?.value) : null);

        const { data: parts } = await getParts([
          { key: 'belongsTo', value: furnitureProject.id },
          { key: 'belongsToFurniture', value: chosenFurniture.id },
        ]);

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

        setProjectParts(builtParts);

        const { data: consumables } = await getConsumables([
          { key: 'belongsTo', value: furnitureProject.id },
          { key: 'belongsToFurniture', value: chosenFurniture.id },
        ]);

        setConsumables(consumables);
      } catch (error) {
        console.error(error);
      } finally {
        setFullyLoaded(true);
      }
    }

    loadData();
  }, []);

  const [projectParts, setProjectParts] = useState(props?.projectParts);

  function createParts () {
    const newParts2 = [
      // { obs: 'Esta tabua tem que ser cortada assim', complete: false, belongsTo: chosenFurniture.id, partName: 'BAR_B_COSTA1', id: formatString(chosenFurniture.name.value) + '_BAR_B_COSTA1', material: 'HDF 3', amount: 1, length: '1471', width: '1000', thickness: '3', tag: 1, nestingFlag: false, cncFlag: false, orla2: true, f2: false },
      // { obs: '', complete: false, belongsTo: furnitureProject.id, belongsToFurniture: chosenFurniture.id, partName: 'BAR_B_COSTA2', id: formatString(chosenFurniture.name.value) + '_BAR_B_COSTA2', material: 'HDF 3', amount: 1, length: '1476', width: '1000', thickness: '3', tag: 2, nestingFlag: false, cncFlag: false, orla2: true, f2: false },
      { obs: '', complete: false, belongsTo: furnitureProject.id, belongsToFurniture: chosenFurniture.id, partName: 'BAR_C_COSTA', id: formatString(chosenFurniture.name.value) + '_BAR_C_COSTA', material: 'HDF 6', amount: 1, length: '1050,5', width: '1000', thickness: '6', tag: 3, nestingFlag: false, cncFlag: false, orla2: true, f2: false },
      { obs: '', complete: false, belongsTo: furnitureProject.id, belongsToFurniture: chosenFurniture.id, partName: 'BAR_E_PAINEL_CURVA_RIPA_HRZ6_1_2_APROC', id: formatString(chosenFurniture.name.value) + '_BAR_E_PAINEL_CURVA_RIPA_HRZ6_1_2_APROC', material: 'HDF 6', amount: 1, length: '880', width: '450', thickness: '6', tag: 4, nestingFlag: false, cncFlag: true, orla2: true, f2: false },
      { obs: '', complete: false, belongsTo: furnitureProject.id, belongsToFurniture: chosenFurniture.id, partName: 'BAR_E_PAINEL_CURVA_RIPA_HRZ6_3', id: formatString(chosenFurniture.name.value) + '_BAR_E_PAINEL_CURVA_RIPA_HRZ6_3', material: 'HDF 6', amount: 2, length: '613', width: '80', thickness: '6', tag: 5, nestingFlag: false, cncFlag: false, orla2: true, f2: false },
      // { obs: '', complete: false, belongsTo: furnitureProject.id, belongsToFurniture: chosenFurniture.id, partName: 'BAR_E_PAINEL_CURVA_RIPA_VRT6', id: formatString(chosenFurniture.name.value) + '_BAR_E_PAINEL_CURVA_RIPA_VRT6', material: 'HDF 6', amount: 4, length: '830', width: '80', thickness: '6', tag: 6, nestingFlag: false, cncFlag: false, orla2: true, f2: false },
      // { obs: 'Esta peça é para colar com a seguinte', complete: false, belongsTo: chosenFurniture.id, partName: 'BAR_E_PAINEL_CURVA_RIPA_VRT6_2_3_APROC', id: formatString(chosenFurniture.name.value) + '_BAR_E_PAINEL_CURVA_RIPA_VRT6_2_3_APROC', material: 'HDF 6', amount: 1, length: '830', width: '200', thickness: '6', tag: 7, nestingFlag: false, cncFlag: true, orla2: true, f2: false },
      // { obs: 'Colar esta peça com a anterior', complete: false, belongsTo: chosenFurniture.id, partName: 'BAR_B_RODAPE_M_RASGOS', id: formatString(chosenFurniture.name.value) + '_BAR_B_RODAPE_M_RASGOS1', material: 'HDF 10', amount: 1, length: '2150', width: '100', thickness: '10', tag: 8, nestingFlag: true, cncFlag: true, orla2: true, f2: false },
      // { obs: '', complete: false, belongsTo: furnitureProject.id, belongsToFurniture: chosenFurniture.id, partName: 'BAR_B_RODAPE_M_RASGOS', id: formatString(chosenFurniture.name.value) + '_BAR_B_RODAPE_M_RASGOS2', material: 'HDF 10', amount: 1, length: '2181', width: '100', thickness: '10', tag: 9, nestingFlag: true, cncFlag: true, orla2: true, f2: false },
      // { obs: '', complete: false, belongsTo: furnitureProject.id, belongsToFurniture: chosenFurniture.id, partName: 'BAR_C_GAVETA_FUNDO', id: formatString(chosenFurniture.name.value) + '_BAR_C_GAVETA_FUNDO', material: 'HDF 10', amount: 1, length: '469', width: '258', thickness: '10', tag: 10, nestingFlag: true, cncFlag: false, orla2: true, f2: false },
      // { obs: '', complete: false, belongsTo: furnitureProject.id, belongsToFurniture: chosenFurniture.id, partName: 'BAR_C_GAVETA2_FUNDO', id: formatString(chosenFurniture.name.value) + '_BAR_C_GAVETA2_FUNDO', material: 'HDF 10', amount: 1, length: '469', width: '258', thickness: '10', tag: 11, nestingFlag: true, cncFlag: false, orla2: true, f2: false },
      // { obs: '', complete: false, belongsTo: furnitureProject.id, belongsToFurniture: chosenFurniture.id, partName: 'BAR_E_PAINEL_CURVA_ALMOFADA_RASGOS2', id: formatString(chosenFurniture.name.value) + '_BAR_E_PAINEL_CURVA_ALMOFADA_RASGOS2', material: 'HDF 10 CNC', amount: 1, length: '2621', width: '1106', thickness: '10', tag: 12, nestingFlag: true, cncFlag: true, orla2: true, f2: false },
      // { obs: '', complete: false, belongsTo: furnitureProject.id, belongsToFurniture: chosenFurniture.id, partName: 'BAR_E_PAINEL_CURVA_ALMOFADA1_RASGOS', id: formatString(chosenFurniture.name.value) + '_BAR_E_PAINEL_CURVA_ALMOFADA1_RASGOS', material: 'HDF 10 CNC', amount: 1, length: '2590', width: '1106', thickness: '10', tag: 13, nestingFlag: true, cncFlag: true, orla2: true, f2: false },
      // { obs: '', complete: false, belongsTo: furnitureProject.id, belongsToFurniture: chosenFurniture.id, partName: 'BAR_E_PAINEL_CURVA_RIPA_HRZ10_1_2_APROC', id: formatString(chosenFurniture.name.value) + '_BAR_E_PAINEL_CURVA_RIPA_HRZ10_1_2_APROC', material: 'HDF 10 CNC', amount: 1, length: '1069', width: '306', thickness: '10', tag: 14, nestingFlag: true, cncFlag: true, orla2: true, f2: false },
      // { obs: '', complete: false, belongsTo: furnitureProject.id, belongsToFurniture: chosenFurniture.id, partName: 'BAR_E_PAINEL_CURVA_RIPA_HRZ10_3', id: formatString(chosenFurniture.name.value) + '_BAR_E_PAINEL_CURVA_RIPA_HRZ10_3', material: 'HDF 10', amount: 2, length: '793', width: '50', thickness: '10', tag: 15, nestingFlag: false, cncFlag: false, orla2: true, f2: false },
      // { obs: '', complete: false, belongsTo: furnitureProject.id, belongsToFurniture: chosenFurniture.id, partName: 'BAR_E_PAINEL_CURVA_RIPA_VRT10', id: formatString(chosenFurniture.name.value) + '_BAR_E_PAINEL_CURVA_RIPA_VRT10', material: 'HDF 10', amount: 4, length: '950', width: '50', thickness: '10', tag: 16, nestingFlag: false, cncFlag: false, orla2: true, f2: false },
      // { obs: '', complete: false, belongsTo: furnitureProject.id, belongsToFurniture: chosenFurniture.id, partName: 'BAR_E_RODAPE_INT_CURVO_RASGOS', id: formatString(chosenFurniture.name.value) + '_BAR_E_RODAPE_INT_CURVO_RASGOS', material: 'HDF 10', amount: 1, length: '2630', width: '150', thickness: '10', tag: 17, nestingFlag: true, cncFlag: true, orla2: true, f2: false },
      // { obs: '', complete: false, belongsTo: furnitureProject.id, belongsToFurniture: chosenFurniture.id, partName: 'BAR_C_PRAT_CORRER_LAT_DIR', id: formatString(chosenFurniture.name.value) + '_BAR_C_PRAT_CORRER_LAT_DIR', material: 'HDF 13 CNC', amount: 1, length: '244', width: '19,5', thickness: '13', tag: 18, nestingFlag: false, cncFlag: true, orla2: true, f2: false },
      // { obs: '', complete: false, belongsTo: furnitureProject.id, belongsToFurniture: chosenFurniture.id, partName: 'BAR_C_PRAT_CORRER_LAT_ESQ', id: formatString(chosenFurniture.name.value) + '_BAR_C_PRAT_CORRER_LAT_ESQ', material: 'HDF 13 CNC', amount: 1, length: '244', width: '19,5', thickness: '13', tag: 19, nestingFlag: false, cncFlag: true, orla2: true, f2: false },
      // { obs: '', complete: false, belongsTo: furnitureProject.id, belongsToFurniture: chosenFurniture.id, partName: 'BAR_C_GAVETA_COSTA', id: formatString(chosenFurniture.name.value) + '_BAR_C_GAVETA_COSTA', material: 'HDF 16 CNC', amount: 1, length: '457', width: '105,5', thickness: '16', tag: 20, nestingFlag: false, cncFlag: true, orla2: true, f2: false },
      // { obs: '', complete: false, belongsTo: furnitureProject.id, belongsToFurniture: chosenFurniture.id, partName: 'BAR_C_GAVETA_LAT_DIR', id: formatString(chosenFurniture.name.value) + '_BAR_C_GAVETA_LAT_DIR', material: 'HDF 16 CNC', amount: 1, length: '256', width: '128,5', thickness: '16', tag: 21, nestingFlag: false, cncFlag: true, orla2: true, f2: false },
      // { obs: '', complete: false, belongsTo: furnitureProject.id, belongsToFurniture: chosenFurniture.id, partName: 'BAR_C_GAVETA_LAT_ESQ', id: formatString(chosenFurniture.name.value) + '_BAR_C_GAVETA_LAT_ESQ', material: 'HDF 16 CNC', amount: 1, length: '256', width: '128,5', thickness: '16', tag: 22, nestingFlag: false, cncFlag: true, orla2: true, f2: false },
      // { obs: '', complete: false, belongsTo: furnitureProject.id, belongsToFurniture: chosenFurniture.id, partName: 'BAR_C_GAVETA2_COSTA', id: formatString(chosenFurniture.name.value) + '_BAR_C_GAVETA2_COSTA', material: 'HDF 16 CNC', amount: 1, length: '457', width: '105,5', thickness: '16', tag: 23, nestingFlag: false, cncFlag: true, orla2: true, f2: false },
      // { obs: '', complete: false, belongsTo: furnitureProject.id, belongsToFurniture: chosenFurniture.id, partName: 'BAR_C_GAVETA2_LAT_DIR', id: formatString(chosenFurniture.name.value) + '_BAR_C_GAVETA2_LAT_DIR', material: 'HDF 16 CNC', amount: 1, length: '256', width: '128,5', thickness: '16', tag: 24, nestingFlag: false, cncFlag: true, orla2: true, f2: false },
      // { obs: '', complete: false, belongsTo: furnitureProject.id, belongsToFurniture: chosenFurniture.id, partName: 'BAR_C_GAVETA2_LAT_ESQ', id: formatString(chosenFurniture.name.value) + '_BAR_C_GAVETA2_LAT_ESQ', material: 'HDF 16 CNC', amount: 1, length: '256', width: '128,5', thickness: '16', tag: 25, nestingFlag: false, cncFlag: true, orla2: true, f2: false },
      // { obs: '', complete: false, belongsTo: furnitureProject.id, belongsToFurniture: chosenFurniture.id, partName: 'BAR_C_PRAT_CORRER_COSTA', id: formatString(chosenFurniture.name.value) + '_BAR_C_PRAT_CORRER_COSTA', material: 'HDF 16 CNC', amount: 1, length: '1006', width: '76', thickness: '16', tag: 26, nestingFlag: false, cncFlag: true, orla2: true, f2: false },
      // { obs: '', complete: false, belongsTo: furnitureProject.id, belongsToFurniture: chosenFurniture.id, partName: 'BAR_C_PRAT_CORRER_FUNDO', id: formatString(chosenFurniture.name.value) + '_BAR_C_PRAT_CORRER_FUNDO', material: 'HDF 16 CNC', amount: 1, length: '1004,5', width: '244', thickness: '16', tag: 27, nestingFlag: false, cncFlag: true, orla2: true, f2: false },
      // { obs: '', complete: false, belongsTo: furnitureProject.id, belongsToFurniture: chosenFurniture.id, partName: 'BAR_B_CIMO', id: formatString(chosenFurniture.name.value) + '_BAR_B_CIMO', material: 'HDF 19 CNC', amount: 1, length: '1035', width: '613', thickness: '19', tag: 28, nestingFlag: true, cncFlag: false, orla2: true, f2: false },
      // { obs: '', complete: false, belongsTo: furnitureProject.id, belongsToFurniture: chosenFurniture.id, partName: 'BAR_B_DIVISORIA', id: formatString(chosenFurniture.name.value) + '_BAR_B_DIVISORIA', material: 'HDF 19 CNC', amount: 1, length: '968', width: '291', thickness: '19', tag: 29, nestingFlag: true, cncFlag: false, orla2: true, f2: false },
      // { obs: '', complete: false, belongsTo: furnitureProject.id, belongsToFurniture: chosenFurniture.id, partName: 'BAR_B_FUNDO', id: formatString(chosenFurniture.name.value) + '_BAR_B_FUNDO', material: 'HDF 19 CNC', amount: 1, length: '1035', width: '613', thickness: '19', tag: 30, nestingFlag: true, cncFlag: false, orla2: true, f2: false },
      // { obs: '', complete: false, belongsTo: furnitureProject.id, belongsToFurniture: chosenFurniture.id, partName: 'BAR_B_LAT_DIR', id: formatString(chosenFurniture.name.value) + '_BAR_B_LAT_DIR', material: 'HDF 19 CNC', amount: 1, length: '968', width: '272', thickness: '19', tag: 31, nestingFlag: true, cncFlag: false, orla2: true, f2: false },
      // { obs: '', complete: false, belongsTo: furnitureProject.id, belongsToFurniture: chosenFurniture.id, partName: 'BAR_B_LAT_ESQ', id: formatString(chosenFurniture.name.value) + '_BAR_B_LAT_ESQ', material: 'HDF 19 CNC', amount: 1, length: '968', width: '291', thickness: '19', tag: 32, nestingFlag: true, cncFlag: false, orla2: true, f2: false },
      // { obs: '', complete: false, belongsTo: furnitureProject.id, belongsToFurniture: chosenFurniture.id, partName: 'BAR_B_PRATELEIRA1', id: formatString(chosenFurniture.name.value) + '_BAR_B_PRATELEIRA1', material: 'HDF 19 CNC', amount: 1, length: '592', width: '533', thickness: '19', tag: 33, nestingFlag: true, cncFlag: false, orla2: true, f2: false },
      // { obs: '', complete: false, belongsTo: furnitureProject.id, belongsToFurniture: chosenFurniture.id, partName: 'BAR_B_PRATELEIRA2', id: formatString(chosenFurniture.name.value) + '_BAR_B_PRATELEIRA2', material: 'HDF 19 CNC', amount: 1, length: '466', width: '286', thickness: '19', tag: 34, nestingFlag: true, cncFlag: false, orla2: true, f2: false },
      // { obs: '', complete: false, belongsTo: furnitureProject.id, belongsToFurniture: chosenFurniture.id, partName: 'BAR_B_REM_ESQ_M', id: formatString(chosenFurniture.name.value) + '_BAR_B_REM_ESQ_M', material: 'HDF 19', amount: 1, length: '1100', width: '70', thickness: '19', tag: 35, nestingFlag: false, cncFlag: false, orla2: true, f2: false },
      // { obs: '', complete: false, belongsTo: furnitureProject.id, belongsToFurniture: chosenFurniture.id, partName: 'BAR_B_RODAPE_M_MOLDE1', id: formatString(chosenFurniture.name.value) + '_BAR_B_RODAPE_M_MOLDE1', material: 'HDF 19', amount: 1, length: '424,5', width: '166', thickness: '19', tag: 36, nestingFlag: false, cncFlag: false, orla2: true, f2: false },
      // { obs: '', complete: false, belongsTo: furnitureProject.id, belongsToFurniture: chosenFurniture.id, partName: 'BAR_B_RODAPE_M_MOLDE2', id: formatString(chosenFurniture.name.value) + '_BAR_B_RODAPE_M_MOLDE2', material: 'HDF 19', amount: 1, length: '424,5', width: '283', thickness: '19', tag: 37, nestingFlag: false, cncFlag: false, orla2: true, f2: false },
      // { obs: '', complete: false, belongsTo: furnitureProject.id, belongsToFurniture: chosenFurniture.id, partName: 'BAR_B_SEPARADOR', id: formatString(chosenFurniture.name.value) + '_BAR_B_SEPARADOR', material: 'HDF 19 CNC', amount: 1, length: '594', width: '535', thickness: '19', tag: 38, nestingFlag: true, cncFlag: true, orla2: true, f2: false },
      // { obs: '', complete: false, belongsTo: furnitureProject.id, belongsToFurniture: chosenFurniture.id, partName: 'BAR_B_SEPARADOR2', id: formatString(chosenFurniture.name.value) + '_BAR_B_SEPARADOR2', material: 'HDF 19 CNC', amount: 1, length: '468', width: '289', thickness: '19', tag: 39, nestingFlag: true, cncFlag: false, orla2: true, f2: false },
      // { obs: '', complete: false, belongsTo: furnitureProject.id, belongsToFurniture: chosenFurniture.id, partName: 'BAR_C_CIMA', id: formatString(chosenFurniture.name.value) + '_BAR_C_CIMA', material: 'HDF 19 CNC', amount: 1, length: '1056,5', width: '272', thickness: '19', tag: 40, nestingFlag: true, cncFlag: false, orla2: true, f2: false },
      // { obs: '', complete: false, belongsTo: furnitureProject.id, belongsToFurniture: chosenFurniture.id, partName: 'BAR_C_DIVISORIA', id: formatString(chosenFurniture.name.value) + '_BAR_C_DIVISORIA', material: 'HDF 19 CNC', amount: 1, length: '720', width: '272', thickness: '19', tag: 41, nestingFlag: true, cncFlag: false, orla2: true, f2: false },
      // { obs: '', complete: false, belongsTo: furnitureProject.id, belongsToFurniture: chosenFurniture.id, partName: 'BAR_C_FUNDO', id: formatString(chosenFurniture.name.value) + '_BAR_C_FUNDO', material: 'HDF 19 CNC', amount: 1, length: '1056,5', width: '272', thickness: '19', tag: 42, nestingFlag: true, cncFlag: false, orla2: true, f2: false },
      // { obs: '', complete: false, belongsTo: furnitureProject.id, belongsToFurniture: chosenFurniture.id, partName: 'BAR_C_LAT_DIR', id: formatString(chosenFurniture.name.value) + '_BAR_C_LAT_DIR', material: 'HDF 19 CNC', amount: 1, length: '968', width: '272', thickness: '19', tag: 43, nestingFlag: true, cncFlag: false, orla2: true, f2: false },
      // { obs: '', complete: false, belongsTo: furnitureProject.id, belongsToFurniture: chosenFurniture.id, partName: 'BAR_C_LAT_ESQ', id: formatString(chosenFurniture.name.value) + '_BAR_C_LAT_ESQ', material: 'HDF 19 CNC', amount: 1, length: '968', width: '272', thickness: '19', tag: 44, nestingFlag: true, cncFlag: false, orla2: true, f2: false },
      // { obs: '', complete: false, belongsTo: furnitureProject.id, belongsToFurniture: chosenFurniture.id, partName: 'BAR_C_PRATELEIRA', id: formatString(chosenFurniture.name.value) + '_BAR_C_PRATELEIRA', material: 'HDF 19 CNC', amount: 1, length: '501', width: '267', thickness: '19', tag: 45, nestingFlag: true, cncFlag: false, orla2: true, f2: false },
      // { obs: '', complete: false, belongsTo: furnitureProject.id, belongsToFurniture: chosenFurniture.id, partName: 'BAR_C_PRATELEIRA2', id: formatString(chosenFurniture.name.value) + '_BAR_C_PRATELEIRA2', material: 'HDF 19 CNC', amount: 1, length: '501', width: '267', thickness: '19', tag: 46, nestingFlag: true, cncFlag: false, orla2: true, f2: false },
      // { obs: '', complete: false, belongsTo: furnitureProject.id, belongsToFurniture: chosenFurniture.id, partName: 'BAR_C_SEPARADOR', id: formatString(chosenFurniture.name.value) + '_BAR_C_SEPARADOR', material: 'HDF 19 CNC', amount: 1, length: '1018,5', width: '272', thickness: '19', tag: 47, nestingFlag: true, cncFlag: false, orla2: true, f2: false },
      // { obs: '', complete: false, belongsTo: furnitureProject.id, belongsToFurniture: chosenFurniture.id, partName: 'BAR_E_PAINEL_CURVA_MOLDE_EXT', id: formatString(chosenFurniture.name.value) + '_BAR_E_PAINEL_CURVA_MOLDE_EXT', material: 'HDF 19', amount: 4, length: '1302,5', width: '535,5', thickness: '19', tag: 48, nestingFlag: true, cncFlag: false, orla2: true, f2: false },
      // { obs: '', complete: false, belongsTo: furnitureProject.id, belongsToFurniture: chosenFurniture.id, partName: 'BAR_E_REM_DIR', id: formatString(chosenFurniture.name.value) + '_BAR_E_REM_DIR', material: 'HDF 19 CNC', amount: 1, length: '1106', width: '300', thickness: '19', tag: 49, nestingFlag: true, cncFlag: false, orla2: true, f2: false },
      // { obs: '', complete: false, belongsTo: furnitureProject.id, belongsToFurniture: chosenFurniture.id, partName: 'BAR_E_RODAPE_RASGOS', id: formatString(chosenFurniture.name.value) + '_BAR_E_RODAPE_RASGOS', material: 'HDF 19', amount: 1, length: '2680', width: '150', thickness: '19', tag: 50, nestingFlag: true, cncFlag: true, orla2: true, f2: false },
      // { obs: '', complete: false, belongsTo: furnitureProject.id, belongsToFurniture: chosenFurniture.id, partName: 'BAR_E_RODAPE2', id: formatString(chosenFurniture.name.value) + '_BAR_E_RODAPE2', material: 'HDF 19', amount: 1, length: '343', width: '150', thickness: '19', tag: 51, nestingFlag: false, cncFlag: false, orla2: true, f2: false },
      // { obs: '', complete: false, belongsTo: furnitureProject.id, belongsToFurniture: chosenFurniture.id, partName: 'BAR_C_GAVETA_FRENTE', id: formatString(chosenFurniture.name.value) + '_BAR_C_GAVETA_FRENTE', material: 'HDF 22 CNC', amount: 1, length: '529', width: '185', thickness: '22', tag: 52, nestingFlag: true, cncFlag: true, orla2: true, f2: false },
      // { obs: '', complete: false, belongsTo: furnitureProject.id, belongsToFurniture: chosenFurniture.id, partName: 'BAR_C_GAVETA2_FRENTE', id: formatString(chosenFurniture.name.value) + '_BAR_C_GAVETA2_FRENTE', material: 'HDF 22 CNC', amount: 1, length: '528,2', width: '185', thickness: '22', tag: 53, nestingFlag: true, cncFlag: true, orla2: true, f2: false },
      // { obs: '', complete: false, belongsTo: furnitureProject.id, belongsToFurniture: chosenFurniture.id, partName: 'BAR_C_PORTA_DIR', id: formatString(chosenFurniture.name.value) + '_BAR_C_PORTA_DIR', material: 'HDF 22 CNC', amount: 1, length: '556', width: '528', thickness: '22', tag: 54, nestingFlag: true, cncFlag: true, orla2: true, f2: false },
      // { obs: '', complete: false, belongsTo: furnitureProject.id, belongsToFurniture: chosenFurniture.id, partName: 'BAR_C_PORTA_ESQ', id: formatString(chosenFurniture.name.value) + '_BAR_C_PORTA_ESQ', material: 'HDF 22 CNC', amount: 1, length: '556', width: '529', thickness: '22', tag: 55, nestingFlag: true, cncFlag: true, orla2: true, f2: false },
      // { obs: '', complete: false, belongsTo: furnitureProject.id, belongsToFurniture: chosenFurniture.id, partName: 'BAR_C_PRAT_CORRER_FRENTE', id: formatString(chosenFurniture.name.value) + '_BAR_C_PRAT_CORRER_FRENTE', material: 'HDF 22 CNC', amount: 1, length: '1053,5', width: '73', thickness: '22', tag: 56, nestingFlag: true, cncFlag: true, orla2: true, f2: false },
    ];

    const newConsumables = [
      { id: formatString('suporte_prateleira'), name: 'suporte prateleira', amount: 16, tag: 1, produced: false, assembled: false, status: 1, belongsTo: furnitureProject.id, belongsToFurniture: chosenFurniture.id, material: 'AG L Biscuit Nude 36W' },
      { id: formatString('BAR_B_RODAPE_M'), name: 'BAR B RODAPE M', amount: 1, tag: 2, produced: false, assembled: false, status: 1, belongsTo: furnitureProject.id, belongsToFurniture: chosenFurniture.id, material: 'AG L Biscuit Nude 36W' },
      { id: formatString('pes_plasticos'), name: 'pes plasticos', amount: 4, tag: 3, produced: false, assembled: false, status: 1, belongsTo: furnitureProject.id, belongsToFurniture: chosenFurniture.id, material: 'AG L Biscuit Nude 36W' },
      { id: formatString('garampas'), name: 'garampas', amount: 2, tag: 4, produced: false, assembled: false, status: 1, belongsTo: furnitureProject.id, belongsToFurniture: chosenFurniture.id, material: 'AG L Biscuit Nude 36W' },
      { id: formatString('DOBRADIÇA'), name: 'DOBRADIÇA', amount: 4, tag: 5, produced: false, assembled: false, status: 1, belongsTo: furnitureProject.id, belongsToFurniture: chosenFurniture.id, material: 'AG L Biscuit Nude 36W' },
      { id: formatString('Corrediça_Quadro_CalhaE'), name: 'Corrediça Quadro CalhaE', amount: 2, tag: 6, produced: false, assembled: false, status: 1, belongsTo: furnitureProject.id, belongsToFurniture: chosenFurniture.id, material: 'AG L Biscuit Nude 36W' },
      { id: formatString('Corrediça_Quadro_CalhaD'), name: 'Corrediça Quadro CalhaD', amount: 2, tag: 7, produced: false, assembled: false, status: 1, belongsTo: furnitureProject.id, belongsToFurniture: chosenFurniture.id, material: 'AG L Biscuit Nude 36W' },
      { id: formatString('Corrediça V6 CalhaE'), name: 'Corrediça V6 CalhaE', amount: 1, tag: 8, produced: false, assembled: false, status: 1, belongsTo: furnitureProject.id, belongsToFurniture: chosenFurniture.id, material: 'AG L Biscuit Nude 36W' },
      { id: formatString('Corrediça V6 CalhaD'), name: 'Corrediça V6 CalhaD', amount: 1, tag: 9, produced: false, assembled: false, status: 1, belongsTo: furnitureProject.id, belongsToFurniture: chosenFurniture.id, material: 'AG L Biscuit Nude 36W' },
      { id: formatString('BAR_E_RODAPE_CURVO'), name: 'BAR E RODAPE CURVO', amount: 1, tag: 10, produced: false, assembled: false, status: 1, belongsTo: furnitureProject.id, belongsToFurniture: chosenFurniture.id, material: 'AG L Biscuit Nude 36W' },
      { id: formatString('BAR_E_PAINEL_CURVA_ALMOFADA1'), name: 'BAR E PAINEL CURVA ALMOFADA1', amount: 1, tag: 11, produced: false, assembled: false, status: 1, belongsTo: furnitureProject.id, belongsToFurniture: chosenFurniture.id, material: 'AG L Biscuit Nude 36W' },
      { id: formatString('BAR_E_PAINEL_CURVA_ALMOFADA2'), name: 'BAR E PAINEL CURVA ALMOFADA2', amount: 1, tag: 12, produced: false, assembled: false, status: 1, belongsTo: furnitureProject.id, belongsToFurniture: chosenFurniture.id, material: 'AG L Biscuit Nude 36W' },
      { id: formatString('BAR_E_PAINEL_CURVA_RIPA_HRZ10_1'), name: 'BAR E PAINEL CURVA RIPA HRZ10 1', amount: 2, tag: 13, produced: false, assembled: false, status: 1, belongsTo: furnitureProject.id, belongsToFurniture: chosenFurniture.id, material: 'AG L Biscuit Nude 36W' },
      { id: formatString('BAR_E_PAINEL_CURVA_RIPA_HRZ10_2'), name: 'BAR E PAINEL CURVA RIPA HRZ10 2', amount: 2, tag: 14, produced: false, assembled: false, status: 1, belongsTo: furnitureProject.id, belongsToFurniture: chosenFurniture.id, material: 'AG L Biscuit Nude 36W' },
      { id: formatString('BAR_E_PAINEL_CURVA_RIPA_HRZ6_1'), name: 'BAR E PAINEL CURVA RIPA HRZ6 1', amount: 2, tag: 15, produced: false, assembled: false, status: 1, belongsTo: furnitureProject.id, belongsToFurniture: chosenFurniture.id, material: 'AG L Biscuit Nude 36W' },
      { id: formatString('BAR_E_PAINEL_CURVA_RIPA_HRZ6_2'), name: 'BAR E PAINEL CURVA RIPA HRZ6 2', amount: 2, tag: 16, produced: false, assembled: false, status: 1, belongsTo: furnitureProject.id, belongsToFurniture: chosenFurniture.id, material: 'AG L Biscuit Nude 36W' },

    ];

    const built = newParts2.map((part) => {
      const a = {};

      Object.keys(part).map((key) => {
        a[key] = { type: 'Property', value: part[key] };
      });

      a.id = 'urn:ngsi-ld:Part:' + a.id.value;
      a.type = 'Part';

      return a;
    });

    const builtConsumes = newConsumables.map((part) => {
      const a = {};

      Object.keys(part).map((key) => {
        a[key] = { type: 'Property', value: part[key] };
      });

      a.id = 'urn:ngsi-ld:Consumable:' + a.id.value;
      a.type = 'Consumable';

      return a;
    });

    built.map(async (part) => {
      await newPart(part);
    });

    builtConsumes.map(async (consumable) => {
      await newConsumable(consumable);
    });
  }

  const cellProps = {
    md: 0.8,
    sm: 0.8,
    xs: 0.8,
    paddingTop: '.5rem',
    paddingBottom: '.5rem',
    paddingLeft: '.5rem',
    paddingRight: '.5rem',
    className: 'fullCenter',
    container: true,
    overflow: 'hidden',
  };

  const rowProps = {
    md: 12,
    sm: 12,
    xs: 12,
    sx: { cursor: 'pointer' },
    className: 'hoverOpacity',
    container: true
  };

  async function onStartPart (props) {
    const builtWorkerTask = {
      id: `urn:ngsi-ld:WorkerTask:${props.part.id || props.part.name}${me.id}${props.field}`,
      type: 'WorkerTask',

      startTime: {
        type: 'Property',
        value: moment().format('DD/MM/YYYY HH:mm:ss')
      },
      finishTime: {
        type: 'Property',
        value: ''
      },
      lineNumber: {
        type: 'Property',
        value: props.index
      },
      executedBy: {
        type: 'Relationship',
        object: 'urn:ngsi-ld:Worker:' + me.id
      },
      executedOn: {
        type: 'Relationship',
        object: props.part.id
      },
      action: {
        type: 'Property',
        value: props.field
      },
      machine: {
        type: 'Property',
        value: props.machine
      },
      onProject: {
        type: 'Property',
        value: furnitureProject.id
      },
      onFurniture: {
        type: 'Property',
        value: chosenFurniture.id
      },
    };

    const newWorkertask = await newWorkerTask(builtWorkerTask);

    await updateMachine({ id: props.machine, data: { currentlyOn: props.part.id } });

    return newWorkertask.data;
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function a11yProps (index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  async function FinishPart (props) {
    const built = {
      finishTime: {
        type: 'Property',
        value: moment().format('DD/MM/YYYY HH:mm:ss')
      }
    };

    await updateWorkerTask({ data: built, id: props.id });
    setMyMachine({ ...myMachine, currentlyOn: { ...myMachine.currentlyOn, value: '' } });
    // setState({ ...state, myMachine: { ...state.myMachine, currentlyOn: { ...myMachine.currentlyOn, value: '' } } });
    await updateMachine({ id: props.machine?.value, data: { currentlyOn: '' } });
  }

  async function onStartPartClick (props) {
    const projectPartsCopy = [...projectParts];
    const newLog = await onStartPart(props);
    const partIndex = props.index;
    const logsCopy = [...projectPartsCopy[partIndex].logs];

    logsCopy.push(newLog);

    projectPartsCopy[partIndex] = {
      ...projectPartsCopy[partIndex],
      logs: logsCopy,
    };

    setProjectParts(projectPartsCopy);
    setMyMachine({ ...myMachine, currentlyOn: { ...myMachine.currentlyOn, value: props.part.id } });
    // setState({ ...state, myMachine: { ...state.myMachine, currentlyOn: { ...myMachine.currentlyOn, value: props.part.id } } });
  }

  function validateAction (field, actions, actionsDone) {
    let field2 = '';

    switch (field) {
    case 'nestingFlag': field2 = 'isNest';

      break;
    case 'cncFlag': field2 = 'isCnc';

      break;
    case 'orla': field2 = 'isOrla';

      break;
    case 'f': field2 = 'isFuroFace';

      break;
    case 'tupia': field2 = 'isTupia';

      break;
    }

    const order = ['isNest', 'isCnc', 'isOrla', 'isFuroFace', 'isTupia'];
    // Find the index of the current action in the order
    const currentIndex = order.indexOf(field2);

    // Check if the current action is in the correct order
    for (let i = 0; i < currentIndex; i++) {
      const action = order[i];

      if (!actionsDone[action] && actions[action]) {
        return `Tem que fazer ${action.replace('is', '')} antes`;
      }
    }

    // Current action is valid
    return null;
  }

  async function updateAmountProd (part) {
    await updatePart({ id: part.id, data: { complete: true } });
    setChosenFurniture({ ...chosenFurniture, completed: Number(chosenFurniture.completed?.value) + 1 });

    const old = [...projectParts];
    const index = old.findIndex((item) => item.id === part.id);

    if (index !== -1) {
      const updatedItem = {
        ...projectParts[index], // Copy the existing item
        complete: true,
      };

      const updatedItems = [
        ...projectParts.slice(0, index), // Copy the items before the updated item
        updatedItem, // Add the updated item
        ...projectParts.slice(index + 1) // Copy the items after the updated item
      ];

      if (!updatedItems.find(ele => ele.complete === false)) {
        await updateFurniture({ id: chosenFurniture.id, data: { produced: true } });
        await updateProject({ id: furnitureProject.id, data: { produced: Number(furnitureProject.produced?.value) + 1 } });
      }

      setProjectParts(updatedItems);
    }
  }

  const ActionStatus = (props) => {
    const { part, field, disabled } = props;
    let undisabled = disabled;

    if (myMachine?.currentlyOn?.value === part.id) {
      undisabled = false;
    }

    if (!part[field]) return '';

    const cpy = [...projectParts];
    const thisMachines = machines?.filter(machine => machine?.machineType?.value?.toLowerCase()?.includes(props?.field?.replace('Flag', '')) && machine?.currentlyOn?.value === '');

    const actions = {
      isNest: part.nestingFlag,
      isCnc: part.cncFlag,
      isOrla: part.orla2 || part.orla3 || part.orla4 || part.orla5,
      isFuroFace: part.f2 || part.f3 || part.f4 || part.f5,
      isTupia: part.tupia,
    };

    const actionsDone = getActionsDone(actions);

    function getActionsDone (actions) {
      const actionsDone = {};

      if (actions.isNest) {
        const haveLogs = part.logs?.find(log => log?.action?.value === 'nestingFlag' && log?.finishTime?.value !== '');

        if (haveLogs && haveLogs.finishTime.value !== '') actionsDone.isNest = true;
        else actionsDone.isNest = false;
      }

      if (actions.isCnc) {
        const haveLogs = part.logs?.find(log => log?.action?.value === 'cncFlag' && log?.finishTime?.value !== '');

        if (haveLogs && haveLogs.finishTime.value !== '') actionsDone.isCnc = true;
        else actionsDone.isCnc = false;
      }

      if (actions.isOrla) {
        const haveLogs = part.logs?.find(log => log?.action?.value === 'orla' && log?.finishTime?.value !== '');

        if (haveLogs && haveLogs.finishTime.value !== '') actionsDone.isOrla = true;
        else actionsDone.isOrla = false;
      }

      if (actions.isFuroFace) {
        const haveLogs = part.logs?.find(log => log?.action?.value === 'f' && log?.finishTime?.value !== '');

        if (haveLogs && haveLogs.finishTime.value !== '') actionsDone.isFuroFace = true;
        else actionsDone.isFuroFace = false;
      }

      if (actions.isTupia) {
        const haveLogs = part.logs?.find(log => log?.action?.value === 'tupia' && log?.finishTime?.value !== '');

        if (haveLogs && haveLogs.finishTime.value !== '') actionsDone.isTupia = true;
        else actionsDone.isTupia = false;
      }

      return actionsDone;
    }

    if (actions.isNest) {
      const haveLogs = part.logs?.find(log => log?.action?.value === 'nestingFlag' && log?.finishTime?.value !== '');

      if (haveLogs && haveLogs.finishTime.value !== '') actionsDone.isNest = true;
      else actionsDone.isNest = false;
    }

    if (actions.isCnc) {
      const haveLogs = part.logs?.find(log => log?.action?.value === 'cncFlag' && log?.finishTime?.value !== '');

      if (haveLogs && haveLogs.finishTime.value !== '') actionsDone.isCnc = true;
      else actionsDone.isCnc = false;
    }

    if (actions.isOrla) {
      const haveLogs = part.logs?.find(log => log?.action?.value === 'orla' && log?.finishTime?.value !== '');

      if (haveLogs && haveLogs.finishTime.value !== '') actionsDone.isOrla = true;
      else actionsDone.isOrla = false;
    }

    if (actions.isFuroFace) {
      const haveLogs = part.logs?.find(log => log?.action?.value === 'f' && log?.finishTime?.value !== '');

      if (haveLogs && haveLogs.finishTime.value !== '') actionsDone.isFuroFace = true;
      else actionsDone.isFuroFace = false;
    }

    if (actions.isTupia) {
      const haveLogs = part.logs?.find(log => log?.action?.value === 'tupia' && log?.finishTime?.value !== '');

      if (haveLogs && haveLogs.finishTime.value !== '') actionsDone.isTupia = true;
      else actionsDone.isTupia = false;
    }

    const msg = validateAction(field, actions, actionsDone);
    const index = cpy[props.index].logs?.findIndex((log) => log.action?.value === field);
    const log = part.logs?.find(log => log.action?.value === field);

    if (!log && part[field]) {
      return detailOnly
        ? <Tooltip title='Ainda não iniciou'>
          <MinusCircle color='gray'/>
        </Tooltip>
        : <Box>
          <IconButton onClick={() => {
            if (!msg && thisMachines[0]) {
              onStartPartClick({ ...props, machine: myMachine.id }).then(() => {
                const updatedItem = machines.find(item => item.id === myMachine.id);
                const updatedIndex = machines.findIndex(item => item.id === myMachine.id);

                const newItems = [
                  ...machines.slice(0, updatedIndex),
                  { ...updatedItem, currentlyOn: { type: 'Property', value: part.id } },
                  ...machines.slice(updatedIndex + 1),
                ];

                setMachines(newItems);
                toast.success('Iniciado.');
              });
            }
          }} disabled={undisabled} >
            <Tooltip title={ msg || (thisMachines && !thisMachines[0] ? 'Não há maquinas disponiveis' : 'Iniciar')} >
              <Play />
            </Tooltip>
          </IconButton>
        </Box>;
    }

    if (log?.finishTime?.value === '') {
      return detailOnly
        ? <Tooltip title='Em produção'>
          <Box
            className="rotating fullCenter"
          >
            <IconComponent strokeWidth={1.5} />
          </Box>
        </Tooltip>
        : <IconButton {...props} disabled={undisabled} onClick={() => FinishPart(log).then(() => {
          cpy[props.index].logs[index].finishTime.value = moment().format('DD/MM/YYYY HH:mm:ss');
          setProjectParts(cpy);

          const updatedItem = machines.find(item => item.id === cpy[props.index].logs[index].machine?.value);
          const updatedIndex = machines.findIndex(item => item.id === cpy[props.index].logs[index].machine?.value);

          const newItems = [
            ...machines.slice(0, updatedIndex),
            { ...updatedItem, currentlyOn: { type: 'Property', value: '' } },
            ...machines.slice(updatedIndex + 1),
          ];

          setMachines(newItems);

          let done = true;
          const actionsDoneNow = getActionsDone(actions);

          Object.keys(actionsDoneNow).map(key => {
            if (!actionsDoneNow[key]) done = false;
          });

          done && updateAmountProd(part);
          toast.success('Terminado.');
        })} >
          <Tooltip title={'Terminar'} >
            <CheckCircle color={!undisabled ? 'green' : 'gray'} />
          </Tooltip>
        </IconButton>;
    }

    return detailOnly
      ? <Tooltip title='Completo'>
        <Check color='green'/>
      </Tooltip>
      : <Box onClick={() => {
        cpy[props.index].logs[index].finishTime.value = moment().format('DD/MM/YYYY HH:mm:ss');
        setProjectParts(cpy);
      }}>
        <IconButton disabled={undisabled} onClick={() => {
        }} >
          <Tooltip title={'Feito'} >
            <Check color={!undisabled ? 'green' : 'gray'} />
          </Tooltip>
        </IconButton>
      </Box>;
  };

  function isActive ({ field }) {
    if (!myMachine?.machineType?.value?.toLowerCase().includes(field)) return true;

    if (myMachine?.currentlyOn?.value) return true;

    return false;
  }

  return <>
    {detailOnly && <Grow in={true}>
      <Box>
        <Box id='pad'>
          <Box style={{ display: 'flex', marginBottom: '1rem' }}>
            <Typography variant='title'>Produção</Typography>
            <Box style={{ marginLeft: 'auto' }}>
              <PrimaryBtn
                onClick={() => setProductionDetailModal(!productionDetailModal)}
                icon={
                  <Eye
                  />
                }
                text='Ver detalhes'
              />
            </Box>
          </Box>
        </Box>
        <Box sx={{ width: '100%', overflow: 'scroll' }}>
          <Grid container md={12} sm={12} xs={12} bgcolor={'#F9F9F9'}>
            <Grid {...cellProps}><Box className='fullCenter'sx={{ width: '100%' }}><Typography variant="sm"> Nome </Typography></Box></Grid>
            <Grid {...cellProps}><Box className='fullCenter'sx={{ width: '100%' }}><Typography variant="sm"> Material  </Typography></Box></Grid>
            <Grid {...cellProps}><Box className='fullCenter'sx={{ width: '100%' }}><Typography variant="sm"> Qtd.  </Typography></Box></Grid>
            <Grid {...cellProps}><Box className='fullCenter'sx={{ width: '100%' }}><Typography variant="sm"> Comp.  </Typography></Box></Grid>
            <Grid {...cellProps}><Box className='fullCenter'sx={{ width: '100%' }}><Typography variant="sm"> Larg.  </Typography></Box></Grid>
            <Grid {...cellProps}><Box className='fullCenter'sx={{ width: '100%' }}><Typography variant="sm"> Esp.  </Typography></Box></Grid>
            <Grid {...cellProps}><Box className='fullCenter'sx={{ width: '100%' }}><Typography variant="sm"> Peso  </Typography></Box></Grid>
            <Grid {...cellProps}><Box className='fullCenter'sx={{ width: '100%' }}><Typography variant="sm"> Etiqueta  </Typography></Box></Grid>
            <Grid {...cellProps}><Box className='fullCenter'sx={{ width: '100%' }}><Typography variant="sm"> Nest.  </Typography></Box></Grid>
            <Grid {...cellProps}><Box className='fullCenter'sx={{ width: '100%' }}><Typography variant="sm"> Cnc  </Typography></Box></Grid>
            <Grid {...cellProps}><Box className='fullCenter'sx={{ width: '100%' }}><Typography variant="sm"> Orla  </Typography></Box></Grid>
            <Grid {...cellProps}><Box className='fullCenter'sx={{ width: '100%' }}><Typography variant="sm"> Furo Face  </Typography></Box></Grid>
            <Grid {...cellProps}><Box className='fullCenter'sx={{ width: '100%' }}><Typography variant="sm"> Tupia  </Typography></Box></Grid>
            <Grid {...cellProps}><Box className='fullCenter'sx={{ width: '100%' }}><Typography variant="sm"> Obs  </Typography></Box></Grid>
            <Grid {...cellProps}><Box className='fullCenter'sx={{ width: '100%' }}><Typography variant="sm">  <Check /> </Typography></Box></Grid>
          </Grid>
          <Grid container md={12} sm={12} xs={12}>
            {projectParts
              .sort((a, b) => a.tag - b.tag)
              .map((part, rowIndex) => {
                const actions = {
                  isNest: part.nestingFlag,
                  isCnc: part.cncFlag,
                  isOrla: part.orla2 || part.orla3 || part.orla4 || part.orla5,
                  isFuroFace: part.f2 || part.f3 || part.f4 || part.f5,
                  isTupia: part.tupia,
                };

                let done = true;

                function getActionsDone (actions) {
                  const actionsDone = {};

                  if (actions.isNest) {
                    const haveLogs = part.logs?.find(log => log?.action?.value === 'nestingFlag' && log?.finishTime?.value !== '');

                    if (haveLogs && haveLogs.finishTime.value !== '') actionsDone.isNest = true;
                    else actionsDone.isNest = false;
                  }

                  if (actions.isCnc) {
                    const haveLogs = part.logs?.find(log => log?.action?.value === 'cncFlag' && log?.finishTime?.value !== '');

                    if (haveLogs && haveLogs.finishTime.value !== '') actionsDone.isCnc = true;
                    else actionsDone.isCnc = false;
                  }

                  if (actions.isOrla) {
                    const haveLogs = part.logs?.find(log => log?.action?.value === 'orla' && log?.finishTime?.value !== '');

                    if (haveLogs && haveLogs.finishTime.value !== '') actionsDone.isOrla = true;
                    else actionsDone.isOrla = false;
                  }

                  if (actions.isFuroFace) {
                    const haveLogs = part.logs?.find(log => log?.action?.value === 'f' && log?.finishTime?.value !== '');

                    if (haveLogs && haveLogs.finishTime.value !== '') actionsDone.isFuroFace = true;
                    else actionsDone.isFuroFace = false;
                  }

                  if (actions.isTupia) {
                    const haveLogs = part.logs?.find(log => log?.action?.value === 'tupia' && log?.finishTime?.value !== '');

                    if (haveLogs && haveLogs.finishTime.value !== '') actionsDone.isTupia = true;
                    else actionsDone.isTupia = false;
                  }

                  return actionsDone;
                }

                const actionsDoneNow = getActionsDone(actions);

                Object.keys(actionsDoneNow).map(key => {
                  if (!actionsDoneNow[key]) done = false;
                });

                return !done && part.logs?.find(ele => ele.finishTime.value === '') && (
                  <Grid
                    {...rowProps}
                    key={rowIndex}
                    bgcolor={rowIndex % 2 !== 0 && 'lightGray.edges'}
                  >
                    <Grid {...cellProps} > <Typography variant='sm'>{ part.partName?.replace(/_/g, '') } </Typography></Grid>
                    <Grid {...cellProps} > <Typography variant='sm'>{ part.material } </Typography></Grid>
                    <Grid {...cellProps} > <Typography variant='sm'>{ part.amount } </Typography></Grid>
                    <Grid {...cellProps} > <Typography variant='sm'>{ part.length } mm </Typography></Grid>
                    <Grid {...cellProps} > <Typography variant='sm'>{ part.width } mm </Typography></Grid>
                    <Grid {...cellProps} > <Typography variant='sm'>{ part.thickness } mm </Typography></Grid>
                    <Grid {...cellProps} > <Typography variant='sm'>{ part.weight } </Typography></Grid>
                    <Grid {...cellProps} > <Typography variant='sm'>{ part.tag } </Typography></Grid>
                    <Grid {...cellProps} >
                      <ActionStatus {...props} part={part} index={rowIndex} detailOnly={detailOnly} field={'nestingFlag'}/>
                    </Grid>
                    <Grid {...cellProps} >
                      <ActionStatus {...props} part={part} index={rowIndex} detailOnly={detailOnly} field={'cncFlag'}/>
                    </Grid>
                    <Grid {...cellProps} >
                      <ActionStatus {...props} part={part} index={rowIndex} detailOnly={detailOnly} field={'orla'}/>
                    </Grid>
                    <Grid {...cellProps} >
                      <ActionStatus {...props} part={part} index={rowIndex} detailOnly={detailOnly} field={'f'}/>
                    </Grid>
                    <Grid {...cellProps} >
                      <ActionStatus {...props} part={part} index={rowIndex} detailOnly={detailOnly} field={'tupia'}/>
                    </Grid>
                    <Grid {...cellProps} > <Typography variant='sm'>{ part.observation } </Typography></Grid>
                    <Grid {...cellProps} > <PartStatus part={part} /></Grid>
                  </Grid>
                );
              })}
          </Grid>
        </Box>
      </Box>
    </Grow>}
    {(productionDetailModal || open) && <Dialog
      fullScreen
      open={!!chosenFurniture}
      onClose={() => {
        setProductionDetailModal(!productionDetailModal);
        onClose && onClose();
      }}
      TransitionComponent={Transition}
      sx={{ display: !chosenFurniture && 'none' }}
    >
      <AppBar position='sticky'sx={{ backgroundColor: 'default.sides' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex' }}>
            <Box sx={{ p: 1, display: 'flex', alignItems: 'center' }}>
              <Image
                src={companyLogo}
                alt={'company Logo'}
                width={50}
                length={50}
                placeholder='blur'
              />
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => {
                  setProductionDetailModal(!productionDetailModal);
                  onClose && onClose();
                }}
                aria-label="close"
                sx={{ marginLeft: '2rem' }}
              >
                <X />
              </IconButton>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Tooltip title='Abrir Menu'>
                <IconButton
                  id='drawerToggleBtn'
                  color='inherit'
                  aria-label='open drawer'
                  edge='start'
                  sx={{ ml: 2 }}
                >
                  <Menu
                    style={{ color: 'var(--white)' }}
                  />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          <Box id='align'justifyContent={'end'}>
            <Box pr={3}>
              <Typography variant='md'sx={{ display: !reduxState.auth.me && 'none' }}>{reduxState.auth.me?.name?.value || reduxState.auth.me?.givenName?.value || (reduxState.auth.me?.first_name !== '' ? reduxState.auth.me?.first_name + '' + reduxState.auth.me?.last_name : reduxState.auth.me.username)}</Typography>
            </Box>
            <Box >
              <Image
                src={woodWorkyLogo}
                alt={'App Logo'}
                width={50}
                length={50}
                placeholder='blur'
                loading='lazy'
              />
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      <Notification />
      {fullyLoaded
        ? <Grid component='main'sx={{ padding: '0rem 2rem 4rem 2rem' }} >
          {!detailOnly && <CustomBreadcrumbs path={[
            {
              title: 'Chão de Fabrica',
              href: `${routes.private.internal.factory}`,
            }, {
              title: chosenFurniture.name.value,
              href: `${routes.private.internal.factory}`,
            }
          ]} />}
          <Content>
            <Popover
              open={openPopover?.target}
              anchorEl={openPopover?.target}
              onClose={() => setOpenPopover(null)}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
            >
              <Typography sx={{ p: 2 }}>{openPopover?.msg}</Typography>
            </Popover>
            <Grid id='pad'container md={12} sm={12} xs={12}>
              <Grid container md={4} sm={6} xs={6}>
                <Grid container md={12} sm={12} xs={12} pb={0.5} >
                  <Typography variant='titlexxl'>{chosenFurniture?.name?.value}</Typography>
                </Grid>
                <Grid container md={6} sm={6} xs={6} pb={0.5} display={detailOnly && 'none'} >
                  <Tooltip title='Cliente'>
                    <Typography variant='subtitle1'><a style={{ fontWeight: 'bold' }}>Cliente: </a>{furnitureProject?.client?.user?.first_name} {furnitureProject?.client?.user?.last_name}</Typography>
                  </Tooltip>
                </Grid>
                <Grid container md={6} sm={6} xs={6} pb={0.5} display={detailOnly && 'none'} justifyContent={'end'}>
                  <Tooltip title='Projeto'>
                    <Typography variant='subtitle1'><a style={{ fontWeight: 'bold' }}>Projeto: </a>{furnitureProject?.name?.value}</Typography>
                  </Tooltip>
                </Grid>
                <Grid container md={6} sm={6} xs={6} pb={0.5} display={detailOnly && 'none'} >
                  <Tooltip title='Grupo'>
                    <Typography variant='subtitle1'><a style={{ fontWeight: 'bold' }}>Grupo: </a>{chosenFurniture?.group?.value}</Typography>
                  </Tooltip>
                </Grid>
                <Grid container md={6} sm={6} xs={6} pb={0.5} display={detailOnly && 'none'} justifyContent={'end'}>
                  <Tooltip title='Subgrupo'>
                    <Typography variant='subtitle1'><a style={{ fontWeight: 'bold' }}>Subgrupo: </a>{chosenFurniture?.subGroup?.value || 'cozinha'}</Typography>
                  </Tooltip>
                </Grid>
                <Grid container md={6} sm={6} xs={6} pb={0.5} display={detailOnly && 'none'} >
                  <Tooltip title='Quantidade'>
                    <Typography variant="subtitle1" color='primary'>
                      Quantidade: {chosenFurniture.amount.value}
                    </Typography>
                  </Tooltip>
                </Grid>
              </Grid>
              <Grid container md={4} sm={6} xs={6} p={4} display={detailOnly && 'none'} >
                <MySelect disabled={myMachine?.currentlyOn?.value} options={machines.filter((mach) => {
                  const isExecuting = activeWorkerTasks.find(
                    ele => ele.machine.value === mach.id && ele.executedBy?.object === 'urn:ngsi-ld:Worker:' + me.id
                  );

                  return !isExecuting || isExecuting.executedBy?.object === 'urn:ngsi-ld:Worker:' + me.id;
                })
                } value={myMachine?.id} label={'Máquina'} optionLabel={'Nome'} onChange={(e) => {
                  // setState({ ...state, myMachine: state.machines?.find(ele => ele.id === e.target.value) });
                  setMyMachine(machines.find(ele => ele.id === e.target.value));
                }} />
              </Grid>
            </Grid>
            <Grid container md={12} sm={12} xs={12}>
              <Tabs value={value} onChange={handleChange} sx={{ width: '100%' }}>
                <Tab label="Lista de Corte" {...a11yProps(0)} sx={{ width: '100%' }}/>
                <Tab label="Acessórios" {...a11yProps(1)} sx={{ width: '100%' }}/>
              </Tabs>
              <TabPanel value={value} index={0}>
                <Grow in={true}>
                  <Box sx={{ length: '100%', overflowX: 'scroll' }}>
                    <Grid container sx={{ minWidth: '1024px', overflowX: 'scroll' }}>
                      {/* Headers */}
                      <Grid container md={12} sm={12} xs={12} bgcolor={'#F9F9F9'}>
                        <Grid {...cellProps}><Box className='fullCenter'sx={{ width: '100%' }}><Typography variant="sm"> Nome </Typography></Box></Grid>
                        <Grid {...cellProps}><Box className='fullCenter'sx={{ width: '100%' }}><Typography variant="sm"> Material  </Typography></Box></Grid>
                        <Grid {...cellProps}><Box className='fullCenter'sx={{ width: '100%' }}><Typography variant="sm"> Qtd.  </Typography></Box></Grid>
                        <Grid {...cellProps}><Box className='fullCenter'sx={{ width: '100%' }}><Typography variant="sm"> Comp.  </Typography></Box></Grid>
                        <Grid {...cellProps}><Box className='fullCenter'sx={{ width: '100%' }}><Typography variant="sm"> Larg.  </Typography></Box></Grid>
                        <Grid {...cellProps}><Box className='fullCenter'sx={{ width: '100%' }}><Typography variant="sm"> Esp.  </Typography></Box></Grid>
                        <Grid {...cellProps}><Box className='fullCenter'sx={{ width: '100%' }}><Typography variant="sm"> Peso  </Typography></Box></Grid>
                        <Grid {...cellProps}><Box className='fullCenter'sx={{ width: '100%' }}><Typography variant="sm"> Etiqueta  </Typography></Box></Grid>
                        <Grid {...cellProps}><Box className='fullCenter'sx={{ width: '100%' }}><Typography variant="sm"> Nest.  </Typography></Box></Grid>
                        <Grid {...cellProps}><Box className='fullCenter'sx={{ width: '100%' }}><Typography variant="sm"> Cnc  </Typography></Box></Grid>
                        <Grid {...cellProps}><Box className='fullCenter'sx={{ width: '100%' }}><Typography variant="sm"> Orla  </Typography></Box></Grid>
                        <Grid {...cellProps}><Box className='fullCenter'sx={{ width: '100%' }}><Typography variant="sm"> Furo Face  </Typography></Box></Grid>
                        <Grid {...cellProps}><Box className='fullCenter'sx={{ width: '100%' }}><Typography variant="sm"> Tupia  </Typography></Box></Grid>
                        <Grid {...cellProps}><Box className='fullCenter'sx={{ width: '100%' }}><Typography variant="sm"> Obs  </Typography></Box></Grid>
                        <Grid {...cellProps}><Box className='fullCenter'sx={{ width: '100%' }}><Typography variant="sm">  <Check /> </Typography></Box></Grid>
                      </Grid>
                      <Grid container md={12} sm={12} xs={12}>
                        {projectParts
                          .sort((a, b) => a.tag - b.tag)
                          .map((part, rowIndex) => {
                            return (
                              <Grid
                                {...rowProps}
                                key={rowIndex}
                                bgcolor={rowIndex % 2 !== 0 && 'lightGray.edges'}
                              >
                                <Grid {...cellProps} > <Typography variant='sm'>{ part.partName?.replace(/_/g, '') } </Typography></Grid>
                                <Grid {...cellProps} > <Typography variant='sm'>{ part.material } </Typography></Grid>
                                <Grid {...cellProps} > <Typography variant='sm'>{ part.amount } </Typography></Grid>
                                <Grid {...cellProps} > <Typography variant='sm'>{ part.length } mm </Typography></Grid>
                                <Grid {...cellProps} > <Typography variant='sm'>{ part.width } mm </Typography></Grid>
                                <Grid {...cellProps} > <Typography variant='sm'>{ part.thickness } mm </Typography></Grid>
                                <Grid {...cellProps} > <Typography variant='sm'>{ part.weight } </Typography></Grid>
                                <Grid {...cellProps} > <Typography variant='sm'>{ part.tag } </Typography></Grid>
                                <Grid {...cellProps} >
                                  <ActionStatus {...props} part={part} index={rowIndex} detailOnly={detailOnly}
                                    disabled={isActive({ part, field: 'nesting' })}
                                    field={'nestingFlag'}/>
                                </Grid>
                                <Grid {...cellProps} >
                                  <ActionStatus {...props} part={part} index={rowIndex} detailOnly={detailOnly} disabled={isActive({ part, field: 'cnc' })} field={'cncFlag'}/>
                                </Grid>
                                <Grid {...cellProps} >
                                  <ActionStatus {...props} part={part} index={rowIndex} detailOnly={detailOnly} disabled={isActive({ part, field: 'orla' })} field={'orla'}/>
                                </Grid>
                                <Grid {...cellProps} >
                                  <ActionStatus {...props} part={part} index={rowIndex} detailOnly={detailOnly} disabled={isActive({ part, field: 'furo' })} field={'f'}/>
                                </Grid>
                                <Grid {...cellProps} >
                                  <ActionStatus {...props} part={part} index={rowIndex} detailOnly={detailOnly} disabled={isActive({ part, field: 'tupia' })} field={'tupia'}/>
                                </Grid>
                                <Grid {...cellProps} >
                                  <Tooltip title={part.observation}>
                                    <Typography variant='sm'>{ part.observation && <IconButton onClick={(event) => setOpenPopover({ target: event.currentTarget, msg: part.observation })}><icons.FileText /></IconButton> } </Typography>
                                  </Tooltip>
                                </Grid>
                                <Grid {...cellProps} > <PartStatus part={part} /></Grid>
                              </Grid>
                            );
                          })}
                      </Grid>
                    </Grid>
                  </Box>
                </Grow>
              </TabPanel>
              <TabPanel value={value} index={1}>
                <Grow in={true}>
                  <Box sx={{ length: '100%', overflowX: 'scroll' }}>
                    <Grid container sx={{ minWidth: '1024px', overflowX: 'scroll' }}>
                      {/* Headers */}
                      <Grid container md={12} sm={12} xs={12} bgcolor={'#F9F9F9'}>
                        <Grid {...cellProps} md={3} sm={3} xs={3} ><Box className='fullCenter'sx={{ width: '100%' }}><Typography variant="sm"> Nome </Typography></Box></Grid>
                        <Grid {...cellProps} md={3} sm={3} xs={3} ><Box className='fullCenter'sx={{ width: '100%' }}><Typography variant="sm"> Material </Typography></Box></Grid>
                        <Grid {...cellProps} md={3} sm={3} xs={3} ><Box className='fullCenter'sx={{ width: '100%' }}><Typography variant="sm"> Qtd.  </Typography></Box></Grid>
                        <Grid {...cellProps} md={3} sm={3} xs={3} ><Box className='fullCenter'sx={{ width: '100%' }}><Typography variant="sm"> Etiqueta  </Typography></Box></Grid>
                        {/* <Grid {...cellProps} md={3} sm={3} xs={3} ><Box className='fullCenter'sx={{ width: '100%' }}><Typography variant="sm"> <Box className='fullCenter'sx={{ width: '100%' }}><Typography variant="sm">  <Check /> </Typography></Box>  </Typography></Box></Grid> */}

                      </Grid>
                      <Grid container md={12} sm={12} xs={12}>
                        {consumables
                          .map((consumable, rowIndex) => {
                            return (
                              <Grid
                                {...rowProps}
                                key={rowIndex}
                                bgcolor={rowIndex % 2 !== 0 && 'lightGray.edges'}
                              >
                                <Grid {...cellProps} md={3} sm={3} xs={3} > <Typography variant='sm'>{ consumable?.name?.value?.replace(/_/g, ' ') } </Typography></Grid>
                                <Grid {...cellProps} md={3} sm={3} xs={3} > <Typography variant='sm'>{ consumable?.material?.value } </Typography></Grid>
                                <Grid {...cellProps} md={3} sm={3} xs={3} > <Typography variant='sm'>{ consumable?.amount?.value } </Typography></Grid>
                                <Grid {...cellProps} md={3} sm={3} xs={3} > <Typography variant='sm'>{ consumable?.tag?.value } </Typography></Grid>
                                {/* <Grid {...cellProps} md={3} sm={3} xs={3} ><PartStatus part={consumable} /></Grid> */}
                              </Grid>
                            );
                          })}
                      </Grid>
                    </Grid>
                  </Box>
                </Grow>
              </TabPanel>
            </Grid>
          </Content>
          {!props?.projectParts && true && <Button sx={{ width: 'fit-content', color: 'transparent' }} onClick={() => createParts()}>Create</Button>}
        </Grid>
        : <Loader center={true} />
      }
    </Dialog>}
  </>;
};

export default FurnitureDetails;
