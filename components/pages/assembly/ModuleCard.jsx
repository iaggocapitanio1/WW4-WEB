/* eslint-disable no-constant-condition */
/* eslint-disable react/prop-types */
import { Card, CardActions, CardContent, Divider, Grid, Grow, Tooltip, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import PrimaryBtn from '../../buttons/primaryBtn';

import { CheckCircle, PlayCircle } from 'lucide-react';
import CanDo from '../../utils/CanDo';
import DisplayDateDifference from '../../utils/DisplayDateDifference';

const ModuleCard = ({ module, me, onActionClick }) => {
  function isActionDisabled (module) {
    if (module?.assemblyBy?.value) {
      return !(module?.assemblyBy.value === 'urn:ngsi-ld:Worker:' + me.id);
    }

    return false;
  }

  const [timeDiff, setTimeDiff] = useState(DisplayDateDifference(module?.startTime?.value));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeDiff(DisplayDateDifference(module?.startTime?.value));
    }, 1000);

    return () => clearInterval(interval);
  }, [module?.startTime?.value]);

  return <Grow in>
    <Card sx={{ width: '100%' }}>
      <CardContent>
        <Grid container md={12} sm={12} xs={12} sx={{ }}>
          <Grid container md={9} sm={9} xs={9} >
            <Tooltip title='Módulo'>
              <Typography fontWeight={'bold'} variant="h5">
                {module?.name.value}
              </Typography>
            </Tooltip>
          </Grid>
          <Grid container md={3} sm={3} xs={3} justifyContent={'end'} display={!module?.startTime?.value && 'none'} >
            <Tooltip title='Tempo desde início de montagem'>
              <Typography fontWeight={'bold'} variant="sm">
                {timeDiff}
              </Typography>
            </Tooltip>
          </Grid>
          <Grid container md={6} sm={6} xs={6} pb={0.5} >
            <Tooltip title='Cliente'>
              <Typography variant='subtitle1' ><a style={{ fontWeight: 'bold' }}>Cliente: </a>{module?.client?.value}</Typography>
            </Tooltip>
          </Grid>
          <Grid container md={6} sm={6} xs={6} pb={0.5} justifyContent={'end'}>
            <Tooltip title='Projeto'>
              <Typography variant='subtitle1' ><a style={{ fontWeight: 'bold' }}>Projeto: </a>{module?.project?.value}</Typography>
            </Tooltip>
          </Grid>
          <Grid container md={6} sm={6} xs={6} pb={0.5} >
            <Tooltip title='Grupo'>
              <Typography variant='subtitle1' ><a style={{ fontWeight: 'bold' }}>Grupo: </a>{module?.group?.value}</Typography>
            </Tooltip>
          </Grid>
          <Grid container md={6} sm={6} xs={6} pb={0.5} justifyContent={'end'}>
            <Tooltip title='Subgrupo'>
              <Typography variant='subtitle1' ><a style={{ fontWeight: 'bold' }}>Subgrupo: </a>{module?.subGroup?.value}</Typography>
            </Tooltip>
          </Grid>
          <Grid container md={6} sm={6} xs={6} pb={0.5} >
            <Tooltip title='Móvel'>
              <Typography variant='subtitle1' ><a style={{ fontWeight: 'bold' }}>Móvel: </a>{module?.furniture?.value}</Typography>
            </Tooltip>
          </Grid>
          <Grid container md={6} sm={6} xs={6} pb={0.5} justifyContent={'end'}>
            <Tooltip title='Quantidade'>
              <Typography variant='subtitle1' ><a style={{ fontWeight: 'bold' }}>Quantidade: </a>{module?.amount?.value}</Typography>
            </Tooltip>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
        <Grid container md={12} sm={12} xs={12} display={!CanDo('change_module') && 'none'}>
          <Grid container md={12} sm={12} xs={12}>
            <Divider sx={{ width: '100%' }} />
          </Grid>
          <Grid container md={12} sm={12} xs={12} pt={3} >
            {!module?.startTime?.value
              ? <PrimaryBtn disabled={isActionDisabled(module)} onClick={() => onActionClick(module)} text="Iniciar" color={'success'} icon={<PlayCircle strokeWidth={1.5} size={18} />} fullWidth sx={{ minHeight: '55px', with: '100%' }} />
              : <PrimaryBtn disabled={isActionDisabled(module)} onClick={() => onActionClick(module)} text="Terminar" color={'error'} icon={<CheckCircle strokeWidth={1.5} size={18} />} fullWidth sx={{ minHeight: '55px', with: '100%' }} />
            }
          </Grid>
        </Grid>
      </CardActions>
    </Card>

  </Grow>;
};

export default ModuleCard;
