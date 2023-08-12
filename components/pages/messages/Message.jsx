//  PropTypes
import { Grid, Tooltip, Typography } from '@mui/material';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import MessagesStyles from './MessagesStyles';

export const Message = (props) => {
  const { msg } = props;
  const reduxState = useSelector((state) => state);
  const loggedUser = reduxState.auth.me;
  let sender;

  if (!props.isInternalPage) sender = loggedUser?.id === msg?.by;
  else sender = props.budget.orderBy.object.user.id !== msg?.by;

  const styles = MessagesStyles({ theme: 'light', sender });

  return (
    <Grid sx={styles.chatContainer} container md={12}>
      <Grid container md={12} sm={12} sx={styles.messageContainer}>
        <Tooltip title={moment(msg.created).format('DD [de] MMMM [de] YYYY, [às] h:mm a')}>
          <Grid container md={6} sm={12} sx={styles.messageBox}>
            {sender &&
               <Grid container item md={10} sm={10} xs={10} >
                 <Typography variant='xs' sx={{ marginLeft: 'auto' }}>{moment(msg.created).format('DD/MM/yyyy HH:mm ')}</Typography>
                 <Typography variant='md' sx={styles.message}> {msg.text} </Typography>
               </Grid>
            }
            {!sender &&
            <>
              <Grid container item md={10} sm={10} xs={10} >
                <Typography variant='xs' pl={2}>{moment(msg.created).format('DD/MM/yyyy HH:mm ')}</Typography>
                <Typography variant='md' sx={styles.message}> {msg.text} </Typography>
              </Grid>
            </>
            }
          </Grid>
        </Tooltip>
      </Grid>
    </Grid>
  );
};

Message.propTypes = {
  msg: PropTypes.any,
  isInternalPage: PropTypes.bool,
  theme: PropTypes.string,
  index: PropTypes.number,
  conversation: PropTypes.object,
  budget: PropTypes.object,
};
