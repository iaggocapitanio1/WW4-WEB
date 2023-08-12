/* eslint-disable array-callback-return */
//  Nodes
import React, { useEffect, useState } from 'react';

//  Preloader
import Loader from '../components/loader/loader';
import MessagesScreen from '../components/pages/messages/messages';

import routes from '../navigation/routes';

//  Page Component
//  Data services
import { useDispatch } from 'react-redux';
import * as budgetsActionsRedux from '../store/actions/budget';
import * as projectsActionsRedux from '../store/actions/project';

const Messages = ({ ...pageProps }) => {
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();
  const [merged, setMerged] = useState();
  const getProjects = (data) => dispatch(projectsActionsRedux.projects(data));
  const getBudgets = (data) => dispatch(budgetsActionsRedux.activebudgets(data));
  const getBudget = (data) => dispatch(budgetsActionsRedux.budget(data));

  useEffect(() => {
    async function load () {
      try {
        const projects = (await getProjects(
          [{ key: 'status', value: 'finished', operator: '!=' }]
        )).data.filter(ele => ele.status.value !== 'finished');

        const builtProjects = await Promise.all(projects?.map(async (project) => {
          const [budgetData] = await Promise.all([
            getBudget(project.hasBudget.object),
          ]);

          const budget = budgetData.data;

          return {
            ...project,
            hasBudget: { ...project.hasBudget, object: budget },
          };
        }));

        const budgetsRes = await getBudgets();

        const budgets = budgetsRes.data.map((budget) => {
          const bud = { ...budget };

          bud.name = { ...bud.name, value: bud.name.value };

          return bud;
        });

        setMerged([...builtProjects, ...budgets].map((ele) => {
          if (ele.type === 'Project') {
            return { ...ele, primeiroContacto: ele.hasBudget.object.dateRequest.value, filterName: ele.name.value };
          }

          return { ...ele, primeiroContacto: ele.dateRequest?.value, filterName: ele.name.value };
          // eslint-disable-next-line consistent-return
        }).filter((item) => {
          if (item.budgetStatus?.value !== 'adjudicated' && item.status?.value !== 'canceled') return item;
        }).sort((a, b) => a.primeiroContacto - b.primeiroContacto));
      } catch (err) {
        console.log(err);
      }
    }

    Promise.all([load()]).then(() => setLoaded(true));
  }, []);

  if (loaded) {
    const breadcrumbsPath = [
      {
        title: 'Mensagens',
        href: `${routes.private.messages}`,
      },
    ];

    const props = {
      breadcrumbsPath,
      pageProps,
      // eslint-disable-next-line consistent-return
      chats: [...merged],
    };

    return <MessagesScreen {...props} />;
  }

  return <Loader center={true} />;
};

export default Messages;
