/* eslint-disable react/jsx-props-no-spreading */
import { AddAPhoto } from '@mui/icons-material';
import { Box, CssBaseline, Fab, Grid, Typography } from '@mui/material';
import { Check } from 'lucide-react';
import React, { useState } from 'react';
import { Camera } from 'react-camera-pro';
import CustomBreadcrumbs from '../../breadcrumbs/breadcrumbs';
import PrimaryBtn from '../../buttons/primaryBtn';
import Content from '../../content/content';
import Notification from '../../dialogs/Notification';
import MyInput from '../../inputs/myInput';
import Footer from '../../layout/footer/footer';
import Navbar from '../../layout/navbar/navbar';
import Canvas from './Canvas';

const Leftovers = (props) => {
  // eslint-disable-next-line react/prop-types
  const { breadcrumbsPath } = props;
  const [picture, setPicture] = useState();
  const camera = React.useRef(null);
  const [leftover, setLeftover] = useState();

  function onPictureTaken () {
    setLeftover({
      id: 'leftover_E4lxPye2gNoJrbnA',
      url: 'http://193.136.195.25/ww4/api/v1/storages/leftover/leftover_E4lxPye2gNoJrbnA/',
      created: '2023-05-29T04:15:27.356593Z',
      modified: '2023-05-29T04:15:27.356650Z',
      file: 'http://193.136.195.25/media/internal/leftovers/images/default/image_lTlsvAe.jpg',
      corners: {
        type: 'Polygon',
        coordinates: [
          [
            728,
            36
          ],
          [
            302,
            48
          ],
          [
            315,
            412
          ],
          [
            411,
            413
          ],
          [
            415,
            523
          ],
          [
            650,
            523
          ],
          [
            651,
            410
          ],
          [
            727,
            408
          ],
          [
            728,
            36
          ]
        ]
      },
      treated: false,
      confirmed: true,
      x: 302.0,
      y: 36.0,
      width: 426.0,
      height: 379.0,
      thickness: -1.0,
      ratio: 1.1204465,
      klass: 'Oak',
      batch: 'default',
      location_x: 0,
      location_y: 0
    });
  }

  console.log(leftover);

  async function takePicture () {
    if (camera.current) {
      const photo = await camera.current.takePhoto();

      setPicture({
        data: photo,
        takenAt: Date.now()
      });
    }
  }

  return <>
    <Navbar />
    <Grid component='main'sx={{ padding: '0rem 2rem 0rem 2rem' }} >
      <CssBaseline />
      <Notification />
      <CustomBreadcrumbs path={breadcrumbsPath} />
      <Content>
        <Grid id={'pad'} container md={12} sm={12} xs={12}>
          {/* Title */}
          <Grid container md={12} sm={12} xs={12}><Typography variant='title'>Novo Sobrante</Typography></Grid>
          {/* Content */}
          <Grid container md={12} sm={12} xs={12}>
            {/* Mapa de Pontos */}
            {leftover && <Grid container md={9} sm={9} xs={9}sx={{ overflow: 'hidden' }} >
              <Canvas leftover={leftover} />
            </Grid>}
            {picture && !leftover && <Grid container md={9} sm={9} xs={9} >
              <img src={picture?.data} style={{ width: '100%', padding: '0.5rem' }} />
            </Grid>}
            {!picture && <Grid container md={9} sm={9} xs={9} >
              <Camera
                ref={camera}
                aspectRatio={16 / 9}
                async
                errorMessages={{
                  noCameraAccessible: 'No camera device accessible. Please connect your camera or try a different browser.',
                  permissionDenied: 'Permission denied. Please refresh and give camera permission.',
                  switchCamera: 'It is not possible to switch camera to different one because there is only one video device accessible.',
                  canvas: 'Canvas is not supported.',
                }}
              />
            </Grid>}
            <Grid container md={3} sm={3} xs={3} pl={2} display={leftover && 'none'} alignItems='center' >
              {!picture
                ? <Fab
                  aria-label="like"
                  size={'big'}
                  color={'primary'}
                  onClick={() => takePicture()} >
                  <AddAPhoto color="white" />
                </Fab>
                : <Fab
                  aria-label="like"
                  size={'big'}
                  color={'primary'}
                  onClick={() => onPictureTaken()} >
                  <Check color="white" />
                </Fab>
              }
            </Grid>
            <Grid container md={3} sm={3} xs={3} pl={2} display={!leftover && 'none'} >
              <Box>
                <Grid container md={12} sm={12} xs={12} pt={3}>
                  <Grid container md={12} sm={12} xs={12}><MyInput required label={'Material'} value={leftover?.klass} /></Grid>
                </Grid>
                <Grid container md={12} sm={12} xs={12} pt={3}>
                  <Grid container md={12} sm={12} xs={12}><MyInput required type='number' label={'Largura'} value={leftover?.width} /></Grid>
                </Grid>
                <Grid container md={12} sm={12} xs={12} pt={3}>
                  <Grid container md={12} sm={12} xs={12}><MyInput required type='number' label={'Comprimento'} value={leftover?.height} /></Grid>
                </Grid>
                <Grid container md={12} sm={12} xs={12} pt={3}>
                  <Grid container md={12} sm={12} xs={12}><MyInput required type='number' label={'Espessura'} value={leftover?.thickness} /></Grid>
                </Grid>
                <Grid container md={12} sm={12} xs={12} pt={3}>
                  <PrimaryBtn text={'Guardar'} />
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Content>
    </Grid>
    <Footer />
  </>;
};

export default Leftovers;
