import React from 'react';

//  PropTypes
import PropTypes from 'prop-types';

//  Material Ui
import {
  Box,
  Skeleton,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography
} from '@mui/material';

//  Icons

//  Utlis

//  Dialogs

//  Navigation

//  Utils

function EnhancedTableHead (props) {
  const { order, orderBy, onRequestSort, headCellsUpper, state } = props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      {headCellsUpper?.map((headCell) => (
        <TableCell
          colSpan={headCell.span}
          key={headCell.id}
          align={headCell.numeric ? 'right' : 'left'}
          padding={headCell.disablePadding ? 'none' : 'normal'}
          sortDirection={orderBy === headCell.id ? order : false}
          color={'palette.background.default'}
          sx={{
            backgroundColor: 'primary.main',
            color: 'white',
            borderRight: headCell.borderRight
              ? '1px solid var(--grayEdges)'
              : null,
            borderLeft: headCell.borderLeft
              ? '1px solid var(--grayEdges)'
              : null,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {state.loaded
              ? <>
                {headCell.label}
                {orderBy === headCell.id ? <Box component='span'></Box> : null}
              </>
              : <Skeleton animation="wave" width='100%' />
            }
          </div>
        </TableCell>
      )
      )}
      <TableRow sx={{ backgroundColor: 'primary.main' }} >
        {state.cellsFilter.map((headCell) => {
          return headCell.show && <TableCell
            key={headCell.label}
            colSpan={headCell.span}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            width={headCell.width && `${headCell.width}%`}
            sx={{
              borderRight: headCell.borderRight && '1px solid var(--grayEdges)',
              borderLeft: headCell.borderLeft && '1px solid var(--grayEdges)',
            }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
              sx={{
                width: '100%',
                height: '100%',
                color: 'white !important',
                '& .MuiTableSortLabel-icon': {
                  color: 'white !important',
                },
              }}
            >
              {state.loaded
                ? <Typography variant='subtitle2'> {headCell.label} </Typography>
                : <Skeleton animation="wave" width='100%' />
              }
            </TableSortLabel>
          </TableCell>;
        })}
      </TableRow>
    </TableHead >
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number,
  onRequestSort: PropTypes.func,
  order: PropTypes.oneOf(['asc', 'desc']),
  orderBy: PropTypes.string,
  state: PropTypes.object,
  rowCount: PropTypes.number,
  headCellsUpper: PropTypes.array,
};

export default EnhancedTableHead;
