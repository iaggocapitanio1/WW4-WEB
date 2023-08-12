import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../components/loader/loader';
import AuthData from '../../lib/AuthData';
import routes from '../../navigation/routes';
import * as budgetsActionsRedux from '../../store/actions/budget';
import * as clientsActionsRedux from '../../store/actions/client';
import * as projectsActionsRedux from '../../store/actions/project';
import PackagesScreen from '../../components/pages/packingList/packingList';

const Packing = () => {
  const [loaded, setLoaded] = useState(false);
  const [projs, setProjs] = useState([]);
  const reduxState = useSelector((state) => state);
  const getProjects = (data) => dispatch(projectsActionsRedux.projects(data));
  const getBudget = (data) => dispatch(budgetsActionsRedux.budget(data));
  const getClient = (data) => dispatch(clientsActionsRedux.client(data));
  const dispatch = useDispatch();

  useEffect(() => {
    async function getData () {
      (!reduxState.auth.me || !reduxState.auth.userPermissions) && AuthData(dispatch);

      const [projectsData] = await Promise.all([
        getProjects({ status: 'packing' }),
      ]);

      const projects = projectsData.data;

      const projectBudgets = await Promise.all(projects.map(async (project) => {
        const [budgetData, clientData] = await Promise.all([
          getBudget(project.hasBudget.object),
          getClient(project.orderBy.object.replace('urn:ngsi-ld:Owner:', ''))
        ]);

        const budget = budgetData.data;
        const client = clientData.data;

        return {
          ...project,
          budget,
          client,
        };
      }));

      setProjs(projectBudgets
        .sort((a, b) => {
          const aDate = moment(a.budget.dateDeliveryProject.value, 'DD/MM/YYYY');
          const bDate = moment(b.budget.dateDeliveryProject.value, 'DD/MM/YYYY');

          return aDate - bDate;
        }));

      setLoaded(true);
    }

    getData();
  }, []);

  if (loaded) {
    const breadcrumbsPath = [
      {
        title: 'Embalamentos',
        href: `${routes.private.internal.packing}`,
      }
    ];

    const props = {
      breadcrumbsPath,
      projects: projs,
    };

    return <PackagesScreen {...props} />;
  }

  return <Loader center={true} />;
};

export default Packing;
