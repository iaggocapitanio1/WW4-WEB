/* eslint-disable array-callback-return */
//  Nodes
import React, { useEffect, useState } from 'react';

//  Preloader
import Loader from '../../../components/loader/loader';

//  Page Component
import EditProjectScreen from '../../../components/pages/editBudget/editBudget';

//  Navigation
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import AuthData from '../../../lib/AuthData';
import routes from '../../../navigation/routes';
import * as budgetsActionsRedux from '../../../store/actions/budget';
import * as clientsActionsRedux from '../../../store/actions/client';
import * as furnituresActionsRedux from '../../../store/actions/furniture';

export const categories = [
  { label: 'Cozinha', id: 'MC_' },
  { label: 'Quarto', id: 'MQ_' },
  { label: 'Banheiro', id: 'MB_' },
  { label: 'Garagem', id: 'MG_' },
  { label: 'Varanda', id: 'MV_' },
  { label: 'Sala de estar', id: 'MS_' }
];

const EditProject = ({ ...pageProps }) => {
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();
  const reduxState = useSelector((state) => state);
  const getBudgets = (data) => dispatch(budgetsActionsRedux.budgets(data));
  const getClients = (data) => dispatch(clientsActionsRedux.clients(data));
  const getClient = (data) => dispatch(clientsActionsRedux.client(data));
  const getBudget = (data) => dispatch(budgetsActionsRedux.budget(data));
  const getFurnitures = (data) => dispatch(furnituresActionsRedux.furnitures(data));
  const setDisplayingBudget = (data) => dispatch(budgetsActionsRedux.setDisplayingBudget(data));
  const router = useRouter();
  const [furnitures, setFurnitures] = useState();
  const [budget, setBudget] = useState();
  const [furnitures2, setFurnitures2] = useState();

  useEffect(() => {
    const getData = async () => {
      (!reduxState.auth.me || !reduxState.auth.userPermissions) && AuthData(dispatch);

      if (!reduxState.budgets.data) await getBudgets();

      if (!reduxState.clients.data) await getClients();

      const budget = (await getBudget(router.query.Id)).data;
      const client = (await getClient(budget.orderBy.object.replace('urn:ngsi-ld:Owner:', ''))).data;
      const furnitures = (await getFurnitures()).data.filter(ele => ele.hasBudget?.object === router.query.Id);
      const thisBudget = JSON.parse(JSON.stringify({ ...budget }));
      const furnitures2 = furnitures.sort((a, b) => (a.lineNumber.value > b.lineNumber.value) ? 1 : -1);
      const built = [];
      let currentGroup = null;
      let currentSubGroup = null;

      furnitures2.map((item) => {
        if (item.furnitureType.value === 'group') {
          // Create a new group object
          currentGroup = {
            ...item,
            name: { required: true, value: item.name.value, error: '' },
            furnitureType: { required: true, value: item.furnitureType.value, error: '' },
            lineNumber: { ...item.lineNumber, hidden: true, error: '', required: false },

            subGroups: [],
          };

          // Add the group object to the result array
          built.push(currentGroup);
          // Reset the current sub-group object
          currentSubGroup = null;
        } else if (item.furnitureType.value === 'subGroup') {
          // Create a new sub-group object
          currentSubGroup = {
            ...item,
            name: { required: true, value: item.name.value, error: '' },
            furnitureType: { required: true, value: item.furnitureType.value, error: '' },
            items: [],
          };

          // Add the sub-group object to the current group's subgroups array
          currentGroup.subGroups.push(currentSubGroup);
        } else {
          if (item.furnitureType.value === 'furniture') {
            // Add the furniture item to the current sub-group's items array
            currentSubGroup?.items?.push({
              ...item,
              furnitureType: { ...item.furnitureType, value: 'furniture', error: '', hidden: true, displayOrder: 22 },
              name: { ...item.name, id: 'name', error: '', required: true, label: 'Nome', displayOrder: 0 },
              description: { ...item.description, id: 'description', error: '', label: 'Descrição', type: 'area', displayOrder: 1 },
              amount: { ...item.amount, id: 'amount', error: '', required: true, label: 'Quantidade', type: 'number', displayOrder: 2 },
              obs: { ...item.obs, id: 'obs', error: '', label: 'Observações', type: 'area', displayOrder: 3 },
              width: { ...item.width, id: 'width', error: '', label: 'Largura', displayOrder: 5 },
              height: { ...item.height, id: 'height', error: '', label: 'Altura', displayOrder: 6 },
              thickness: { ...item.thickness, id: 'thickness', error: '', label: 'Profundidade', displayOrder: 7 },
              price: { ...item.price, id: 'price', error: '', label: 'Valor', type: 'currency', displayOrder: 8 },

              hasBudget: { ...item.hasBudget, hidden: true, displayOrder: 99, error: '' },
              group: { ...item.group, hidden: true, displayOrder: 99, error: '' },
              subGroup: { ...item.subGroup, hidden: true, displayOrder: 99, error: '' },
              lineNumber: { ...item.num, hidden: true, displayOrder: 99, error: '' },
              produced: { ...item.produced, hidden: true, displayOrder: 99, error: '' },
              assembled: { ...item.assembled, hidden: true, displayOrder: 99, error: '' },
            });
          } else {
            currentSubGroup?.items?.push({
              ...item,
              furnitureType: { ...item.furnitureType, value: 'accessory', displayOrder: 99, error: '', hidden: true },
              name: { ...item.name, id: 'name', error: '', required: true, label: 'Nome', displayOrder: 0 },
              description: { ...item.description, id: 'description', error: '', label: 'Descrição', type: 'area', displayOrder: 1 },
              amount: { ...item.amount, id: 'amount', error: '', required: true, label: 'Quantidade', type: 'number', displayOrder: 2 },
              obs: { ...item.obs, id: 'obs', error: '', label: 'Observações', type: 'area', displayOrder: 3 },
              price: { ...item.price, id: 'price', error: '', label: 'Valor', type: 'currency', displayOrder: 4 },

              hasBudget: { ...item.hasBudget, hidden: true, displayOrder: 993, error: '' },
              group: { ...item.group, hidden: true, displayOrder: 9921, error: '' },
              subGroup: { ...item.subGroup, hidden: true, displayOrder: 9941, error: '' },
              lineNumber: { ...item.lineNumber, hidden: true, displayOrder: 9329, error: '' },
              produced: { ...item.produced, hidden: true, displayOrder: 94239, error: '' },
              assembled: { ...item.assembled, hidden: true, displayOrder: 94329, error: '' },
            });
          }
        }
      });

      setFurnitures2(built);

      const groups = furnitures.reduce((accumulator, item) => {
        const groupName = item.group?.value;

        if (!accumulator[groupName]) {
          accumulator[groupName] = {
            id: `group${Object.keys(accumulator).length}`,
            furnitureType: 'group',
            name: groupName,
            items: []
          };
        }

        // Replace the lower level of property's "type" and "value" with just "value"
        const newItem = Object.entries(item).reduce((newObj, [key, value]) => {
          if (typeof value === 'object' && value !== null && 'value' in value) {
            newObj[key] = {
              value: value.value,
              error: '',
            };

            newObj = {
              furnitureType: { ...newObj.furnitureType, value: 'furniture', error: '', hidden: true },
              name: { ...newObj.name, id: 'name', error: '', required: true, label: 'Nome' },
              description: { ...newObj.description, id: 'description', error: '', label: 'Descrição', type: 'area' },
              amount: { ...newObj.amount, id: 'amount', error: '', required: true, label: 'Quantidade', type: 'number' },
              obs: { ...newObj.obs, id: 'obs', error: '', label: 'Observações', type: 'area' },
              width: { ...newObj.width, id: 'width', error: '', label: 'Largura' },
              height: { ...newObj.height, id: 'height', error: '', label: 'Altura' },
              thickness: { ...newObj.thickness, id: 'thickness', error: '', label: 'Profundidade' },
              price: { ...newObj.price, id: 'price', error: '', label: 'Valor', type: 'currency' },
              category: { ...newObj.category, hidden: true, id: 'category', error: '', options: categories, label: 'Categoria' },

              lineNumber: { ...newObj.lineNumber, hidden: true, error: '', required: false },
              hasBudget: { ...newObj.hasBudget, hidden: true },
              group: { ...newObj.group, hidden: true },
              num: { ...newObj.num, hidden: true },
            };
          } else {
            newObj[key] = value;
          }

          newObj.id = item.id;

          return newObj;
        }, {});

        accumulator[groupName].items.push(newItem);

        return accumulator;
      }, {});

      const result = Object.values(groups);

      setFurnitures(result);
      thisBudget.orderBy.object = client;
      setBudget(thisBudget);
      setDisplayingBudget(thisBudget);
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
        title: `${budget.name.value}`,
        href: budget.budgetStatus.value === 'adjudicated'
          ? routes.private.internal.project + budget.id.replace(/Budget/g, 'Project')
          : routes.private.internal.budget + budget.id,
      },
      {
        title: 'Editar projeto',
        href: `${routes.private.internal.budget}`,
      },
    ];

    const props = {
      breadcrumbsPath,
      pageProps,
      budgets: reduxState.budgets.data,
      clients: [...reduxState.clients?.data ?? []].map((client) => {
        return {
          ...client,
          Nome: client.user.first_name + ' ' + client.user.last_name + ' - ' + client.user.email,
          Email: client.user.email,
        };
      }),
      categories,
      countries: [...reduxState?.countries?.data || []],
      furnitures,
      furnitures2,
      budget,
    };

    return <EditProjectScreen {...props} />;
  }

  return <Loader center={true} />;
};

export default EditProject;
