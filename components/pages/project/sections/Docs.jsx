/* eslint-disable array-callback-return */
/* eslint-disable react/no-unknown-property */
/* eslint-disable react/jsx-props-no-spreading */
//  PropTypes
import { ArrowDropDown, ArrowRight } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Box, Grid, IconButton, Paper, Table, TableBody, TableContainer, Tooltip, Typography } from '@mui/material';
import { ChevronDown, FileText, Trash } from 'lucide-react';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
// import { useDispatch } from 'react-redux';
// import * as filesActionsRedux from '../../../../store/actions/file';
// import * as foldersActionsRedux from '../../../../store/actions/folder';
import { useDispatch } from 'react-redux';
import * as filesActionsRedux from '../../../../store/actions/file';
import Notification from '../../../dialogs/Notification';
import CanDo from '../../../utils/CanDo';
import ConfirmDialog from '../../../dialogs/ConfirmDialog';
import { toast } from 'react-toastify';
import ToastSet from '../../../utils/ToastSet';

const Docs = (props) => {
  const [sectionExpanded, setSectionExpanded] = useState(true);
  const { open } = props;
  // const dispatch = useDispatch();
  const [folders, setFolders] = useState(props.folders);
  // const [folders, setFolders] = useState(props.folders);
  // const getFolders = (data) => dispatch(foldersActionsRedux.folders(data));
  // const getFiles = (data) => dispatch(filesActionsRedux.budgetFiles(data));
  const [expandedGroups, setExpandedGroups] = useState([]);
  const canDownloadFile = CanDo('see_file');
  const [itemToDelete, setItemToDelete] = useState();
  const [dialogOpen, setDialogOpen] = useState(false);
  const dispatch = useDispatch();
  const deleteFile = (data) => dispatch(filesActionsRedux.deleteFile(data));

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

  async function onDelete () {
    const loading = toast.loading('');

    setDialogOpen(false);

    try {
      await deleteFile(itemToDelete).then(() => {
        const updatedFolders = [...folders];

        updatedFolders.map((folder) => {
          folder.files = folder.files.filter((file) => file.id !== itemToDelete);

          return { ...folder };
        });

        setFolders(updatedFolders);
        ToastSet(loading, 'Ficheiro removido!', 'success');
      });
    } catch (err) {
      console.log(err);
      ToastSet(loading, 'Algo aconteceu. Por favor tente mais tarde ', 'error');
    }
  }

  async function handleFileClick (file) {
    fetch(file.file)
      .then(response => response.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');

        a.href = url;
        a.download = `${file.file_name}${file.file_type}`; // Change this to the desired file name if needed
        document.body.appendChild(a);
        a.click();

        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 0);
      });
  }

  function renderAccordionFolders (folders, parentId = null) {
    return folders?.filter((folder) => folder.parent === parentId)
      .map((folder) => {
        // check if this is the root folder
        if (parentId === null && folder.parent === null) {
          // skip the root folder and only render its children
          return renderAccordionFolders(folders, folder.id);
        }

        return (
          <Accordion expanded={expandedGroups.includes(folder.id)}
            onChange={() => handlePanelChange(folder.id)} key={folder.id}
            sx={{ padding: 0, paddingLeft: '2rem', margin: 0, boxShadow: 'none', border: '0.5px solid', borderColor: 'divider' }}>
            <AccordionSummary sx={{ height: '20px', backgroundColor: 'white' }} >
              <Grid container bgcolor={'default.main'} >
                <Grid container md={12} sm={12} xs={12} alignItems='center'>
                  <Box id='align' color='primary.main' >
                    {expandedGroups.includes(folder.id)
                      ? (
                        <ArrowDropDown strokeWidth='1' style={{ marginRight: '1rem' }} />
                      )
                      : (
                        <ArrowRight strokeWidth='1' style={{ marginRight: '1rem' }} />
                      )}
                  </Box>
                  <Typography variant="subtitle2">{folder.name} </Typography>
                </Grid>
              </Grid>
            </AccordionSummary>
            <AccordionDetails sx={{ padding: 0, borderRadius: '8px', backgroundColor: 'white' }} >
              {folder.files.length === 0 && folders.find(fold => fold.parent === folder.id) === undefined
                ? <Typography variant='subtitle2' sx={{ paddingLeft: '3rem' }}>Vazia</Typography>
                : null}
              {folder.files.length > 0 && <>
                <Grid container md={12} sm={12} xs={12} sx={{ paddingLeft: '3rem', borderBottom: '1px solid', borderTop: '1px solid', borderColor: 'divider' }}>
                  <Grid container md={9} sm={9} xs={9} sx={{ alignItems: 'center', p: 1 }}><Box sx={{ borderRight: '1px solid', borderColor: 'divider', width: '100%', alignItems: 'center' }}> <Typography color='primary' fontWeight={'bold'} variant='subtitle2'>Nome</Typography> </Box></Grid>
                  <Grid container md={3} sm={3} xs={3} sx={{ alignItems: 'center', p: 1 }}><Box sx={{ borderRight: '0px solid', borderColor: 'divider', width: '100%', alignItems: 'center', justifyContent: 'center', display: 'flex' }}> <Typography color='primary' fontWeight={'bold'} variant='subtitle2'>Data</Typography> </Box></Grid>
                </Grid>
                <Grid container sx={{ }}>

                  {folder.files.filter(file => typeof file !== 'undefined').sort((a, b) => a.file_name - b.file_name).map((file, rowIndex) => (
                    <Grid container md={12} sm={12} xs={12} sx={{ pl: '3rem' }} bgcolor={rowIndex % 2 !== 0 && 'lightGray.edges'} key={file?.id} alignItems={'center'} p={1}>
                      <Grid container md={8} sm={8} xs={8} sx={{ }} >
                        <FileText
                          strokeWidth='1'
                          style={{ marginRight: '1rem' }}
                        />
                        <Tooltip title='Clique para descarregar este ficheiro.'>
                          <Typography variant='subtitle2' sx={{ cursor: 'pointer', pointerEvents: !canDownloadFile && 'none' }} onClick={() => handleFileClick(file)}>{file?.file_name + file?.file_type}</Typography>
                        </Tooltip>
                      </Grid>
                      <Grid container md={3} sm={3} xs={3} sx={{ justifyContent: 'center' }} >
                        <Typography variant="subtitle2">{moment(file.created).format('DD/MM/YYYY HH:mm')} </Typography>
                      </Grid>
                      <Grid container md={1} sm={1} xs={1} alignItems='center' justifyContent={'end'}>
                        <Tooltip title={'Apagar'} >
                          <IconButton color={'error'} onClick={() => {
                            setItemToDelete(file.id);
                            setDialogOpen(true);
                          }} size="small">
                            <Trash size={20} strokeWidth={1.5} />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  ))}
                </Grid>

              </>}
              <Box bgcolor='lightGray.secondary'>
                {renderAccordionFolders(folders, folder.id)}
              </Box>
            </AccordionDetails>
          </Accordion>
        );
      });
  }

  return open && <>
    <Notification />
    <ConfirmDialog
      open={dialogOpen}
      handleClose={() => setDialogOpen(false)}
      onConfirm={() => onDelete()}
      message={'Está prestes a apagar um ficheiro, o que é irreversível, tem certeza que quer continuar?'}
    />
    <Accordion expanded={sectionExpanded} onChange={() => setSectionExpanded(!sectionExpanded)} sx={{ width: '100%' }}>
      <AccordionSummary sx={{ paddingLeft: '24px' }} bgcolor={'lightGray.main'} aria-controls="panel1d-content" id="panel1d-header" expandIcon={<ChevronDown />}>
        <Grid container md={12} sm={12} xs={12}>
          <Grid container md={12} sm={12} xs={12}><Typography variant='title'>Documentos</Typography></Grid>
        </Grid>
      </AccordionSummary>
      <AccordionDetails sx={{ padding: 0 }}>
        <TableContainer component={Paper}>
          <Table aria-label='collapsible table'>
            <TableBody >
              <Box sx={{ maxHeight: '500px', overflowY: 'scroll' }}>
                {renderAccordionFolders(folders)}
              </Box>
            </TableBody>
          </Table>
        </TableContainer>
      </AccordionDetails>
    </Accordion>
  </>;
};

Docs.propTypes = {
  order: PropTypes.any,
  folders: PropTypes.array,
  open: PropTypes.bool,
};

export default Docs;
