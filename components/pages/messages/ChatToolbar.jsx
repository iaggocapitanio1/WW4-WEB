import { AppBar, Box, ButtonGroup, IconButton, Toolbar, Tooltip, Typography } from '@mui/material';
import { HelpCircle, RefreshCw } from 'lucide-react';
import React from 'react';
//  PropTypes
import PropTypes from 'prop-types';

const ChatToolbar = (props) => {
  const { styles, pageProps, conversation } = props;

  return (
    <AppBar position='static' sx={styles.appBars}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* <Avatar sx={styles.avatar}>N</Avatar> */}
          <Typography variant='md'sx={{ display: !conversation && 'none' }}>
            {' '}
            {conversation?.filterName}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ButtonGroup sx={{ display: 'none' }} >
            <Tooltip title="Ajuda">
              <IconButton>
                <HelpCircle
                  strokeWidth={pageProps?.globalVars?.iconStrokeWidth || 1}
                  size={pageProps?.globalVars?.iconSize || 20}
                />
              </IconButton>
            </Tooltip>
            <Tooltip title="Atualizar">
              <IconButton>
                <RefreshCw
                  strokeWidth={pageProps?.globalVars?.iconStrokeWidth || 1}
                  size={pageProps?.globalVars?.iconSize || 20}/>
              </IconButton>
            </Tooltip>
          </ButtonGroup>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

ChatToolbar.propTypes = {
  styles: PropTypes.object,
  pageProps: PropTypes.number,
  conversation: PropTypes.number,
  isInternalPage: PropTypes.bool,
};

export default ChatToolbar;
