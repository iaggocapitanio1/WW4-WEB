/* eslint-disable no-constant-condition */
/* eslint-disable react/prop-types */
import { Accordion, AccordionDetails, AccordionSummary, Box, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import React, { useRef, useState } from 'react';

import html2canvas from 'html2canvas';
import { ChevronDown, ChevronUp, QrCode } from 'lucide-react';
import Router from 'next/router';
import { QRCodeCanvas } from 'qrcode.react';
import { useSelector } from 'react-redux';
import routes from '../../../navigation/routes';
import CustomBreadcrumbs from '../../breadcrumbs';
import PrimaryBtn from '../../buttons/primaryBtn';
import Content from '../../content/content';
import Notification from '../../dialogs/Notification';
import Footer from '../../layout/footer/footer';
import Navbar from '../../layout/navbar/navbar';
import CanDo from '../../utils/CanDo';

const ProjectPackages = (props) => {
  const { breadcrumbsPath, project } = props;
  const qrCodeRef = useRef(null);
  const reduxState = useSelector((state) => state);

  const cellProps = {
    sm: 12 / 7,
    md: 12 / 7,
    xs: 12 / 7,
    container: true,
    alignItems: 'center',
    p: 2,
  };

  const cellPropsRow = {
    sm: 12 / 7,
    md: 12 / 7,
    xs: 12 / 7,
    container: true,
    alignItems: 'center',
    pl: 2,
    pr: 2,
    sx: {
      height: 'fit-content',
    }
  };

  const cellPropsContent = {
    sm: 12 / 6,
    md: 12 / 6,
    xs: 12 / 6,
    container: true,
    alignItems: 'center',
    p: 2,
  };

  const toggleValueInArray = (value, array) => {
    const index = array.indexOf(value);

    if (index === -1) {
      return [...array, value];
    }

    return [...array.slice(0, index), ...array.slice(index + 1)];
  };

  const [expandedGroups, setExpandedGroups] = useState([]);

  const handleChange = (expandedGroups, setExpandedGroups) => (panel) => {
    setExpandedGroups((prevExpandedGroups) =>
      toggleValueInArray(panel, prevExpandedGroups)
    );
  };

  const handlePanelChange = handleChange(expandedGroups, setExpandedGroups);

  const packages = [
    {
      id: '1',
      items: [
        {
          id: 'aa',
          name: { value: 'tampo cima' },
          type: { value: 'part' },
          group: { value: 'Apartamento C2' },
          subGroup: { value: 'Sala' },
          furniture: { value: 'movel TV' },
          amount: { value: '1' },
        },
        {
          id: 'aa',
          name: { value: 'tampo baixo' },
          type: { value: 'part' },
          group: { value: 'Apartamento C2' },
          subGroup: { value: 'Sala' },
          furniture: { value: 'movel TV' },
          amount: { value: '1' },
        },
        {
          id: 'aa',
          name: { value: 'tampo traseiro' },
          type: { value: 'part' },
          group: { value: 'Apartamento C2' },
          subGroup: { value: 'Sala' },
          furniture: { value: 'movel TV' },
          amount: { value: '1' },
        },
        {
          id: 'aa',
          name: { value: 'tampo lateral esq' },
          type: { value: 'part' },
          group: { value: 'Apartamento C2' },
          subGroup: { value: 'Sala' },
          furniture: { value: 'movel TV' },
          amount: { value: '1' },
        },
      ]
    },
    {
      id: '2'
    },
  ];

  const client = project.client.user;
  const address = project.budget.deliveryAddress.value;

  const qrcode = (
    <QRCodeCanvas
      id="qrCode"
      value={`
Cliente: ${client.first_name} ${client.last_name}
Projeto: ${project.name.value}
Morada: ${address.streetAddress} ${address.postalCode} ${address.addressLocality} ${address.addressRegion} ${reduxState?.countries?.data?.find(ele => ele.cca2 === address.addressCountry).name.common}
Peso Embalagem: ${
  // ItemsWeight()
    0
    }
      
Conteudo:
`}
      size={300}
      // level={'H'}
    />
  );

  function DownloadQrCode (e) {
    e.stopPropagation();

    html2canvas(qrCodeRef.current).then((canvas) => {
      const link = document.createElement('a');

      link.download = 'qrcode.png';
      link.href = canvas.toDataURL();
      link.click();
    });
  }

  return <>
    <Box display='all' sx={{ position: 'absolute', right: '100%' }}>
      <div className="qrcode__container">
        <div ref={qrCodeRef} style={{ width: 'fit-content', height: 'fit-content' }}>{qrcode}</div>
      </div>
    </Box>
    <Navbar />
    <Grid component='main' sx={{ padding: '0rem 2rem 4rem 2rem' }}>
      <CustomBreadcrumbs path={breadcrumbsPath} />
      <Notification />
      <Content>
        <Box id='pad' className='flex' style={{ alignItems: 'center' }}>
          <Box style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <Typography variant='title' >{breadcrumbsPath[1].title}</Typography>
            <PrimaryBtn hidden={!CanDo('create_package')} text='Adicionar' onClick={() => Router.push(routes.private.internal.newPackage + project.id)} />
          </Box>
        </Box>
        <Grid container >
          <Grid container md={12} sm={12} xs={12} >
            <Grid container md={12} sm={12} xs={12} bgcolor={'primary.main'} color='white'>
              <Grid {...cellProps} >Número</Grid>
              <Grid {...cellProps} >Quantidade Peças</Grid>
              <Grid {...cellProps} >Peso</Grid>
              <Grid {...cellProps} >Embalado a</Grid>
              <Grid {...cellProps} >Embalado por</Grid>
              <Grid {...cellProps} >QrCode</Grid>
              <Grid {...cellProps} justifyContent={'center'}>Conteúdo</Grid>
            </Grid>
            {packages.map((pack, index) => {
              return <>
                <Accordion
                  expanded={expandedGroups.includes(pack?.id)}
                  onChange={() => handlePanelChange(pack?.id)}
                  sx={{ width: '100%' }}>
                  <AccordionSummary sx={{ padding: 0, height: '20px' }} aria-controls="panel1d-content" id="panel1d-header"
                    bgcolor={index % 2 !== 0 && 'lightGray.edges'}
                  >
                    <Grid container md={12} sm={12} xs={12} alignItems={'center'}>
                      <Grid {...cellPropsRow} >{index + 1}</Grid>
                      <Grid {...cellPropsRow} >Qtd.</Grid>
                      <Grid {...cellPropsRow} >Peso</Grid>
                      <Grid {...cellPropsRow} >Embalado a</Grid>
                      <Grid {...cellPropsRow} >Embalado por</Grid>
                      <Grid {...cellPropsRow} >
                        <Tooltip title='Descarregar'>
                          <IconButton onClick={(e) => DownloadQrCode(e)}>
                            <QrCode />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                      <Grid {...cellPropsRow} onClick={() => {}} sx={{ cursor: 'pointer' }} justifyContent={'center'}>
                        <Tooltip title={expandedGroups.includes(pack?.id) ? 'Fechar Conteúdo' : 'Mostrar Conteúdo'}>
                          <IconButton> {expandedGroups.includes(pack?.id) ? <ChevronUp /> : <ChevronDown /> } </IconButton>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container md={12} sm={12} xs={12} sx={{ borderBottom: '1px solid', borderTop: '1px solid', borderColor: 'divider' }} >
                      {/* <Grid {...cellProps} ><Box sx={{ borderRight: '1px solid', borderColor: 'divider', width: '100%' }}> <Typography color='primary' fontWeight={'bold'} variant='subtitle2'>Cliente</Typography> </Box></Grid> */}
                      {/* <Grid {...cellProps} ><Box sx={{ borderRight: '1px solid', borderColor: 'divider', width: '100%' }}> <Typography color='primary' fontWeight={'bold'} variant='subtitle2'>Projeto</Typography> </Box></Grid> */}
                      <Grid {...cellPropsContent} ><Box sx={{ borderRight: '1px solid', borderColor: 'divider', width: '100%' }}> <Typography color='primary' fontWeight={'bold'} variant='subtitle2'>Nome</Typography> </Box></Grid>
                      <Grid {...cellPropsContent} ><Box sx={{ borderRight: '1px solid', borderColor: 'divider', width: '100%' }}> <Typography color='primary' fontWeight={'bold'} variant='subtitle2'>Tipo</Typography> </Box></Grid>
                      <Grid {...cellPropsContent} ><Box sx={{ borderRight: '1px solid', borderColor: 'divider', width: '100%' }}> <Typography color='primary' fontWeight={'bold'} variant='subtitle2'>Grupo</Typography> </Box></Grid>
                      <Grid {...cellPropsContent} ><Box sx={{ borderRight: '1px solid', borderColor: 'divider', width: '100%' }}> <Typography color='primary' fontWeight={'bold'} variant='subtitle2'>SubGrupo</Typography> </Box></Grid>
                      <Grid {...cellPropsContent} ><Box sx={{ borderRight: '1px solid', borderColor: 'divider', width: '100%' }}> <Typography color='primary' fontWeight={'bold'} variant='subtitle2'>Movel</Typography> </Box></Grid>
                      <Grid {...cellPropsContent} ><Box sx={{ borderRight: '0px solid', borderColor: 'divider', width: '100%' }}> <Typography color='primary' fontWeight={'bold'} variant='subtitle2'>Quantidade</Typography> </Box></Grid>
                    </Grid>
                    {pack?.items?.map((furni, index) => {
                      return <Grid key={furni.id} container md={12} sm={12} xs={12} bgcolor={index % 2 !== 0 && 'lightGray.edges'}>
                        <Grid {...cellPropsContent}><Typography variant='sm'>{furni.name.value}</Typography></Grid>
                        <Grid {...cellPropsContent}><Typography variant='sm'>{furni.type.value}</Typography></Grid>
                        <Grid {...cellPropsContent}><Typography variant='sm'>{furni.group.value}</Typography></Grid>
                        <Grid {...cellPropsContent}><Typography variant='sm'>{furni.subGroup.value}</Typography></Grid>
                        <Grid {...cellPropsContent}><Typography variant='sm'>{furni.furniture.value}</Typography></Grid>
                        <Grid {...cellPropsContent}><Typography variant='sm'>{furni.amount.value}</Typography></Grid>
                      </Grid>;
                    })}
                  </AccordionDetails>
                </Accordion>
              </>;
            })}
          </Grid>
        </Grid>
      </Content>

    </Grid>
    <Footer/>

  </>;
};

export default ProjectPackages;
