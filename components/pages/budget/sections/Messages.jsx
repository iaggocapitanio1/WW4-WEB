/* eslint-disable react/prop-types */
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Grid, OutlinedInput, Typography } from '@mui/material';
import { ChevronDown, Send } from 'lucide-react';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as messagesActionsRedux from '../../../../store/actions/message';
import Loader from '../../../loader/loader';
import scrollToBottom from '../../../utils/ScrollToBottom';
import { Message } from '../../messages/Message';

const Messages = (props) => {
  const { budget } = props;
  const [loaded, setLoaded] = useState(false);
  const [messages, setMessages] = useState();
  const dispatch = useDispatch();
  const getMessages = (data) => dispatch(messagesActionsRedux.conversationMessages(data));
  const [newMessageText, setNewMessageText] = useState('');
  const newMessage = (data) => dispatch(messagesActionsRedux.newMessage(data));
  const reduxState = useSelector((state) => state);
  const loggedUser = reduxState.auth.me;
  const [windowWidth, setWindowHeight] = useState();
  const [sectionExpanded, setSectionExpanded] = useState(true);

  useEffect(() => {
    function loadMessages () {
      setLoaded(false);

      !messages && getMessages(budget?.id).then((res) => {
        setMessages(res.data.results);
      });

      setLoaded(true);
    }

    loadMessages();
  }, []);

  const handleSendMessage = async (event) => {
    event.preventDefault();

    if (newMessageText === '') return;

    await newMessage({
      to: loggedUser.role === 'CUSTOMER' ? budget.approvedBy.object.replace('urn:ngsi-ld:Owner:', '').replace('urn:ngsi-ld:Worker:', '') : budget.orderBy.object.user.id,
      by: loggedUser?.id,
      project: budget?.id,
      text: newMessageText
    }).then((res) => {
      setMessages([...messages, res.data]);
      setNewMessageText('');
    }).catch((err) => console.log(err));
  };

  if (typeof window !== 'undefined') {
    useEffect(() => {
      setWindowHeight(window.innerWidth);
    }, [window.innerWidth]);
  }

  const listenToResize = () => {
    setWindowHeight(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', listenToResize);

    return () => window.removeEventListener('resize', listenToResize);
  }, []);

  useEffect(() => {
    const scroll = () => {
      scrollToBottom('messagesContainer');
    };

    scroll();
  }, [messages]);

  return <>
    <Accordion expanded={sectionExpanded} onChange={() => setSectionExpanded(!sectionExpanded)} sx={{ width: '100%' }}>
      <AccordionSummary sx={{
        background: 'lightGray.main',
        paddingLeft: '24px',
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}
      bgcolor={'lightGray.main'} aria-controls="panel1d-content" id="panel1d-header" expandIcon={<ChevronDown />}>
        <Grid container md={12} sm={12} xs={12}>
          <Grid container md={12} sm={12} xs={12}><Typography variant='title'>Mensagens</Typography></Grid>
        </Grid>
      </AccordionSummary>
      <AccordionDetails>
        <Box>
          <Box id='messagesContainer' sx={{ padding: '2rem', maxHeight: '400px', overflowY: 'scroll' }}>
            {loaded
              ? messages?.sort((a, b) => moment(a.created).diff(moment(b.created))).map((conv, i) => <Message key={i} msg={conv} index={i} {...props}/>)
              : <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Loader noPos />
              </Box>
            }
          </Box>
          <Box
            display={budget.budgetStatus.value === 'canceled' && 'none'}
            component='form'
            noValidate
            onSubmit={handleSendMessage}
            sx={{ width: '100%', paddingLeft: windowWidth > 900 && '2rem', paddingRight: windowWidth > 900 && '2rem', paddingBottom: '1rem' }}>
            <OutlinedInput
              required
              fullWidth
              placeholder='Aa'
              value={newMessageText}
              onChange={(e) => setNewMessageText(e.target.value)}
              sx={{
                maxHeight: '40px',
                padding: '0.2rem',
                fontSize: '13px',
                lineHeight: '18px',
                borderRadius: '16px',
                color: '#999999',
                width: '100%'
              }}
              endAdornment={ <Button position='end' type='submit'>
                <Send size={20}/>
              </Button>}
            />
          </Box>
        </Box>
      </AccordionDetails>
    </Accordion>

  </>;
};

Messages.propTypes = {
  pageProps: PropTypes.any,
  styles: PropTypes.any,
  stylesMessage: PropTypes.any,
};

export default Messages;
