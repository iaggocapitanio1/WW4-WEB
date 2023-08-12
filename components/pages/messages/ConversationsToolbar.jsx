import { AppBar, ButtonGroup, IconButton, InputAdornment, Menu, MenuItem, OutlinedInput, Toolbar, Tooltip, Typography } from '@mui/material';
import { Edit, HelpCircle, MoreHorizontal, Plus, Search, Settings } from 'lucide-react';
import React, { useState } from 'react';
//  PropTypes
import PropTypes from 'prop-types';

const ConversationsToolbar = (props) => {
  const { windowWidth, styles, pageProps, onSearch, isInternalPage } = props;
  const [anchorEl, setAnchorEl] = useState(null);

  return (
    <AppBar position='static' sx={styles.appBars} >
      <Toolbar sx={{ padding: '.5rem !important' }}>
        <Typography pl={1} variant='title'> {isInternalPage ? 'Projetos' : 'Projetos' }</Typography>

      </Toolbar>
      <Toolbar sx={{ padding: '.5rem !important' }}>
        {windowWidth > 1 && <OutlinedInput
          required
          fullWidth
          placeholder='Pesquisa'
          sx={styles.writeMessageInput}
          onChange={(e) => onSearch(e.target.value)}
          endAdornment={
            <InputAdornment position={'start'}>
              <Search/>
            </InputAdornment>
          }
        />}
        <ButtonGroup sx={{ display: 'none' }}>
          {windowWidth > 1 &&
              <Tooltip title='Nova Conversa'>
                <IconButton>
                  <Plus
                    strokeWidth={pageProps?.globalVars?.iconStrokeWidth || 1}
                    size={pageProps?.globalVars?.iconSize || 20}
                  />
                </IconButton>
              </Tooltip>
          }
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
            <MoreHorizontal/>
          </IconButton>
        </ButtonGroup>
        <Menu
          anchorEl={anchorEl}
          open={anchorEl}
          onClose={() => setAnchorEl(null)}
        >
          {windowWidth < 900 && <MenuItem onClose={() => setAnchorEl(null)} onClick={() => setAnchorEl(null)}><Edit strokeWidth={pageProps?.globalVars?.iconStrokeWidth || 1}
            size={pageProps?.globalVars?.iconSize || 20}/>Nova conversa</MenuItem>}
          <MenuItem onClose={() => setAnchorEl(null)} onClick={() => setAnchorEl(null)}><HelpCircle strokeWidth={pageProps?.globalVars?.iconStrokeWidth || 1}
            size={pageProps?.globalVars?.iconSize || 20}/>Ajuda</MenuItem>
          <MenuItem onClose={() => setAnchorEl(null)} onClick={() => setAnchorEl(null)}><Settings strokeWidth={pageProps?.globalVars?.iconStrokeWidth || 1}
            size={pageProps?.globalVars?.iconSize || 20}/>Preferencias</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

ConversationsToolbar.propTypes = {
  pageProps: PropTypes.object,
  windowWidth: PropTypes.number,
  styles: PropTypes.object,
  onSearch: PropTypes.func,
  isInternalPage: PropTypes.bool,
};

export default ConversationsToolbar;
