/* eslint-disable array-callback-return */
/* eslint-disable react/prop-types */
import { UnfoldLessOutlined, UnfoldMoreOutlined } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Box, ButtonGroup, Grid, Grow, Typography } from '@mui/material';
import { ChevronDown, Eye } from 'lucide-react';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import PrimaryBtn from '../../../buttons/primaryBtn';
import FurnitureDetails from '../../factoryGround/ProjectDetails/furnitureDetails';

const Production = (props) => {
  const { open, furnitures } = props;
  const [expandedGroups, setExpandedGroups] = useState([]);
  const reduxState = useSelector((state) => state);
  const theme = reduxState.appStates.theme;
  const [sectionExpanded, setSectionExpanded] = useState(true);
  const [chosenFurniture, setChosenFurniture] = useState();
  const [furnitureProject, setFurnitureProject] = useState();

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
        // if it doesn't exist, add it to the updated arrayg
        updatedArray.push(item);
      }
    });

    // set the updated array as the new state
    setExpandedGroups(updatedArray);
  }

  return open && <>
    {chosenFurniture && <FurnitureDetails
      {...props}
      open={chosenFurniture}
      furnitureProject={furnitureProject}
      chosenFurniture={chosenFurniture}
      setChosenProject={setChosenFurniture}
      onClose={setChosenFurniture}
      detailOnly
    />}
    <Accordion expanded={sectionExpanded} onChange={() => setSectionExpanded(!sectionExpanded)} sx={{ width: '100%' }}>
      <AccordionSummary sx={{
        background: 'lightGray.main',
        paddingLeft: '24px',
        borderBottom: '1px solid',
        borderColor: 'divider'
      }} bgcolor={'lightGray.main'} aria-controls="panel1d-content" id="panel1d-header" expandIcon={<ChevronDown />}>
        <Grid container md={12} sm={12} xs={12}>
          <Grid container md={12} sm={12} xs={12}><Typography variant='title'>Produção</Typography></Grid>
        </Grid>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container>
          <Grid container md={12} sm={12} xs={12} justifyContent={'end'} sx={{ }}>
            <ButtonGroup>
              <PrimaryBtn onClick={() => expandAll()} light icon={<UnfoldMoreOutlined />} text={'Abrir tudo'} />
              <PrimaryBtn onClick={() => collapseAll()} light icon={<UnfoldLessOutlined />} text={'Fechar tudo'} />
            </ButtonGroup>
          </Grid>
          <Grid container md={12} sm={12} xs={12}>
            {/* Lines */}
            {furnitures?.map((group, groupIndex) => {
              return <Grow key={groupIndex} in={true}>
                <Accordion
                  expanded={expandedGroups.includes(group.id)}
                  onChange={() => handlePanelChange(group.id)}
                  sx={{ width: '100%' }}>
                  <AccordionSummary aria-controls="panel1d-content" id="panel1d-header" expandIcon={<ChevronDown />}>
                    <Typography variant='subtitle1' color={'lightTextSm.main'}>Grupo - </Typography>
                    <Typography variant='subtitle1' color='primary'>{group.name.value}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box display='flex' justifyContent={'end'}>
                      <ButtonGroup>
                        <PrimaryBtn onClick={() => expandAllSubgroups(groupIndex)} light icon={<UnfoldMoreOutlined />} text={'Abrir subgrupos'} />
                        <PrimaryBtn onClick={() => collapseAllSubgroups(groupIndex)} light icon={<UnfoldLessOutlined />} text={'Fechar subgrupos'} />
                      </ButtonGroup>
                    </Box>
                    {group.subgroups?.map((subgroup) => {
                      return <Grow in key={subgroup.id}>
                        <Accordion expanded={expandedGroups.includes(subgroup.id)} onChange={() => handlePanelChange(subgroup.id)} sx={{ width: '100%' }}>
                          <AccordionSummary aria-controls="panel1d-content" id="panel1d-header" expandIcon={<ChevronDown />} sx={{ background: theme?.palette.lightGray.edges, borderBottom: expandedGroups.includes(subgroup.id) && '0px solid', borderColor: expandedGroups.includes(subgroup.id) && 'divider' }}>
                            <Grid container alignItems={'center'}>
                              <Typography variant='subtitle1' color={'lightTextSm.main'}>Subgrupo - </Typography>
                              <Typography variant='subtitle1' >{subgroup.name.value}</Typography>
                            </Grid>
                          </AccordionSummary>
                          <AccordionDetails sx={{ p: 0 }}>
                            {/* Linhas de moveis/furniture */}
                            <Grid container md={12} sm={12} xs={12}>
                              <Grid container md={12} sm={12} xs={12} color='white' sx={{ backgroundColor: '#F9F9F9', bp: 1, borderBottom: '1px solid', borderTop: '1px solid', borderColor: 'divider' }}>
                                <Grid container md={3} sm={3} xs={3} sx={{ alignItems: 'center', p: 2 }}><Box sx={{ borderRight: '1px solid', borderColor: 'divider', width: '100%', alignItems: 'center' }}> <Typography color='primary' fontWeight={'bold'} variant='subtitle2'>Móvel</Typography> </Box></Grid>
                                <Grid container md={3} sm={3} xs={3} sx={{ alignItems: 'center', p: 2 }}><Box sx={{ borderRight: '1px solid', borderColor: 'divider', width: '100%', alignItems: 'center', justifyContent: 'center', display: 'flex' }}> <Typography color='primary' fontWeight={'bold'} variant='subtitle2'>Quantidade Pedida</Typography> </Box></Grid>
                                <Grid container md={3} sm={3} xs={3} sx={{ alignItems: 'center', p: 2 }}><Box sx={{ borderRight: '1px solid', borderColor: 'divider', width: '100%', alignItems: 'center', justifyContent: 'center', display: 'flex' }}> <Typography color='primary' fontWeight={'bold'} variant='subtitle2'>Estado</Typography> </Box></Grid>
                                <Grid container md={3} sm={3} xs={3} sx={{ alignItems: 'center', p: 2 }}><Box sx={{ borderRight: '0px solid', borderColor: 'divider', width: '100%', alignItems: 'center', justifyContent: 'center', display: 'flex' }}> <Typography color='primary' fontWeight={'bold'} variant='subtitle2'>Detalhes</Typography> </Box></Grid>
                              </Grid>
                              {subgroup.items.filter((ele) => ele.furnitureType.value === 'furniture').map((item, itemIndex) => {
                                return <Grow key={itemIndex}in={true}>
                                  <Grid container md={12} sm={12} xs={12} sx={{ p: 1 }}>
                                    <Grid container md={3} sm={3} xs={3}><Typography varitant='subtitle1'>{item.name?.value}</Typography></Grid>
                                    <Grid container md={3} sm={3} xs={3} sx={{ justifyContent: 'center', display: 'flex' }}><Typography varitant='subtitle1'>{item.amount?.value}</Typography></Grid>
                                    <Grid container md={3} sm={3} xs={3} sx={{ justifyContent: 'center', display: 'flex' }}>
                                      {!item.produced?.value ? <Box><Typography variant='sm' className='warningBalloon'>Em produção</Typography></Box> : <Box><Typography variant='sm' className='successBalloon'>Terminado</Typography> </Box>}
                                    </Grid>
                                    <Grid container md={3} sm={3} xs={3} justifyContent={'center'}>
                                      <Typography varitant='subtitle1'>
                                        <PrimaryBtn text='Ver' icon={<Eye />} onClick={() => {
                                          setChosenFurniture(item);
                                          setFurnitureProject(props.order);
                                        }} />
                                      </Typography>
                                    </Grid>
                                  </Grid>
                                </Grow>;
                              })}
                            </Grid>

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

export default Production;
