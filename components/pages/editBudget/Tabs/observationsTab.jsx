import { Accordion, AccordionDetails, AccordionSummary, Grid, Typography } from '@mui/material';
import { ChevronDown } from 'lucide-react';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import styles from '../../../../styles/NewOrder.module.css';
import MyInput from '../../../inputs/myInput';

const ObservationsTab = (props) => {
  const { budgetData, onBudgetChange } = props;
  const [expanded, setExpanded] = useState(true);

  return <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)} sx={{ width: '100%' }}>
    <AccordionSummary sx={{ background: 'lightGray.main' }} bgcolor={'lightGray.main'} aria-controls="panel1d-content" id="panel1d-header" expandIcon={<ChevronDown />}>
      <Typography variant='title'> Observações</Typography>
    </AccordionSummary>
    <AccordionDetails>
      <Grid id='pad' className={styles.clientContainer}>
        <Grid container md={12} sm={12} xs={12}>
          <MyInput
            className={styles.textarea}
            type={budgetData.obs.type}
            rows={10}
            label='Observações'
            placeholder={'...'}
            name='obs'
            value={budgetData.obs.value}
            onChange={(e) => onBudgetChange(e.target)}
          />
        </Grid>
      </Grid>
    </AccordionDetails>
  </Accordion>;
};

ObservationsTab.propTypes = {
  budgetData: PropTypes.any,
  onBudgetChange: PropTypes.any,
};

export default ObservationsTab;
