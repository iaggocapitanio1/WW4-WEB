/* eslint-disable react/prop-types */

import { Box, ButtonGroup, IconButton, Tooltip } from '@mui/material';
import { Edit2, Power, Trash, X } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const DisplayActionButtons = ({
  editRoute,
  Router,
  row,
  onReactivation,
  onReactivationClick,
  onCancel,
  onDelete,
  onDeleteClick,
}) => {
  const status = row.status?.value || row.budgetStatus?.value;
  const isCancelled = status === 'canceled';
  const isFinished = status === 'finished';
  const editPath = editRoute + (Router.route.includes('projects') ? row.id.replace(/Project/g, 'Budget') : row.id);

  return (
    <ButtonGroup>
      {editRoute && (
        <Tooltip title={'Editar'}>
          <Box style={{ color: 'red' }} display={isCancelled && 'none'}>
            <Link href={editPath}>
              <IconButton color='primary' onClick={() => Router.push(editPath) } >
                <Edit2 size={20} strokeWidth={1.5} />
              </IconButton>
            </Link>
          </Box>
        </Tooltip>
      )}
      {!!onReactivation && false && isCancelled && (
        <Tooltip title={'Reabrir'}>
          <IconButton color={'warning'} onClick={() => onReactivationClick(row)} size="small">
            <Power size={20} strokeWidth={1.5} />
          </IconButton>
        </Tooltip>
      )}
      {!!onCancel && !isCancelled && !isFinished && (
        <Tooltip title={'Cancelar projeto'}>
          <IconButton color={'warning'} onClick={() => onCancel(row)} size="small">
            <X size={20} strokeWidth={1.5} />
          </IconButton>
        </Tooltip>
      )}
      {!!onDelete && (
        <Tooltip title={'Apagar'} >
          <IconButton color={'error'} onClick={() => onDeleteClick(row)} size="small">
            <Trash size={20} strokeWidth={1.5} />
          </IconButton>
        </Tooltip>
      )}
    </ButtonGroup>
  );
};

export default DisplayActionButtons;
