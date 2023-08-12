import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../components/loader/loader';
import FactoryGroundScreen from '../../components/pages/factoryGround/factoryGround';
import AuthData from '../../lib/AuthData';
import routes from '../../navigation/routes';
import * as budgetsActionsRedux from '../../store/actions/budget';
import * as clientsActionsRedux from '../../store/actions/client';
import * as furnituresActionsRedux from '../../store/actions/furniture';
import * as machinesActionsRedux from '../../store/actions/machine';
import * as projectsActionsRedux from '../../store/actions/project';

const FactoryGround = () => {
  const [loaded, setLoaded] = useState(false);
  const [projs, setProjs] = useState([]);
  const reduxState = useSelector((state) => state);
  const getProjects = (data) => dispatch(projectsActionsRedux.projects(data));
  const getMachines = (data) => dispatch(machinesActionsRedux.machines(data));
  const getBudget = (data) => dispatch(budgetsActionsRedux.budget(data));
  const getFurnitures = (data) => dispatch(furnituresActionsRedux.furnitures(data));
  const getClient = (data) => dispatch(clientsActionsRedux.client(data));
  const dispatch = useDispatch();

  useEffect(() => {
    async function getData () {
      (!reduxState.auth.me || !reduxState.auth.userPermissions) && AuthData(dispatch);

      const [projectsData] = await Promise.all([
        getProjects({ status: 'production' }),
        getMachines()
      ]);

      const projects = projectsData.data;

      const projectBudgets = await Promise.all(projects?.map(async (project) => {
        const [budgetData, furnituresData, clientData] = await Promise.all([
          getBudget(project.hasBudget.object),
          getFurnitures({ hasBudget: project.hasBudget.object, furnitureType: 'furniture', produced: false }),
          getClient(project.orderBy.object.replace('urn:ngsi-ld:Owner:', ''))
        ]);

        const budget = budgetData.data;
        const furnitures = [...furnituresData.data].sort((a, b) => (a.lineNumber?.value > b.lineNumber?.value) ? 1 : -1);
        const client = clientData.data;

        return {
          ...project,
          budget,
          client,
          furnitures
        };
      }));

      setProjs(projectBudgets
        .filter(project => project.furnitures?.length > 0)
        .sort((a, b) => {
          const aDate = moment(a.budget?.dateDeliveryProject?.value, 'DD/MM/YYYY');
          const bDate = moment(b.budget?.dateDeliveryProject?.value, 'DD/MM/YYYY');

          return aDate - bDate;
        }));

      setLoaded(true);
    }

    getData();
  }, []);

  if (loaded && reduxState.machines.data) {
    const breadcrumbsPath = [
      {
        title: 'Chão de Fabrica',
        href: `${routes.private.internal.factorys}`,
      }
    ];

    const props = {
      breadcrumbsPath,
      projects: projs,
    };

    return <FactoryGroundScreen {...props} />;
  }

  return <Loader center={true} />;
};

export default FactoryGround;
