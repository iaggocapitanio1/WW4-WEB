import { Card, CardContent, CardMedia, Grid, Grow, Typography } from '@mui/material';
import React from 'react';
//  PropTypes
import PropTypes from 'prop-types';

const PartCard = (props) => {
  const { part } = props;

  return (
    <Grow in={true}>
      <Card
        sx={{ width: '100%', cursor: 'pointer' }}
      >
        <CardMedia
          component="img"
          alt={part.material}
          height="140"
          image={part.image}
          loading={'lazy'}
        />
        <CardContent>
          <Grid container sx={{ width: '100%' }}>
            <Grid container md={12} sm={12} xs={12} p={1} sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h5" component="div">
                {part.material}
              </Typography>
            </Grid>
          </Grid>

          <Typography variant="body2" color="text.secondary">

          </Typography>
        </CardContent>

      </Card>
    </Grow>

  );
};

PartCard.propTypes = {
  part: PropTypes.object.isRequired,
  setChosenProject: PropTypes.func.isRequired,
};

export default PartCard;
