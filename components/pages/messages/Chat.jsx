/* eslint-disable react/prop-types */
//  PropTypes
import { Box, Grid } from '@mui/material';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import * as messagesActionsRedux from '../../../store/actions/message';
import Loader from '../../loader/loader';
import { Message } from './Message';

const Chat = (props) => {
  const { conversation } = props;
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();
  const getMessages = (data) => dispatch(messagesActionsRedux.conversationMessages(data));

  useEffect(() => {
    function loadMessages () {
      setLoaded(false);

      typeof conversation?.messages === 'undefined' && getMessages(props.conversation?.hasBudget?.object.id || props.conversation?.id).then((res) => {
        const chats = [...props.chats];

        const chatsMsg = chats.map((chat, index) => {
          const chat2 = { ...chat };

          if (index === props.activeRow) {
            chat2.messages = res.data.results;
          }

          return chat2;
        });

        props.setConversations(chatsMsg);
      });

      setLoaded(true);
    }

    loadMessages();
  }, [conversation]);

  return loaded
    ? (
      <Grid container pt={'1rem'} id='messagesContainer' >
        {!!conversation?.messages && conversation?.messages.sort((a, b) => moment(a.created).diff(moment(b.created))).map((conv, i) => <Message key={i} msg={conv} index={i} {...props}/>)}
      </Grid>
    )
    : <Box id='messagesContainer' display='flex' alignItems={'center'} justifyContent='center' sx={{ height: '100%' }}><Loader noPos/></Box>;
};

Chat.propTypes = {
  conversation: PropTypes.object.isRequired,
};

export default Chat;
