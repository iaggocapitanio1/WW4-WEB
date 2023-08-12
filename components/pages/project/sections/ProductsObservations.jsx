/* eslint-disable react/prop-types */
import { Accordion, AccordionDetails, AccordionSummary, Grid, Typography } from '@mui/material';
import { ChevronDown } from 'lucide-react';
import React, { useState } from 'react';
import ConvertString from '../../../utils/ConvertString';

const ProductsObservations = (props) => {
  const [sectionExpanded, setSectionExpanded] = useState(false);

  return <>
    <Accordion expanded={sectionExpanded} onChange={() => setSectionExpanded(!sectionExpanded)} sx={{ width: '100%' }}>
      <AccordionSummary sx={{
        background: 'lightGray.main',
        paddingLeft: '24px',
        borderBottom: '1px solid',
        borderColor: 'divider'
      }} bgcolor={'lightGray.main'} aria-controls="panel1d-content" id="panel1d-header" expandIcon={<ChevronDown />}>
        <Grid container md={12} sm={12} xs={12}>
          <Grid container md={12} sm={12} xs={12}><Typography variant='title'>Observações</Typography></Grid>
          {/* <Grid container md={12} sm={12} xs={12}><Typography variant='subtitle2'>Observações do projeto</Typography></Grid> */}
        </Grid>
      </AccordionSummary>
      <AccordionDetails>
        <Grid id='pad' container>
          <Grid container md={12} sm={12} xs={12} p={1} sx={{ whiteSpace: 'pre-wrap' }}>
            <Typography variant='subtitle2'>{ConvertString(props.order.hasBudget.object.obs?.value || props.order.hasBudget.object.observation?.value)}</Typography>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  </>;
};

export default ProductsObservations;
