/* eslint-disable react/prop-types */
import { Box, Button, OutlinedInput } from '@mui/material';
import React, { useState } from 'react';
//  PropTypes
import { Send } from 'lucide-react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import * as messagesActionsRedux from '../../../store/actions/message';
import CanDo from '../../utils/CanDo';

const NewMsgInput = (props) => {
  const { windowWidth, styles, setLoadMessage } = props;
  const [newMessageText, setNewMessageText] = useState('');
  const newMessage = (data) => dispatch(messagesActionsRedux.newMessage(data));
  const reduxState = useSelector((state) => state);
  const loggedUser = reduxState.auth.me;
  const dispatch = useDispatch();

  const handleSendMessage = async (event) => {
    event.preventDefault();
    setLoadMessage(new Date());

    newMessageText !== '' && props.conversation && await newMessage({
      to: (props.conversation.approvedBy?.object || props.conversation.hasBudget?.object?.approvedBy?.object).replace('urn:ngsi-ld:Owner:', '').replace('urn:ngsi-ld:Worker:', ''),
      by: loggedUser?.id,
      project: props.conversation?.hasBudget?.object.id || props.conversation?.id,
      text: newMessageText
    }).then((res) => {
      const chats = [...props.chats];

      const chatsMsg = chats.map((chat, index) => {
        const chat2 = { ...chat };

        if (index === props.activeRow) {
          chat2.messages.push(res.data);
        }

        return chat2;
      });

      setNewMessageText('');
      props.setConversations(chatsMsg);
    }).catch((err) => console.log(err));
  };

  const hasSendPerms = CanDo('add_message');

  return (
    <Box
      component='form'
      noValidate
      onSubmit={handleSendMessage}
      sx={{ width: '100%', marginLeft: windowWidth > 900 && '2rem', marginRight: windowWidth > 900 && '2rem' }}>
      {hasSendPerms && <OutlinedInput
        required
        fullWidth
        placeholder='Aa'
        autoFocus
        value={newMessageText}
        onChange={(e) => setNewMessageText(e.target.value)}
        sx={styles.writeMessageInput}
        endAdornment={ <Button position='end' type='submit'>
          <Send size={20}/>
        </Button>}
      />}
    </Box>
  );
};

NewMsgInput.propTypes = {
  windowWidth: PropTypes.number,
  styles: PropTypes.object,
  pageProps: PropTypes.object,
  setLoadMessage: PropTypes.func,
  chats: PropTypes.array,
  setConversations: PropTypes.func,
  activeRow: PropTypes.number,
};

export default NewMsgInput;
