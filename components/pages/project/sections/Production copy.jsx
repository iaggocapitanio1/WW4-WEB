//  PropTypes
import { Box, Grid, Grow, Typography } from '@mui/material';
import { Eye } from 'lucide-react';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import PrimaryBtn from '../../../buttons/primaryBtn';
import ProjectDetails from '../../factoryGround/ProjectDetails/projectDetails';

export const CurrentOperation = ({ part }) => {
  return part.cncWorker ? 'CNC' : 'Nesting';
};

export const PartDone = ({ part }) => {
  const a = moment(part.startedAt);
  const b = moment();

  a.diff(b, 'minutes');
  a.diff(b, 'minutes');

  return a.diff(b, 'minutes') * -1 + ' min';
};

export const TimeDetour = ({ part, parts }) => {
  const a = moment(part.startedAt);
  const b = moment();
  const currentPartBuildTime = a.diff(b, 'minutes') * -1;
  const thisPartDetail = parts.find(ele => ele.name === part?.part?.productionDetail?.replace('MC_MUEBLETV_', ''));

  if (currentPartBuildTime < thisPartDetail?.buildTime) return <Typography variant='md' className="successBalloon">+{thisPartDetail?.buildTime - currentPartBuildTime} min</Typography>;
  else if (currentPartBuildTime === thisPartDetail?.buildTime) return <Typography variant='md' className="warningBalloon"> 0 min</Typography>;

  return <Typography variant='md' className="errorBalloon">-{currentPartBuildTime - thisPartDetail?.buildTime || 0} min</Typography>;
};

TimeDetour.propTypes = {
  part: PropTypes.object,
  parts: PropTypes.arrayOf(PropTypes.object)
};

export const WorkerName = ({ part, workers }) => {
  const worker = workers.find(worker => worker.id === part.workerId);

  return worker ? `${worker?.givenName?.value} ${worker?.familyName?.value}` : part.workerName;
};

