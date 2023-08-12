/* eslint-disable array-callback-return */
/* eslint-disable react/prop-types */
import { UnfoldLessOutlined, UnfoldMoreOutlined } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Box, ButtonGroup, Divider, Grid, Grow, Typography } from '@mui/material';
import { ChevronDown } from 'lucide-react';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import PrimaryBtn from '../../../buttons/primaryBtn';

const Products2 = (props) => {
  const { furnitures } = props;
  const [expandedGroups, setExpandedGroups] = useState([]);
  const reduxState = useSelector((state) => state);
  const theme = reduxState.appStates.theme;
  const [sectionExpanded, setSectionExpanded] = useState(false);

  const toggleValueInArray = (value, array) => {
    const index = array.indexOf(value);

    if (index === -1) {
      return [...array, value];
    }

    return [...array.slice(0, index), ...array.slice(index + 1)];
  };

  const handleChange = (expandedGroups, setExpandedGroups) => (panel) => {
    setExpandedGroups((prevExpandedGroups) =>
      toggleValueInArray(panel, prevExpandedGroups)
    );
  };

  const handlePanelChange = handleChange(expandedGroups, setExpandedGroups);

  function collapseAll () {
    setExpandedGroups([]);
  }

  function expandAll () {
    const ids = [];

    furnitures.map((x) => {
      ids.push(x.id);

      x.subgroups.map((subgroup) => {
        ids.push(subgroup.id);

        subgroup.items.map((item) => {
          ids.push(item.id);
        });
      });
    });

    setExpandedGroups(ids);
  }

  function collapseAllSubgroups (groupIndex) {
    const updatedItems = expandedGroups.filter(item => !furnitures[groupIndex].subgroups.map((x) => x.id).includes(item));

    // set the updated array as the new state
    setExpandedGroups(updatedItems);
  }

  function expandAllSubgroups (groupIndex) {
    // create a copy of the existing array
    const updatedArray = [...expandedGroups];

    // iterate over each element of the new array
    furnitures[groupIndex].subgroups.map((x) => x.id).forEach((item) => {
      // check if the element already exists in the existing array
      if (!updatedArray.includes(item)) {
        // if it doesn't exist, add it to the updated array
        updatedArray.push(item);
      }
    });

    // set the updated array as the new state
    setExpandedGroups(updatedArray);
  }

  return <>
    <Accordion expanded={sectionExpanded} onChange={() => setSectionExpanded(!sectionExpanded)} sx={{ width: '100%' }}>
      <AccordionSummary sx={{
        background: 'lightGray.main',
        paddingLeft: '24px',
        borderBottom: '1px solid',
        borderColor: 'divider'
      }} bgcolor={'lightGray.main'} aria-controls="panel1d-content" id="panel1d-header" expandIcon={<ChevronDown />}>
        <Grid container md={12} sm={12} xs={12}>
          <Grid container md={12} sm={12} xs={12}><Typography variant='title'>Produtos</Typography></Grid>
          {/* <Grid container md={12} sm={12} xs={12}><Typography variant='subtitle2'>Lista de produtos do projeto</Typography></Grid> */}
        </Grid>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container>
          <Grid container md={12} sm={12} xs={12} justifyContent={'end'}>
            <ButtonGroup sx={{ display: { md: 'flex', sm: 'flex', xs: 'none' } }} >
              <PrimaryBtn onClick={() => expandAll()} light icon={<UnfoldMoreOutlined />} text={'Abrir tudo'} />
              <PrimaryBtn onClick={() => collapseAll()} light icon={<UnfoldLessOutlined />} text={'Fechar tudo'} />
            </ButtonGroup>
            <ButtonGroup sx={{ display: { md: 'none', sm: 'none', xs: 'flex' }, width: '100%' }} >
              <PrimaryBtn fullWidth onClick={() => expandAll()} light icon={<UnfoldMoreOutlined />} text={'Abrir tudo'} />
              <PrimaryBtn fullWidth onClick={() => collapseAll()} light icon={<UnfoldLessOutlined />} text={'Fechar tudo'} />
            </ButtonGroup>
          </Grid>
          <Grid container md={12} sm={12} xs={12}>
            {/* Lines */}
            {furnitures.map((group, groupIndex) => {
              return <Grow key={groupIndex} in={true}>
                <Accordion
                  expanded={expandedGroups.includes(group.id)}
                  onChange={() => handlePanelChange(group.id)}
                  sx={{ width: '100%' }}>
                  <AccordionSummary aria-controls="panel1d-content" id="panel1d-header" expandIcon={<ChevronDown />}>
                    <Typography variant='subtitle1' color={'lightTextSm.main'}>{'Grupo - '}</Typography>
                    <Typography variant='subtitle1' color='primary'>{group.name.value}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box display='flex' justifyContent={'end'}>
                      <ButtonGroup sx={{ display: { md: 'flex', sm: 'flex', xs: 'none' } }} >
                        <PrimaryBtn onClick={() => expandAllSubgroups(groupIndex)} light icon={<UnfoldMoreOutlined />} text={'Abrir subgrupos'} />
                        <PrimaryBtn onClick={() => collapseAllSubgroups(groupIndex)} light icon={<UnfoldLessOutlined />} text={'Fechar subgrupos'} />
                      </ButtonGroup>
                      <ButtonGroup orientation='vertical' sx={{ display: { md: 'none', sm: 'none', xs: 'flex' }, width: '100%' }} >
                        <PrimaryBtn onClick={() => expandAllSubgroups(groupIndex)} light icon={<UnfoldMoreOutlined />} text={'Abrir subgrupos'} />
                        <PrimaryBtn onClick={() => collapseAllSubgroups(groupIndex)} light icon={<UnfoldLessOutlined />} text={'Fechar subgrupos'} />
                      </ButtonGroup>
                    </Box>
                    {group.subgroups?.map((subgroup) => {
                      return <Grow in key={subgroup.id}>
                        <Accordion expanded={expandedGroups.includes(subgroup.id)} onChange={() => handlePanelChange(subgroup.id)} sx={{ width: '100%' }}>
                          <AccordionSummary aria-controls="panel1d-content" id="panel1d-header" expandIcon={<ChevronDown />} sx={{ background: theme?.palette.lightGray.edges, borderBottom: expandedGroups.includes(subgroup.id) && '0px solid', borderColor: expandedGroups.includes(subgroup.id) && 'divider' }}>
                            <Grid container alignItems={'center'}>
                              <Typography variant='subtitle1'color={'lightTextSm.main'} >{'Subgrupo - '}</Typography>
                              <Typography variant='subtitle1' >{subgroup.name.value}</Typography>
                            </Grid>
                          </AccordionSummary>
                          <AccordionDetails>
                            {/* Linhas de moveis/furniture */}
                            {subgroup.items.map((item, itemIndex) => {
                              return <Grow key={itemIndex}in={true}>
                                <Grid container>
                                  {itemIndex !== 0 && <Box p={4} sx={{ width: '100%' }} >
                                    <Divider sx={{ width: '100%', backgroundColor: 'primary.main' }} />
                                  </Box>}
                                  <Grid container md={12} sm={12} xs={12}>
                                    <Typography variant='subtitle2'color={'lightTextSm.main'} >{item.furnitureType.value === 'furniture' ? 'Móvel' : 'Acessório'} - </Typography>
                                    <Typography variant='subtitle2' fontWeight={'bold'}>{item.amount?.value} {item.name?.value} {item?.description?.value && ','} {item?.description?.value}</Typography>
                                  </Grid>
                                  <Grid container md={12} sm={12} xs={12} p={1}>
                                    <Typography variant='subtitle2' sx={{ whiteSpace: 'pre-line' }}> {item?.obs?.value}</Typography>
                                  </Grid>
                                  <Grid container md={12} sm={12} xs={12}>
                                    <Grid container md={4}sm={4}xs={12} justifyContent={{ md: 'center', sm: 'center', xs: 'start' }}><Typography variant='subtitle2'>Largura [mm]: {item?.width?.value} </Typography> </Grid>
                                    <Grid container md={4}sm={4}xs={12} justifyContent={{ md: 'center', sm: 'center', xs: 'start' }}><Typography variant='subtitle2'>Altura [mm]: {item?.height?.value} </Typography></Grid>
                                    <Grid container md={4}sm={4}xs={12} justifyContent={{ md: 'center', sm: 'center', xs: 'start' }}><Typography variant='subtitle2'>Profundidade [mm]: {item?.thickness?.value} </Typography></Grid>
                                  </Grid>
                                  <Grid container md={12} sm={12} xs={12} p={1}>
                                    <Divider sx={{ width: '100%', borderStyle: 'dotted' }} />
                                    <Typography p={1} variant='subtitle2' >Preço: {item?.price?.value}</Typography>
                                  </Grid>
                                </Grid>
                              </Grow>;
                            })}
                          </AccordionDetails>
                        </Accordion>
                      </Grow>;
                    })}
                  </AccordionDetails>
                </Accordion>
              </Grow>;
            })}
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>

  </>;
};

export default Products2;
