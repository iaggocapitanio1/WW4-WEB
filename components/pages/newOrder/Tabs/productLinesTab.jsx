/* eslint-disable array-callback-return */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Grid, Grow, IconButton, Tooltip, Typography } from '@mui/material';
import React, { useState } from 'react';

//  PropTypes
import { ChevronDown, Plus, Trash } from 'lucide-react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import MyInput from '../../../inputs/myInput';
import Form from './FormRows/Form';

const ProductLinesTab = (props) => {
  const {
    lines,
    setLines,
    linesErrors,
    setLinesErrors,
  } = props;

  const [expandedGroups, setExpandedGroups] = useState([]);
  const [sectionExpanded, setSectionExpanded] = useState(true);
  const reduxState = useSelector((state) => state);
  const theme = reduxState.appStates.theme;

  const toggleValueInArray = (value, array) => {
    const index = array.indexOf(value);

    if (index === -1) {
      return [...array, value];
    }

    return [...array.slice(0, index), ...array.slice(index + 1)];
  };

  const handleChange = (setExpandedGroups) => (panel) => {
    setExpandedGroups((prevExpandedGroups) =>
      toggleValueInArray(panel, prevExpandedGroups)
    );
  };

  const handlePanelChange = handleChange(setExpandedGroups);

  //  Add subGroup
  function addSubGroup (groupIndex, subGroupIndex) {
    if (linesErrors.subGroup) setLinesErrors({ ...linesErrors, subGroup: false });

    setLines(prevLines => {
      const newSubGroup = {
        id: `subgroup${groupIndex}${subGroupIndex + 1 || prevLines[groupIndex].subGroups.length}`,
        furnitureType: 'subgroup',
        name: '',
        items: []
      };

      const newSubGroups = [...prevLines[groupIndex].subGroups];

      if (subGroupIndex !== undefined) {
        newSubGroups.splice(subGroupIndex + 1, 0, newSubGroup);
      } else {
        newSubGroups.push(newSubGroup);
      }

      handlePanelChange(newSubGroup.id);

      return [
        ...prevLines.slice(0, groupIndex),
        {
          ...prevLines[groupIndex],
          subGroups: newSubGroups
        },
        ...prevLines.slice(groupIndex + 1)
      ];
    });
  }

  //  Add group
  function addGroup (props) {
    if (linesErrors.group) setLinesErrors({ ...linesErrors, group: false });

    const newGroup = {
      id: 'group' + (lines.length + 1),
      furnitureType: 'group',
      name: '',
      subGroups: [],
    };

    if (props + 1 <= 0) {
      setLines([newGroup, ...lines]);
    } else if (props >= lines.length) {
      setLines([...lines, newGroup]);
    } else {
      const updatedLines = [
        ...lines.slice(0, props + 1),
        newGroup,
        ...lines.slice(props + 1),
      ];

      setLines(updatedLines);
      handlePanelChange(newGroup.id);

      setExpandedGroups((prevExpandedGroups) =>
        toggleValueInArray(newGroup.id, prevExpandedGroups)
      );

      setExpandedGroups(prevState => {
        const updatedExpandedGroups = [...prevState, newGroup.id];

        return updatedExpandedGroups;
      });
    }
  }

  //  On Subgroup Name change
  function onSubgroupNameChange (subGroupIndex, groupIndex, newValue) {
    setLines(prevRows => {
      const updatedSubgroups = [...prevRows[groupIndex].subGroups]; // clone the subGroups array
      const updatedItems = [...updatedSubgroups[subGroupIndex].items]; // clone the items array of the subgroup

      updatedSubgroups[subGroupIndex].items = updatedItems; // update the items array of the subgroup
      updatedSubgroups[subGroupIndex].name = newValue; // update the name of the subgroup (optional)

      const updatedRow = {
        ...prevRows[groupIndex],
        subGroups: updatedSubgroups, // update the subGroups array of the group
      };

      const updatedRows = [...prevRows]; // clone the lines array

      updatedRows[groupIndex] = updatedRow; // update the group object in the lines array

      return updatedRows; // set the state to the new value
    });
  }

  //  Add furniture type row to group
  function addNewLineProduct (groupIndex, subGroupIndex) {
    const prevLines = [...lines];

    if (linesErrors.item) setLinesErrors({ ...linesErrors, item: false });

    prevLines[groupIndex].subGroups[subGroupIndex] = {
      ...prevLines[groupIndex].subGroups[subGroupIndex],
      items: [
        ...prevLines[groupIndex].subGroups[subGroupIndex].items,
        {
          furnitureType: { value: 'furniture', error: '', hidden: true },
          name: { id: 'name', value: '', error: '', required: true, label: 'Nome' },
          description: { id: 'description', value: '', error: '', label: 'Descrição', type: 'area' },
          amount: { id: 'amount', value: '', error: '', required: true, label: 'Quantidade', type: 'number' },
          obs: { id: 'obs', value: '', error: '', label: 'Observações', type: 'area' },
          width: { id: 'width', value: '', error: '', label: 'Largura' },
          height: { id: 'height', value: '', error: '', label: 'Altura' },
          thickness: { id: 'thickness', value: '', error: '', label: 'Profundidade' },
          price: { id: 'price', value: '', error: '', label: 'Valor', type: 'currency' },
        },
      ],
    };

    setLines(prevLines);
  }

  //  Add accessory type row to group
  function addNewLineAccessory (groupIndex, subGroupIndex) {
    const prevLines = [...lines];

    if (linesErrors.item) setLinesErrors({ ...linesErrors, item: false });

    prevLines[groupIndex].subGroups[subGroupIndex] = {
      ...prevLines[groupIndex].subGroups[subGroupIndex],
      items: [
        ...prevLines[groupIndex].subGroups[subGroupIndex].items,
        {
          furnitureType: { value: 'accessory', error: '', hidden: true },
          name: { id: 'name', value: '', error: '', required: true, label: 'Nome' },
          description: { id: 'description', value: '', error: '', label: 'Descrição', type: 'area' },
          amount: { id: 'amount', value: '', error: '', required: true, label: 'Quantidade', type: 'number' },
          obs: { id: 'obs', value: '', error: '', label: 'Observações', type: 'area' },
          price: { id: 'price', value: '', error: '', label: 'Valor', type: 'currency' },
        },
      ],
    };

    setLines(prevLines);
  }

  //  On Item change
  const onRowFieldChange = ({ subGroupIndex, groupIndex, itemIndex, newValue, property }) => {
    setLines(prevRows => {
      // Create a new array for the updated subGroups
      const updatedSubGroups = [...prevRows[groupIndex].subGroups];
      // Create a new array for the updated items
      const updatedItems = [...updatedSubGroups[subGroupIndex].items];

      // Create a new item object with the updated property value

      const updatedItem = {
        ...updatedItems[itemIndex],
        [property]: { ...updatedItems[itemIndex][property], value: newValue, error: '' },
      };

      // Update the array of items
      updatedItems[itemIndex] = updatedItem;

      // Update the array of subGroups
      updatedSubGroups[subGroupIndex] = {
        ...updatedSubGroups[subGroupIndex],
        items: updatedItems,
      };

      // Update the array of groups
      const updatedRows = [...prevRows];

      updatedRows[groupIndex] = {
        ...updatedRows[groupIndex],
        subGroups: updatedSubGroups,
      };

      // Return the updated lines array
      return updatedRows;
    });
  };

  //  On Row remove
  const removeRow = ({ groupIndex, subGroupIndex, itemIndex }) => {
    setLines(prevLines => {
      const thisItems = [...prevLines[groupIndex].subGroups[subGroupIndex].items];

      thisItems.splice(itemIndex, 1);

      const newSubGroups = [...prevLines[groupIndex].subGroups];

      newSubGroups[subGroupIndex] = { ...prevLines[groupIndex].subGroups[subGroupIndex], items: thisItems };

      const newLines = [...prevLines];

      newLines[groupIndex] = { ...prevLines[groupIndex], subGroups: newSubGroups };

      return newLines;
    });
  };

  //  On Group remove
  const removeThisGroup = (props) => {
    setLines(prevData => {
      const newData = [...prevData];

      newData.splice(props, 1);

      return newData;
    });
  };

  //  On subGroup remove
  function removeThisSubGroup (groupIndex, subGroupIndex) {
    setLines(prevRows => {
      const thisSubRows = [...prevRows[groupIndex].subGroups];

      thisSubRows.splice(subGroupIndex, 1);

      return [...prevRows.slice(0, groupIndex), {
        ...prevRows[groupIndex],
        subGroups: thisSubRows
      },
      ...prevRows.slice(groupIndex + 1)
      ];
    });
  }

  const buttonsProps = {
    sx: {
      border: '1px solid',
      borderColor: 'primary',
      color: 'primary',
      borderRadius: '50px',
      margin: '.5rem'
    }
  };

  return (
    <Accordion expanded={sectionExpanded} onChange={() => setSectionExpanded(!sectionExpanded)} sx={{ width: '100%', boxShadow: linesErrors.group && '0px 0px 4px 1px #d32f2f' }}>
      <AccordionSummary sx={{ background: 'lightGray.main' }} bgcolor={'lightGray.main'} aria-controls="panel1d-content" id="panel1d-header" expandIcon={<ChevronDown />}>
        <Typography id='align' variant='title' color={linesErrors.group && 'error'}>Produtos</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container p={'16px'} bgcolor={'lightGray.main'}
          sx={{
            border: '1px solid var(--grayEdges)',
            borderRadius: '4px'
          }}>
          {/* <Button onClick={() => CreateFurnitures()}>testBuild</Button> */}
          <Grid container sx={{ height: 'fit-content' }}>
            <Grid container md={12} sm={12} xs={12}>
              {/* Grupos */}
              {lines.map((group, groupIndex) => {
                return <>
                  <Grow key={group.id} in={true}>
                    <Accordion expanded={expandedGroups.includes(group.id)} onChange={() => handlePanelChange(group.id)} sx={{ width: '100%', boxShadow: linesErrors.subGroup && '0px 0px 4px 1px #d32f2f' }} >
                      <AccordionSummary aria-controls="panel1d-content" id="panel1d-header" expandIcon={<ChevronDown />} sx={{ borderBottom: expandedGroups.includes(group.id) && '1px solid', borderColor: expandedGroups.includes(group.id) && 'divider' }}>
                        <Grid container justifyContent={'space-between'} alignItems={'center'}>
                          <Typography variant='subtitle1' fontWeight={'semibold'} color={linesErrors.subGroup && 'error'} >{group.name}</Typography>
                          <Box pr={2}>
                            <Tooltip title='Remover este grupo'>
                              <IconButton onClick={() => removeThisGroup(groupIndex)} >
                                <Trash color='red' size={20} strokeWidth={1.5} />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Grid>
                      </AccordionSummary>
                      <AccordionDetails sx={{ padding: '2rem' }}>
                        <Grid container md={3} pb={2}>
                          <MyInput required label='Grupo' value={group.name} onChange={(e) => setLines([...lines.slice(0, groupIndex), { ...lines[groupIndex], name: e.target.value }, ...lines.slice(groupIndex + 1)])} />
                        </Grid>
                        {/* Grupos de divisão/subGroups */}
                        {group.subGroups.map((subgroup, subGroupIndex) => {
                          const isSubgroupValid = subgroup.name !== '' && subgroup.items[subgroup.items.length - 1]?.name.value !== '' && subgroup.items[subgroup.items.length - 1]?.amount.value !== '';
                          const isGroupValid = group.name !== '' && subgroup.items.length > 0 && isSubgroupValid;

                          return <Grow in key={subgroup.id}>
                            <Accordion expanded={expandedGroups.includes(subgroup.id)} onChange={() => handlePanelChange(subgroup.id)} sx={{ width: '100%', boxShadow: linesErrors.item && '0px 0px 4px 1px #d32f2f' }}>
                              <AccordionSummary aria-controls="panel1d-content" id="panel1d-header" expandIcon={<ChevronDown />} sx={{ background: theme?.palette.lightGray.edges, borderBottom: expandedGroups.includes(subgroup.id) && '0px solid', borderColor: expandedGroups.includes(subgroup.id) && 'divider' }}>
                                <Grid container justifyContent={'space-between'} alignItems={'center'}>
                                  <Typography variant='subtitle1' color={linesErrors.item && 'error'} >{subgroup.name}</Typography>
                                  <Box pr={2}>
                                    <Tooltip title='Remover este subgrupo'>
                                      <IconButton onClick={() => removeThisSubGroup(groupIndex, subGroupIndex)} >
                                        <Trash color='red' size={20} strokeWidth={1.5} />
                                      </IconButton>
                                    </Tooltip>
                                  </Box>
                                </Grid>
                              </AccordionSummary>
                              <AccordionDetails>
                                <Grid container md={3} pb={2}>
                                  <MyInput required label='Subgrupo' value={subgroup.name} onChange={(e) => onSubgroupNameChange(subGroupIndex, groupIndex, e.target.value)} />
                                </Grid>
                                {/* Linhas de moveis/furniture */}
                                {subgroup.items.map((row, itemIndex) => {
                                  const keys = Object.keys(row);
                                  const errors = keys.map((key) => row[key].error);

                                  return <Grow key={itemIndex}in={true}>
                                    <Box sx={{ borderRadius: '8px', boxShadow: errors.find(ele => ele) && '0px 0px 4px 3px #d32f2f' }} pb={errors.find(ele => ele) && 4} mt={errors.find(ele => ele) && 4} >
                                      <Form errors={errors} field={row} groupIndex={groupIndex} subGroupIndex={subGroupIndex} itemIndex={itemIndex} lines={lines} onChange={onRowFieldChange} onRemove={removeRow} />
                                    </Box>
                                  </Grow>;
                                })}
                                <Grid container md={12} sm={12} xs={12} pt={2}>
                                  <Button {...buttonsProps} disabled={!isSubgroupValid} onClick={() => addNewLineProduct(groupIndex, subGroupIndex)} mr={'1rem'}> <Plus /> Adicionar Móvel</Button>
                                  <Button {...buttonsProps} disabled={!isSubgroupValid} onClick={() => addNewLineAccessory(groupIndex, subGroupIndex)} > <Plus /> Adicionar Acessório</Button>
                                  <Button {...buttonsProps} disabled={!isSubgroupValid || !subgroup.items.length > 0} onClick={() => addSubGroup(groupIndex, subGroupIndex)} > <Plus /> Adicionar Subgrupo</Button>
                                  <Button {...buttonsProps} disabled={!isGroupValid} onClick={() => addGroup(subGroupIndex)} ml={'1rem'}> <Plus /> Novo grupo</Button>
                                </Grid>
                              </AccordionDetails>
                            </Accordion>
                          </Grow>;
                        })}
                        <Grid container md={12} sm={12} xs={12} pt={2}>
                          <Button
                            onClick={() => addSubGroup(groupIndex)}
                            disabled={group.name === ''}
                            {...buttonsProps}
                            style={{ display: group.subGroups?.length > 0 && 'none' }} >
                            <Plus />
                              Adicionar Subgrupo
                          </Button>
                        </Grid>
                      </AccordionDetails>
                    </Accordion>
                  </Grow>
                </>;
              })}

              {/* Add group */}
              <Grid container md={12} pb={0}>
                <Grid container md={4} alignItems={'end'} display={lines.length > 0 && 'none'}>
                  <Box>
                    <Button ml={'1rem'} {...buttonsProps} onClick={addGroup} > <Plus />Novo grupo</Button>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

ProductLinesTab.propTypes = {
  pageProps: PropTypes.any,
  lines: PropTypes.arrayOf(PropTypes.object).isRequired,
  setLines: PropTypes.func.isRequired
};

export default ProductLinesTab;