const Production = (props) => {
  const { pageProps, productionDetail, open, parts } = props;
  const [productionDetailModal, setProductionDetailModal] = useState(false);
  const [activeRow, setActiveRow] = useState(false);

  const cellProps = {
    md: 1.5,
    sm: 1.5,
    xs: 1.5,
    paddingTop: '1rem',
    paddingBottom: '1rem',
    className: 'fullCenter',
    container: true,
    overflow: 'hidden',
  };

  const rowProps = {
    md: 12,
    sm: 12,
    xs: 12,
    sx: { cursor: 'pointer' },
    className: 'hoverOpacity',
    container: true
  };

  const headCells = [
    { label: 'Etiqueta' },
    { label: 'Peça' },
    { label: 'Operação' },
    { label: 'Início' },
    { label: 'Previsto' },
    { label: 'Realizado' },
    { label: 'Desvio' },
    { label: 'Responsável' },
  ];

  return open && <>
    <ProjectDetails
      {...props}
      open={productionDetailModal}
      activeRow={activeRow}
      chosenProject={props.order}
      setActiveRow={setActiveRow}
      onClose={setProductionDetailModal}
      detailOnly
      productionDetails={productionDetail}
    />
    <Grow in={open}>
      <Box>
        <Box id='pad'>
          <Box style={{ display: 'flex', marginBottom: '1rem' }}>
            <Typography variant='title'>Produção</Typography>
            <Box style={{ marginLeft: 'auto' }}>
              <PrimaryBtn
                onClick={() => setProductionDetailModal(!productionDetailModal)}
                icon={
                  <Eye
                    strokeWidth={pageProps?.globalVars?.iconStrokeWidth || 1}
                    size={pageProps?.globalVars?.iconSize || 20}
                  />
                }
                text='Ver detalhes'
              />
            </Box>
          </Box>
        </Box>
        <Box sx={{ width: '100%', overflow: 'scroll' }}>
          <Grid container sx={{ minWidth: '1024px', overflowX: 'scroll' }}>
            <Grid container md={12} sm={12} xs={12} bgcolor={'#F9F9F9'}>
              <Grid {...cellProps}><Box className='fullCenter' sx={{ width: '100%', borderRight: '1px solid', borderColor: 'divider' }}><Typography>{headCells[0].label}</Typography></Box></Grid>
              <Grid {...cellProps}><Box className='fullCenter' sx={{ width: '100%', borderRight: '1px solid', borderColor: 'divider' }}><Typography>{headCells[1].label}</Typography></Box></Grid>
              <Grid {...cellProps}><Box className='fullCenter' sx={{ width: '100%', borderRight: '1px solid', borderColor: 'divider' }}><Typography>{headCells[2].label}</Typography></Box></Grid>
              <Grid {...cellProps}><Box className='fullCenter' sx={{ width: '100%', borderRight: '1px solid', borderColor: 'divider' }}><Typography>{headCells[3].label}</Typography></Box></Grid>
              <Grid {...cellProps}><Box className='fullCenter' sx={{ width: '100%', borderRight: '1px solid', borderColor: 'divider' }}><Typography>{headCells[4].label}</Typography></Box></Grid>
              <Grid {...cellProps}><Box className='fullCenter' sx={{ width: '100%', borderRight: '1px solid', borderColor: 'divider' }}><Typography>{headCells[5].label}</Typography></Box></Grid>
              <Grid {...cellProps}><Box className='fullCenter' sx={{ width: '100%', borderRight: '1px solid', borderColor: 'divider' }}><Typography>{headCells[6].label}</Typography></Box></Grid>
              <Grid {...cellProps}><Box className='fullCenter' sx={{ width: '100%', borderRight: '0px solid', borderColor: 'divider' }}><Typography>{headCells[7].label}</Typography></Box></Grid>
            </Grid>
            <Grid container md={12} sm={12} xs={12} >
              {console.log(productionDetail)}
              {productionDetail
                .filter(ele => !ele.endedAt)
                .sort((a, b) => a.tag - b.tag)
                .map((part, rowIndex) => {
                  return (
                    <Grid
                      {...rowProps}
                      key={rowIndex}
                    >
                      <Grid {...cellProps} > <Typography variant='sm'>{part?.part?.tag }</Typography></Grid>
                      <Grid {...cellProps} > <Typography variant='sm'>{part?.part?.partName?.replace('MC_MUEBLETV_', '').replace('_', ' ') } </Typography></Grid>
                      <Grid {...cellProps} > <Typography variant='sm'> <CurrentOperation part={part} /> </Typography></Grid>
                      <Grid {...cellProps} > <Typography variant='sm'>{moment(part.startedAt).format('DD/MM/YYYY hh:mm') } </Typography></Grid>
                      <Grid {...cellProps} > <Typography variant='sm'>{parts.find(ele => ele.name === part?.part?.productionDetail?.replace('MC_MUEBLETV_', ''))?.buildTime || '0'} min</Typography></Grid>
                      <Grid {...cellProps} > <Typography variant='sm'><PartDone part={part} /></Typography></Grid>
                      <Grid {...cellProps} > <Typography variant='sm'><TimeDetour {...props} part={part} /> </Typography></Grid>
                      <Grid {...cellProps} > <Typography variant='sm'><WorkerName {...props} part={part} /> </Typography></Grid>
                      {/* <Grid {...cellProps} > <Typography variant='sm'>{part.nestWorker || part.cncWorker } </Typography></Grid> */}
                    </Grid>
                  );
                })}
            </Grid>
          </Grid>

        </Box>
      </Box>
    </Grow>

  </>;
};

Production.propTypes = {
  pageProps: PropTypes.any,
  order: PropTypes.object,
  open: PropTypes.bool,
  productionDetail: PropTypes.array,
  parts: PropTypes.arrayOf(PropTypes.object)
};

export default Production;
