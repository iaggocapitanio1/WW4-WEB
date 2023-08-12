/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import { Box, Divider, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import React from 'react';

//  PropTypes
//  Page Component Styles

//  Actions
import { Trash } from 'lucide-react';
import FormGenerator from '../../../../formGenerator';
// import CurrencyInput from '../../../inputs/CurrencyInput';

const Form = (props) => {
  function onChange (index, e) {
    props.onChange({
      subGroupIndex: props.subGroupIndex,
      groupIndex: props.groupIndex,
      itemIndex: props.itemIndex,
      newValue: e.target.value,
      property: e.target.name
    });
  }

  function removeThisRow () {
    props.onRemove({
      subGroupIndex: props.subGroupIndex,
      groupIndex: props.groupIndex,
      itemIndex: props.itemIndex
    });
  }

  return <Grid container>
    {props.index !== 0 && <Box p={4} sx={{ width: '100%' }} ><Divider sx={{ width: '100%', backgroundColor: props.errors.find(ele => ele) ? '#d32f2f' : 'primary.main' }} /></Box>}
    <Typography variant='subtitle1' pl={1}> {props.field.furnitureType.value === 'furniture' ? 'Móvel' : 'Acessório'}</Typography>
    <Box sx={{ marginLeft: 'auto', alignSelf: 'center', display: props.lines[props.lineIndex]?.items?.length === 1 && 'none' }}>
      <Tooltip title='Remover esta linha'>
        <IconButton onClick={() => removeThisRow()} >
          <Trash color='red' size={20} strokeWidth={1.5} />
        </IconButton>
      </Tooltip>
    </Box>
    <FormGenerator
      perRow={4}
      fields={Object.keys(props.field).map((key) => {
        return props.field[key];
      }).sort((a, b) => a.displayOrder - b.displayOrder)}
      onFormChange={onChange}
    />

  </Grid>;
};

export default Form;
