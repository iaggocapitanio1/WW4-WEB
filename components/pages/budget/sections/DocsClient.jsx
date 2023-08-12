/* eslint-disable react/jsx-props-no-spreading */
import { Accordion, AccordionDetails, AccordionSummary, Box, Grid, IconButton, Table, TableBody, TableContainer, TableHead, Tooltip, Typography } from '@mui/material';
import { ChevronDown, FilePlus, FileText, Trash } from 'lucide-react';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { buildFoldersStructure } from '../../../../pages/internal/budget/[Id]';
import * as filesActionsRedux from '../../../../store/actions/file';
import * as foldersActionsRedux from '../../../../store/actions/folder';
import PrimaryBtn from '../../../buttons/primaryBtn';
import ConfirmDialog from '../../../dialogs/ConfirmDialog';
import Notification from '../../../dialogs/Notification';
import CanDo from '../../../utils/CanDo';
import ToastSet from '../../../utils/ToastSet';

const DocsClient = (props) => {
  const { pageProps, isInternalPage, budget } = props;
  const [userFiles, setUserFiles] = useState(props.folders.find(ele => ele.name === 'VF do Cliente')?.files);
  const dispatch = useDispatch();
  const uploadFiles = (data) => dispatch(filesActionsRedux.batchFiles(data));
  const [sectionExpanded, setSectionExpanded] = useState(true);
  const getFiles = (data) => dispatch(filesActionsRedux.budgetFiles(data));
  const deleteFile = (data) => dispatch(filesActionsRedux.deleteFile(data));
  const getFolders = (data) => dispatch(foldersActionsRedux.folders(data));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState();

  const onDrop = useCallback((acceptedFiles) => {
    handleFilesUpload(acceptedFiles);
  }, []);

  const { getInputProps } = useDropzone({ onDrop });

  async function handleFilesUpload (newFiles) {
    const FormData = require('form-data');
    const data = new FormData();

    data.append('folder', props.folders.find(ele => ele.name === 'VF do Cliente').id);
    [...newFiles].map((file, i) => data.append(`file${i !== 0 ? i + 1 : ''}`, file));

    try {
      await uploadFiles(data).then(async () => {
        const [foldersData, filesData] = await Promise.all([
          getFolders({ budget: budget.id }),
          getFiles(budget.id)
        ]);

        const builtFolders = await buildFoldersStructure([...foldersData.data.results], [...filesData.data.results]);

        setUserFiles(builtFolders.find(ele => ele.name === 'VF do Cliente')?.files);
        toast.success('Ficheiros carregados.');
      });
    } catch (error) {
      if (error?.response?.data?.non_field_errors) if (error?.response?.data?.non_field_errors[0] === 'A file with the same name already exists in the parent folder') toast.error('Este ficheiro já existe.');

      toast.error('Algo aconteceu. Por favor tente mais tarde');
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

  async function onDelete () {
    const loading = toast.loading('');

    setDialogOpen(false);

    try {
      await deleteFile(itemToDelete).then(() => {
        const old = [...userFiles];
        const index = old.findIndex((item) => item.id === itemToDelete);

        if (index !== -1) {
          const updatedItems = [...old];

          updatedItems.splice(index, 1);
          setUserFiles(updatedItems);
        }

        ToastSet(loading, 'Ficheiro removido!', 'success');
      });
    } catch (err) {
      ToastSet(loading, 'Algo aconteceu. Por favor tente mais tarde ', 'error');
    }
  }

  const canDownloadFile = CanDo('see_file');

  return <>
    <Notification />
    <ConfirmDialog
      open={dialogOpen}
      handleClose={() => setDialogOpen(false)}
      onConfirm={() => onDelete()}
      message={'Está prestes a apagar um ficheiro, o que é irreversível, tem certeza que quer continuar?'}
    />
    <Accordion expanded={sectionExpanded} onChange={() => setSectionExpanded(!sectionExpanded)} sx={{ width: '100%' }}>
      <AccordionSummary sx={{
        background: 'lightGray.main',
        paddingLeft: '24px',
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}
      bgcolor={'lightGray.main'} aria-controls="panel1d-content" id="panel1d-header" expandIcon={<ChevronDown />}>
        <Grid container md={12} sm={12} xs={12} alignItems={'center'}>
          <Grid container md={8} sm={8} xs={12}>
            <Typography variant='title'>Documentos {isInternalPage && 'Cliente'}</Typography>
          </Grid>
          <Grid container md={4} sm={4} xs={12} justifyContent={'end'}>
            <Box pr={2}>
              <PrimaryBtn
                text='Carregar'
                hidden={budget.budgetStatus.value === 'canceled'}
                onClick={(e) => e.stopPropagation()}
                icon={
                  <FilePlus
                    strokeWidth={pageProps?.globalVars?.iconSmStrokeWidth || 1.5}
                    size={pageProps?.globalVars?.iconSize || 20}
                  />
                }
              >
                <input {...getInputProps()} hidden multiple onChange={(e) => onDrop(e.target.files) } />
              </PrimaryBtn>
            </Box>
          </Grid>
        </Grid>
      </AccordionSummary>
      <AccordionDetails sx={{ padding: 0 }}>
        <TableContainer>
          <Table aria-label='collapsible table'>
            <TableHead aria-label='sticky table'>
              <Grid bgcolor='lightgray.main' container md={12} sm={12} xs={12} color='white' sx={{ bp: 1, borderBottom: '1px solid', borderTop: '1px solid', borderColor: 'divider', backgroundColor: '#F9F9F9' }}>
                <Grid container md={5.5} sm={5.5} xs={5.5} sx={{ alignItems: 'center', p: 2 }}><Box sx={{ borderRight: '1px solid', borderColor: 'divider', width: '100%', alignItems: 'center' }}> <Typography color='primary' fontWeight={'bold'} variant='subtitle2'>Nome</Typography> </Box></Grid>
                <Grid container md={5.5} sm={5.5} xs={5.5} sx={{ alignItems: 'center', p: 2 }}><Box sx={{ borderRight: '0px solid', borderColor: 'divider', width: '100%', alignItems: 'center', justifyContent: 'center', display: 'flex' }}> <Typography color='primary' fontWeight={'bold'} variant='subtitle2'>Data</Typography> </Box></Grid>
                <Grid container md={1} sm={1} xs={1} sx={{ alignItems: 'center', p: 2 }}><Box sx={{ borderRight: '0px solid', borderColor: 'divider', width: '100%', alignItems: 'center', justifyContent: 'center', display: 'flex' }}> <Typography color='primary' fontWeight={'bold'} variant='subtitle2'>Ações</Typography> </Box></Grid>
              </Grid>
            </TableHead>
            <TableBody >
              <Box sx={{ maxHeight: '350px', overflowY: 'scroll' }}>
                <Grid container >
                  {userFiles?.sort((a, b) => moment(b.created).diff(moment(a.created))).map(file =>
                    <Grid key={file.file_name} container p={2} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
                      <Grid container md={5.5} sm={5.5} xs={5.5} alignItems='center'>
                        <Box color='primary.main' alignItems='center'>
                          <FileText strokeWidth='1' style={{ marginRight: '1rem' }} />
                        </Box>
                        <Tooltip title='Clique para descarregar este ficheiro.'>
                          <Typography variant="subtitle2" sx={{ cursor: 'pointer', pointerEvents: !canDownloadFile && 'none' }} onClick={() => handleFileClick(file)}>{file?.file_name + file?.file_type}</Typography>
                        </Tooltip>
                      </Grid>
                      <Grid container md={5.5} sm={5.5} xs={5.5} alignItems='center' justifyContent={'center'}>
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
                    </Grid>)}
                </Grid>
              </Box>
            </TableBody>
          </Table>
        </TableContainer>
      </AccordionDetails>
    </Accordion>

  </>;
};

DocsClient.propTypes = {
  folders: PropTypes.array,
  styles: PropTypes.any,
  pageProps: PropTypes.any,
  headCellsDocs: PropTypes.array,
  budget: PropTypes.object,
  isInternalPage: PropTypes.bool,
};

export default DocsClient;
