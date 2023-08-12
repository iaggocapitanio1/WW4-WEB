/* eslint-disable array-callback-return */
//  Nodes
import React, { useEffect, useState } from 'react';

//  Preloader
import Loader from '../../components/loader/loader';
import MessagesScreen from '../../components/pages/messages/messages';

import PropTypes from 'prop-types';
import routes from '../../navigation/routes';
//  Page Component

//  Data services
import * as budgetsActionsRedux from '../../store/actions/budget';
import * as projectsActionsRedux from '../../store/actions/project';

import { useDispatch } from 'react-redux';

const Messages = ({ ...pageProps }) => {
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();
  const [merged, setMerged] = useState();
  const getProjects = (data) => dispatch(projectsActionsRedux.activeProjects(data));
  const getBudgets = (data) => dispatch(budgetsActionsRedux.activebudgets(data));
  const getBudget = (data) => dispatch(budgetsActionsRedux.budget(data));

  useEffect(() => {
    async function load () {
      const projects = await getProjects();

      projects.data.map(async (project) => {
        const proj = { ...project };

        await getBudget(project.hasBudget.object).then((res) => {
          proj.hasBudget = res.data;
          proj.name = { value: res.data.name.value };
        });
      });

      const budgetsRes = await getBudgets();

      const budgets = budgetsRes.data.map((budget) => {
        const bud = { ...budget };

        bud.name = { ...bud.name, value: bud.name.value };

        return bud;
      });

      setMerged([...projects.data, ...budgets]);
    }

    Promise.all([load()]).then(() => setLoaded(true));
  }, []);

  if (loaded) {
    const conversations = [
      {
        id: 1,
        users: ['cl16o9cag0000x3tqp8lbslcr', '123'],
        orderId: 12312,
        messages: [1234, 123, 12345],
        messagesContent: [],
        message: '',
        createdAt: '',
      },
      {
        id: 1,
        users: ['cl16o9cag0000x3tqp8lbslcr', '123'],
        orderId: 456,
        messages: [1234],
        messagesContent: [],
        message: '',
        createdAt: '',
      },
    ];

    const messagsContents = [
      {
        id: 1234,
        sentBy: '123',
        content: 'Hi, i would like to know the Eta of my order please? Thank you',
        createdAt: '2022-10-21T10:30:56+01:00',
        type: 'text'
      },
      {
        id: 123,
        sentBy: 'cl16o9cag0000x3tqp8lbslcr',
        content: 'Hi, the expected time of arrivel for your order is within 1 week, thank you',
        createdAt: '2022-10-21T12:30:56+01:00',
        type: 'text'
      },
      {
        id: 12345,
        sentBy: '123',
        content: 'Ok thank you',
        createdAt: '2022-10-21T12:30:56+01:00',
        type: 'text'
      },
    ];

    conversations.forEach((conversation, i) => {
      conversation.messages.forEach((message) => {
        const messageContent = messagsContents.find((element) => element.id === message);

        conversations[i].messagesContent.push(messageContent);
      });

      conversation.message =
        conversation.messagesContent[
          conversation.messagesContent.length - 1
        ].content;

      conversation.createdAt =
        conversation.messagesContent[
          conversation.messagesContent.length - 1
        ].createdAt;
    });

    const breadcrumbsPath = [
      {
        title: 'Mensagens',
        href: `${routes.private.messages}`,
      },
    ];

    const props = {
      breadcrumbsPath,
      conversations,
      pageProps,
      chats: [...merged].map((item) => {
        const item2 = { ...item };

        item2.filterName = item.name.value.replace(/_/g, ' ');

        return item2;
      }),
    };

    return <MessagesScreen {...props} />;
  }

  return <Loader center={true} />;
};

Messages.propTypes = {
  dummy: PropTypes.array,
  breadcrumbsPath: PropTypes.array,
  conversations: PropTypes.array,
  pageProps: PropTypes.any,

};

export default Messages;
