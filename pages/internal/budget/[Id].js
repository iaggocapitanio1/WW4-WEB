/* eslint-disable array-callback-return */
//  Page Component
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Loader from '../../../components/loader/loader';
import BudgetScreen from '../../../components/pages/budget/budget';
import routes from '../../../navigation/routes';
import * as budgetsActionsRedux from '../../../store/actions/budget';
import * as clientsActionsRedux from '../../../store/actions/client';
import * as filesActionsRedux from '../../../store/actions/file';
import * as foldersActionsRedux from '../../../store/actions/folder';
import * as furnituresActionsRedux from '../../../store/actions/furniture';

export const buildFoldersStructure = async (array, files) => {
  const builtFolders = [];

  array.map((folder) => {
    const folder2 = { ...folder };

    folder2.files = files.filter((file) => file.folder === folder.id);
    builtFolders.push(folder2);
  });

  return builtFolders;
};

export const buildFurnituresStructure = (array) => {
  const built = [];
  let currentGroup = null;
  let currentSubGroup = null;

  array.map((item) => {
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
      currentGroup?.subgroups.push(currentSubGroup);
    } else {
      // Add the furniture item to the current sub-group's items array
      currentSubGroup?.items?.push({
        ...item
      });
    }
  });

  return built;
};

const Budget = ({ ...pageProps }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [budget, setBudget] = useState();
  const [loaded, setLoaded] = useState(false);
  const [folders, setFolders] = useState([]);
  const [furnitures, setFurnitures] = useState();
  const getBudget = (data) => dispatch(budgetsActionsRedux.budget(data));
  const setDisplayingBudget = (data) => dispatch(budgetsActionsRedux.setDisplayingBudget(data));
  const getClient = (data) => dispatch(clientsActionsRedux.client(data));
  const getFiles = (data) => dispatch(filesActionsRedux.budgetFiles(data));
  const getFolders = (data) => dispatch(foldersActionsRedux.folders(data));
  const getFurnitures = (data) => dispatch(furnituresActionsRedux.furnitures(data));

  useEffect(() => {
    const getData = async () => {
      const budgetData = await getBudget(router.query.Id);

      const [furnituresData, clientData, foldersData, filesData] = await Promise.all([
        getFurnitures({ hasBudget: budgetData.data.id }),
        getClient(budgetData.data.orderBy.object.replace('urn:ngsi-ld:Owner:', '')),
        getFolders({ budget: budgetData.data.id }),
        getFiles(router.query.Id)
      ]);

      setBudget({ ...budgetData.data, orderBy: { ...budgetData.data.orderBy, object: clientData.data } });
      setFurnitures(buildFurnituresStructure([...furnituresData.data].sort((a, b) => (a.lineNumber?.value > b.lineNumber?.value) ? 1 : -1)));
      setDisplayingBudget(budget);
      setFolders(await buildFoldersStructure([...foldersData.data.results], [...filesData.data.results]));
    };

    Promise.all([getData()]).then(() => setLoaded(true));
  }, []);

  if (loaded) {
    const breadcrumbsPath = [
      {
        title: 'Projetos',
        href: `${routes.private.internal.projects}`,
      },
      {
        title: `${budget.orderBy.object.user.first_name} ${budget.orderBy.object.user.last_name} - ${budget.name.value}`,
        href: `${routes.private.internal.budget}`,
      },
    ];

    const props = {
      breadcrumbsPath,
      budget: { ...budget },
      folders,
      pageProps,
      furnitures,
    };

    return <BudgetScreen {...props} />;
  }

  return <Loader center={true} />;
};

export default Budget;
