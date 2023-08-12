import { Box, Card, CardContent, Grid, Grow, Typography } from '@mui/material';
import React from 'react';
//  PropTypes
import Image from 'next/image';
import PropTypes from 'prop-types';

const ProjectCard = (props) => {
  const { setChosenProject, proj } = props;

  return (
    <Grow in={true}>
      <Card
        sx={{ width: '100%', cursor: 'pointer' }}
        onClick={() => setChosenProject(proj)}
      >
        <Box className='fullCenter' sx={{ boxShadow: '0px 0px 20px 0px rgba(0, 0, 0, 0.1)' }}>
          <Image
            alt="project image"
            height={140}
            width={140}
            src="https://cdn.pixabay.com/photo/2014/12/21/23/43/table-575911_960_720.png"
          />
        </Box>
        <CardContent>
          <Grid container sx={{ width: '100%' }}>
            <Grid container md={6} sm={6} xs={6} p={1}>
              <Typography variant="h5" component="div">
                {proj?.name?.value}
              </Typography>
            </Grid>
            <Grid container md={6} sm={6} xs={6} p={1} justifyContent='end'>
              <Typography variant="md" component="div">
                <Typography className='warningBalloon'>Em produção</Typography>
              </Typography>
            </Grid>
            <Grid container md={6} sm={6} xs={6} p={1} >
              <Typography variant="md">
                Qtd: {proj?.amount?.value}
              </Typography>
            </Grid>
            <Grid container md={6} sm={6} xs={6} p={1} justifyContent='end'>
              <Typography variant="md">
                Feito: {proj?.completed?.value || 0} / {proj?.amount?.value || 0}
              </Typography></Grid>
          </Grid>
          <Typography variant="body2" color="text.secondary">
          </Typography>
        </CardContent>
      </Card>
    </Grow>

  );
};

ProjectCard.propTypes = {
  proj: PropTypes.object.isRequired,
  setChosenProject: PropTypes.func.isRequired,
};

export default ProjectCard;
