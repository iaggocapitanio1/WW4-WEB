//  Nodes
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

//  Preloader
import Loader from '../../components/loader/loader';

//  Page Component
import OrderScreen from '../../components/pages/project/project';
import routes from '../../navigation/routes';

//  Navigation

//  Services
import * as assemblysActionsRedux from '../../store/actions/assembly';
import * as budgetsActionsRedux from '../../store/actions/budget';
import * as clientsActionsRedux from '../../store/actions/client';
import * as expeditionsActionsRedux from '../../store/actions/expedition';
import * as filesActionsRedux from '../../store/actions/file';
import * as foldersActionsRedux from '../../store/actions/folder';
import * as furnituresActionsRedux from '../../store/actions/furniture';
import * as projectsActionsRedux from '../../store/actions/project';
import { categories } from '../internal/new-project';

const Order = ({ ...pageProps }) => {
  const reduxState = useSelector((state) => state);
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();
  const getProject = (data) => dispatch(projectsActionsRedux.project(data));
  const setDisplayedProject = (data) => dispatch(projectsActionsRedux.setDisplayedProject(data));
  const getBudget = (data) => dispatch(budgetsActionsRedux.budget(data));
  const getClient = (data) => dispatch(clientsActionsRedux.client(data));
  const getExpedition = (data) => dispatch(expeditionsActionsRedux.expedition(data));
  const getFolders = (data) => dispatch(foldersActionsRedux.budgetFolders(data));
  const getFiles = (data) => dispatch(filesActionsRedux.budgetFiles(data));
  const getFurnitures = (data) => dispatch(furnituresActionsRedux.furnitures(data));
  const getAssembly = (data) => dispatch(assemblysActionsRedux.assembly(data));
  const [folders, setFolders] = useState();
  const [furnitures, setFurnitures] = useState();
  const [furnituresUnbuilt, setFurnituresUnbuilt] = useState();

  useEffect(() => {
    const getData = async () => {
      const project = (await getProject(router.query.Id)).data;
      const budget = (await getBudget(project.hasBudget.object)).data;
      const client = (await getClient(project.orderBy.object.replace('urn:ngsi-ld:Owner:', ''))).data;
      const assembly = project.assembly?.object && (await getAssembly(project.assembly?.object)).data;
      const expedition = project.expedition?.object && await getExpedition(project.expedition?.object).then((res) => { return res.data; }).catch(() => { return {}; });
      const furnitures = (await getFurnitures()).data.filter(ele => ele.hasBudget?.object === project.hasBudget.object);
      const furnitures2 = furnitures.sort((a, b) => (a.lineNumber?.value > b.lineNumber?.value) ? 1 : -1);
      const built = [];
      let currentGroup = null;
      let currentSubGroup = null;

      // eslint-disable-next-line array-callback-return
      furnitures2.map((item) => {
        if (item.furnitureType.value === 'group') {
          // Create a new group object
          currentGroup = {
            ...item,
            subgroups: [],
          };

          // Add the group object to the result array
          built.push(currentGroup);
          // Reset the current sub-group object
          currentSubGroup = null;
        } else if (item.furnitureType.value === 'subGroup') {
          // Create a new sub-group object
          currentSubGroup = {
            ...item,
            items: [],
          };

          // Add the sub-group object to the current group's subgroups array
          currentGroup.subgroups.push(currentSubGroup);
        } else {
          // Add the furniture item to the current sub-group's items array
          currentSubGroup.items.push({
            ...item
          });
        }
      });

      setFurnitures(built);
      setFurnituresUnbuilt(furnitures);

      getFolders(project.hasBudget.object).then(async (res) => {
        const resFiles = await getFiles(router.query.Id.replace('Project', 'Budget'));

        // eslint-disable-next-line array-callback-return
        const builtFolders = res.data.results.map((folder) => {
          const folder2 = { ...folder };
          const foundRows = resFiles?.data?.results.filter(row => folder2.files.includes(row.id));

          folder2.files = foundRows;
          // builtFolders.push(folder2);

          return folder2;
        });

        setFolders(builtFolders);
      });

      const thisOrder = JSON.parse(JSON.stringify({ ...project }));

      thisOrder.hasBudget.object = budget;
      thisOrder.orderBy.object = client;
      thisOrder.expedition = expedition;
      thisOrder.assembly = assembly;
      setDisplayedProject(thisOrder);
    };

    Promise.all([getData()]).then(() => setLoaded(true));
  }, []);

  if (loaded &&
    reduxState.projects.displayedProject && folders
  ) {
    const breadcrumbsPath = [
      {
        title: 'Projetos',
        href: `${routes.private.projects}`,
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
      folders,
      categories,
      furnitures
    };

    return <OrderScreen {...props} />;
  }

  return <Loader center={true} />;
};

export default Order;
