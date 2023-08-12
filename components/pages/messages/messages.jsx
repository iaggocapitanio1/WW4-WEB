/* eslint-disable react/prop-types */
//  Nodes
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

//  Material Ui
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';

//  Custom Components
import Content from '../../content/content';
import Notification from '../../dialogs/Notification';

//  PropTypes

//  Moment (time package)
import moment from 'moment';

//  Utils
import MomentJsConfig from '../../utils/MomentJsConfig';
import scrollToBottom from '../../utils/ScrollToBottom';
//  Styles
import CustomBreadcrumbs from '../../breadcrumbs';

//  Sections Components
import { AppBar, Box } from '@mui/material';
import routes from '../../../navigation/routes';
import Footer from '../../layout/footer/footer';
import Navbar from '../../layout/navbar/navbar';
import Chat from './Chat';
import ChatToolbar from './ChatToolbar';
import ConversationsList from './Conversations';
import ConversationsToolbar from './ConversationsToolbar';
import MessagesStyles from './MessagesStyles';
import NewMsgInput from './NewMsgInput';

const Messages = (props) => {
  const { breadcrumbsPath } = props;
  const [chats, setChats] = useState(props.chats);
  const [activeRow, setActiveRow] = useState(0);
  const [loadMessage, setLoadMessage] = useState(new Date());
  const [windowWidth, setWindowHeight] = useState();
  const theme = localStorage.getItem('theme');
  const styles = MessagesStyles({ theme });
  const [conversationFilter, setConversationFilter] = useState('');
  const path = useRouter();
  const isInternalPage = Object.values(routes.private.internal).includes(path.route.replace('[Id]', ''));

  moment.locale(MomentJsConfig());

  useEffect(() => {
    const scroll = () => {
      scrollToBottom('messagesContainer');
    };

    scroll();
  }, [loadMessage]);

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

  return (
    <>
      <Navbar />
      <Grid component='main'sx={{ padding: '0rem 2rem 0rem 2rem' }} >
        <CssBaseline/>
        <Notification/>
        <CustomBreadcrumbs path={breadcrumbsPath}/>
        <Content>
          {false && <Box container sx={{ height: '70vh', display: 'flex', width: '100%' }} >
            <Box container className='conversationsBox' justifyContent='end'>
              <Grid md={12} sx={{ maxHeight: '70vh', minHeight: '70vh' }}>
                <ConversationsToolbar windowWidth={windowWidth} isInternalPage={isInternalPage} styles={styles} {...props} onSearch={setConversationFilter} />
                <Box sx={{ overflow: 'scroll', maxHeight: '50vh', minHeight: '50vh', pt: '1rem' }}>
                  <ConversationsList {...props} isInternalPage={isInternalPage} conversations={chats.filter(ele => ele.filterName.toLowerCase().toString().includes(conversationFilter.toLowerCase()))} activeRow={activeRow} onRowClick={setActiveRow} windowWidth={windowWidth}/>
                </Box>
              </Grid>
            </Box>
            <Box sx={{ width: '100%' }}>
              <Grid container md={12} className='chatBox' >
                <ChatToolbar styles={styles} conversation={chats[activeRow]} isInternalPage={isInternalPage} {...props} />
                <Grid id={'messagesContainer'} md={12} sx={{ overflow: 'scroll', maxHeight: '50vh', minHeight: '50vh', border: '5px solid red' }}>
                  <Chat {...props} chats={chats} conversation={chats[activeRow]} theme={theme} activeRow={activeRow} setConversations={setChats}/>
                </Grid>
                <Grid container md={12}>
                  <NewMsgInput {...props}
                    chats={chats}
                    conversation={chats[activeRow]}
                    setConversations={setChats}
                    setLoadMessage={setLoadMessage}
                    activeRow={activeRow}
                    styles={styles}
                  />
                </Grid>
              </Grid>
            </Box>
          </Box>}
          <Grid container style={{ height: '70vh' }}>
            <Grid item xs={3} style={{ maxHeight: '100%' }}>
              <ConversationsToolbar windowWidth={windowWidth} isInternalPage={isInternalPage} styles={styles} {...props} onSearch={setConversationFilter} />
              <Grid item xs={12} style={{ overflowY: 'scroll', maxHeight: '100%' }}>
                <Box sx={{ overflow: 'scroll', maxHeight: '50vh', minHeight: '50vh', pt: '1rem' }}>
                  <ConversationsList {...props} isInternalPage={isInternalPage} conversations={chats.filter(ele => ele.filterName.toLowerCase().toString().includes(conversationFilter.toLowerCase()))} activeRow={activeRow} onRowClick={setActiveRow} windowWidth={windowWidth}/>
                </Box>
              </Grid>
              {/* Left Side Content */}
            </Grid>
            <Grid item xs={9} container direction="column" style={{ height: '100%' }}>
              <Grid item pb={1}>
                <ChatToolbar styles={styles} conversation={chats[activeRow]} isInternalPage={isInternalPage} {...props} />
              </Grid>
              <Grid item xs style={{ overflowY: 'scroll' }}>
                {/* Main Content */}
                <Chat {...props} chats={chats} conversation={chats[activeRow]} theme={theme} activeRow={activeRow} setConversations={setChats}/>
              </Grid>
              <Grid item>
                <AppBar position="static" sx={{ background: 'transparent', border: 'none', boxShadow: 'none' }}>
                  <NewMsgInput {...props}
                    chats={chats}
                    conversation={chats[activeRow]}
                    setConversations={setChats}
                    setLoadMessage={setLoadMessage}
                    activeRow={activeRow}
                    styles={styles}
                  />
                </AppBar>
              </Grid>
            </Grid>
          </Grid>
        </Content>
      </Grid>
      <Footer />
    </>
  );
};

export default Messages;
