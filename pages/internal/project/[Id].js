/* eslint-disable array-callback-return */
//  Nodes
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

//  Preloader

//  Page Component

//  Navigation
import routes from '../../../navigation/routes';

//  Page Component
import OrderScreen from '../../../components/pages/project/project';

import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../../components/loader/loader';
import * as assemblysActionsRedux from '../../../store/actions/assembly';
import * as budgetsActionsRedux from '../../../store/actions/budget';
import * as clientsActionsRedux from '../../../store/actions/client';
import * as expeditionsActionsRedux from '../../../store/actions/expedition';
import * as filesActionsRedux from '../../../store/actions/file';
import * as foldersActionsRedux from '../../../store/actions/folder';
import * as furnituresActionsRedux from '../../../store/actions/furniture';
import * as projectsActionsRedux from '../../../store/actions/project';

import { categories } from '../new-project';

const Order = ({ ...pageProps }) => {
  const reduxState = useSelector((state) => state);
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [folders, setFolders] = useState();
  const dispatch = useDispatch();
  const getProject = (data) => dispatch(projectsActionsRedux.project(data));
  const setDisplayedProject = (data) => dispatch(projectsActionsRedux.setDisplayedProject(data));
  const getBudget = (data) => dispatch(budgetsActionsRedux.budget(data));
  const getAssembly = (data) => dispatch(assemblysActionsRedux.assembly(data));
  const getClient = (data) => dispatch(clientsActionsRedux.client(data));
  const getExpedition = (data) => dispatch(expeditionsActionsRedux.expedition(data));
  const getFolders = (data) => dispatch(foldersActionsRedux.budgetFolders(data));
  const getFiles = (data) => dispatch(filesActionsRedux.budgetFiles(data));
  const getFurnitures = (data) => dispatch(furnituresActionsRedux.furnitures(data));
  const [furnitures, setFurnitures] = useState();
  const [furnituresUnbuilt, setFurnituresUnbuilt] = useState();

  //  Dummy
  const projectParts = [
    { partName: 'MC_MUEBLETV_A2_GAV_DIR_FUNDO', material: 'AG L Biscuit Nude 36W 10 ', amount: 1, length: 400, width: 338.5, thickness: 10, tag: 1, nestingFlag: true, cncFlag: true, orla: true, f: true, obs: '', inProduction: false },
    { partName: 'MC_MUEBLETV_A2_GAV_ESQ_FUNDO', material: 'AG L Biscuit Nude 36W 10 ', amount: 1, length: 400, width: 338.5, thickness: 10, tag: 2, nestingFlag: false, cncFlag: false, orla: true, f: false, obs: '', inProduction: false },
    { partName: 'MC_MUEBLETV_A2_GAV_DIR_COSTA', material: 'AG L Biscuit Nude 36W 16 CNC', amount: 1, length: 326.5, width: 184.5, thickness: 16, tag: 3, nestingFlag: false, cncFlag: true, orla: false, f: false, obs: '', inProduction: false },
    { partName: 'MC_MUEBLETV_A2_GAV_DIR_FRT_INT', material: 'AG L Biscuit Nude 36W 16 CNC', amount: 1, length: 326.5, width: 184.5, thickness: 16, tag: 4, nestingFlag: false, cncFlag: true, orla: false, f: false, obs: '', inProduction: false },
    { partName: 'MC_MUEBLETV_A2_GAV_DIR_LAT_DIR', material: 'AG L Biscuit Nude 36W 16 CNC', amount: 1, length: 406, width: 207.5, thickness: 16, tag: 5, nestingFlag: false, cncFlag: true, orla: false, f: false, obs: '', inProduction: false },
    { partName: 'MC_MUEBLETV_A2_GAV_DIR_LAT_ESQ', material: 'AG L Biscuit Nude 36W 16 CNC', amount: 1, length: 406, width: 207.5, thickness: 16, tag: 6, nestingFlag: false, cncFlag: true, orla: false, f: false, obs: '', inProduction: false },
    { partName: 'MC_MUEBLETV_A2_GAV_ESQ_COSTA', material: 'AG L Biscuit Nude 36W 16 CNC', amount: 1, length: 326.5, width: 184.5, thickness: 16, tag: 7, nestingFlag: false, cncFlag: true, orla: false, f: false, obs: '', inProduction: false },
    { partName: 'MC_MUEBLETV_A2_GAV_ESQ_FRT_INT', material: 'AG L Biscuit Nude 36W 16 CNC', amount: 1, length: 326.5, width: 184.5, thickness: 16, tag: 8, nestingFlag: false, cncFlag: true, orla: false, f: false, obs: '', inProduction: false },
    { partName: 'MC_MUEBLETV_A2_GAV_ESQ_LAT_DIR', material: 'AG L Biscuit Nude 36W 16 CNC', amount: 1, length: 406, width: 207.5, thickness: 16, tag: 9, nestingFlag: false, cncFlag: true, orla: false, f: false, obs: '', inProduction: false },
    { partName: 'MC_MUEBLETV_A2_GAV_ESQ_LAT_ESQ', material: 'AG L Biscuit Nude 36W 16 CNC', amount: 1, length: 406, width: 207.5, thickness: 16, tag: 10, nestingFlag: false, cncFlag: true, orla: false, f: false, obs: '', inProduction: false },
    { partName: 'MC_MUEBLETV_A1_PAINEL2', material: 'AG L Marmol Hades 19 CNC', amount: 1, length: 2400, width: 926, thickness: 19, tag: 11, nestingFlag: false, cncFlag: true, orla: true, f: false, obs: '', inProduction: false },
    { partName: 'MC_MUEBLETV_A1_RIPAS_SUP_ME_1', material: 'HDF 19 ', amount: 8, length: 540, width: 70, thickness: 19, tag: 12, nestingFlag: false, cncFlag: false, orla: true, f: false, obs: '', inProduction: false },
    { partName: 'MC_MUEBLETV_A1_RIPAS_SUP_ME_2', material: 'HDF 19 ', amount: 8, length: 940, width: 70, thickness: 19, tag: 13, nestingFlag: false, cncFlag: false, orla: true, f: false, obs: '', inProduction: false },
    { partName: 'MC_MUEBLETV_A1_RIPAS_SUP_ME_3', material: 'HDF 19 ', amount: 8, length: 540, width: 70, thickness: 19, tag: 14, nestingFlag: false, cncFlag: false, orla: true, f: false, obs: '', inProduction: false },
    { partName: 'MC_MUEBLETV_A1_PAINEL1', material: 'MDF Folheado Carv 19', amount: 1, length: 2394, width: 560, thickness: 19, tag: 15, nestingFlag: true, cncFlag: false, orla: true, f: false, obs: '', inProduction: false },
    { partName: 'MC_MUEBLETV_A1_PAINEL3', material: 'MDF Folheado Carv 19 CNC', amount: 1, length: 2400, width: 566, thickness: 19, tag: 16, nestingFlag: true, cncFlag: true, orla: true, f: false, obs: '', inProduction: false },
    { partName: 'MC_MUEBLETV_A2_CIMA', material: 'MDF Folheado Carv 19 CNC', amount: 1, length: 1716, width: 466, thickness: 19, tag: 17, nestingFlag: true, cncFlag: true, orla: true, f: false, obs: '', inProduction: false },
    { partName: 'MC_MUEBLETV_A2_DIV_DIR', material: 'MDF Folheado Carv 19 CNC', amount: 1, length: 268, width: 444, thickness: 19, tag: 18, nestingFlag: true, cncFlag: true, orla: true, f: false, obs: '', inProduction: false },
    { partName: 'MC_MUEBLETV_A2_DIV_ESQ', material: 'MDF Folheado Carv 19 CNC', amount: 1, length: 268, width: 444, thickness: 19, tag: 19, nestingFlag: true, cncFlag: true, orla: true, f: false, obs: '', inProduction: false },
    { partName: 'MC_MUEBLETV_A2_FUNDO', material: 'MDF Folheado Carv 19 CNC', amount: 1, length: 1678, width: 444, thickness: 19, tag: 20, nestingFlag: true, cncFlag: true, orla: true, f: false, obs: '', inProduction: false },
    { partName: 'MC_MUEBLETV_A2_GAV_DIR_FRENTE', material: 'MDF Folheado Carv 19 CNC', amount: 1, length: 400, width: 283, thickness: 19, tag: 21, nestingFlag: true, cncFlag: true, orla: true, f: false, obs: '', inProduction: false },
    { partName: 'MC_MUEBLETV_A2_GAV_ESQ_FRENTE', material: 'MDF Folheado Carv 19 CNC', amount: 1, length: 400, width: 283, thickness: 19, tag: 22, nestingFlag: true, cncFlag: true, orla: true, f: false, obs: '', inProduction: false },
    { partName: 'MC_MUEBLETV_A2_LAT_DIR', material: 'MDF Folheado Carv 19 CNC', amount: 1, length: 444, width: 287, thickness: 19, tag: 23, nestingFlag: true, cncFlag: true, orla: true, f: false, obs: '', inProduction: false },
    { partName: 'MC_MUEBLETV_A2_LAT_ESQ', material: 'MDF Folheado Carv 19 CNC', amount: 1, length: 444, width: 287, thickness: 19, tag: 24, nestingFlag: true, cncFlag: true, orla: true, f: false, obs: '', inProduction: false },
    { partName: 'MC_MUEBLETV_A2_PORTA_BASC', material: 'MDF Folheado Carv 19 CNC', amount: 1, length: 924, width: 283, thickness: 19, tag: 25, nestingFlag: true, cncFlag: true, orla: true, f: false, obs: '', inProduction: false },
    { partName: 'MC_MUEBLETV_A2_RIPA_TRAS', material: 'MDF Folheado Carv 19 CNC', amount: 1, length: 907, width: 76, thickness: 19, tag: 26, nestingFlag: true, cncFlag: false, orla: true, f: false, obs: '', inProduction: false },
  ];

  useEffect(() => {
    const getData = async () => {
      const project = (await getProject(router.query.Id)).data;
      const expedition = project.expedition?.object && (await getExpedition(project.expedition?.object)).data;
      const assembly = project.assembly?.object && (await getAssembly(project.assembly?.object)).data;
      const budget = project.hasBudget.object && (await getBudget(project.hasBudget.object)).data;
      const furnitures = (await getFurnitures()).data.filter(ele => ele.hasBudget?.object === project.hasBudget.object);
      const furnitures2 = furnitures.sort((a, b) => (a.lineNumber?.value > b.lineNumber?.value) ? 1 : -1);
      const built = [];
      let currentGroup = null;
      let currentSubGroup = null;

      furnitures2.map((item) => {
        if (item.furnitureType?.value === 'group') {
          // Create a new group object
          currentGroup = {
            ...item,
            subgroups: [],
          };

          // Add the group object to the result array
          built.push(currentGroup);
          // Reset the current sub-group object
          currentSubGroup = null;
        } else if (item.furnitureType?.value === 'subGroup') {
          // Create a new sub-group object
          currentSubGroup = {
            ...item,
            items: [],
          };

          // Add the sub-group object to the current group's subgroups array
          currentGroup?.subgroups?.push(currentSubGroup);
        } else {
          // Add the furniture item to the current sub-group's items array
          currentSubGroup?.items?.push({
            ...item
          });
        }
      });

      setFurnituresUnbuilt(furnitures);
      setFurnitures(built);

      const client = (await getClient(project.orderBy.object.replace('urn:ngsi-ld:Owner:', ''))).data;

      getFolders(project.hasBudget.object).then(async (res) => {
        const builtFolders = [];
        const resFiles = await getFiles(router.query.Id.replace('Project', 'Budget'));

        res.data.results.map((folder) => {
          const folder2 = { ...folder };
          const foundRows = resFiles?.data?.results.filter(row => folder2.files.includes(row.id));

          folder2.files = foundRows;
          builtFolders.push(folder2);
        });

        console.log(builtFolders);
        setFolders(builtFolders);
      });

      //  Build production Detail

      const thisOrder = JSON.parse(JSON.stringify({ ...project }));

      thisOrder.hasBudget.object = budget;
      thisOrder.orderBy.object = client;
      thisOrder.expedition = expedition;
      thisOrder.assembly = assembly;
      setDisplayedProject(thisOrder);
    };

    Promise.all([getData()])
      .then(() => setLoaded(true));
  }, []);

  if (loaded &&
    reduxState.projects.displayedProject && folders
  ) {
    const breadcrumbsPath = [
      {
        title: 'Projetos',
        href: `${routes.private.internal.projects}`,
      },
      {
        title: `${reduxState.projects.displayedProject?.name?.value}`,
        href: `${routes.private.internal.project}`,
      },
    ];

    const props = {
      order: reduxState.projects.displayedProject,
      furnituresUnbuilt,
      breadcrumbsPath,
      pageProps,
      projectParts,
      workers: [],
      folders,
      categories,
      furnitures,
      finishProject: router.query.finishProject
    };

    return <OrderScreen {...props} />;
  }

  return <Loader center={true} />;
};

export default Order;
