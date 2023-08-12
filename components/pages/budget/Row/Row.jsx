/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable consistent-return */
/* eslint-disable react/no-unknown-property */
import { Box, Button, ButtonGroup, Collapse, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, IconButton, Table, TableCell, TableRow, Tooltip, Typography } from '@mui/material';
import { Edit, FileText, Folder, FolderOpen, Trash, XCircle } from 'lucide-react';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import ConvertFilesToObj from '../../../utils/ConvertFilesToObj';

const Row = (props) => {
  const { row, index, setActiveFolder, folders, budget, pageProps, styles } = props;
  const [open, setOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState();
  const [newImages, setNewImages] = useState();

  const onDrop = useCallback(acceptedFiles => {
    // Do something with the files
    // setNewImages(acceptedFiles);
    const obj = ConvertFilesToObj(acceptedFiles);

    console.log(obj);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, noClick: true });

  function onRowClick () {
    setOpen(!open);
    setActiveFolder(index);
  }

  async function handleSaveImages () {
    if (!row.id) {
      return toast.warning('Escolha uma pasta');
    }

    if (!newImages) return toast.warning('Sem imagens escolhidas');

    const errors = [];

    //  If client folder does not existe, create it (folder name === orderId)
    if (folders.find(ele => ele.name === budget.id) === undefined) {
      // const builtFolder = {
      //   name: budget.id,
      //   orderDetailId: budget.id
      // };

      //  const newFolder = await FolderActions
      //    .saveFolder(builtFolder)
      //    .catch((err) => console.log(err));

      //  newFolder.data.payload.files = [];
      //  setFolders([...folders, newFolder.data.payload]);

      newImages.map(async () => {
        // const builtFile = {
        //   descricao: '',
        //   url: '',
        //   data: file.base64,
        //   filename: file.name,
        //   filesize: JSON.stringify(file.size),
        //   folderId: newFolder.id,
        // };

        try {
          //  await FileActions.saveFile(builtFile).then((res) => console.log(res));
        } catch (err) {
          errors.push(err);
        }
      });
    } else {
      newImages.map(async () => {
        // const builtFile = {
        //   descricao: '',
        //   url: '',
        //   data: file.base64,
        //   filename: file.name,
        //   filesize: JSON.stringify(file.size),
        //   folderId: row.id,
        // };

        try {
          //  await FileActions.saveFile(builtFile).then((res) => console.log(res));
        } catch (err) {
          errors.push(err);
        }
      });
    }

    if (errors[0]) toast.error('Algo aconteceu');
    else toast.success('Ficheiros carregados!');

    setNewImages();
  }

  return (
    <React.Fragment {...getRootProps()}>
      <Dialog
        open={!!newImages}
        onClose={() => setUploadedFiles()}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle color="link.main" id='alert-dialog-title' >
             Confirmar upload
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Box mb={1} sx={{ display: 'flex', justifyContent: 'center' }}>
            <XCircle size={80} strokeWidth={1.5} />
          </Box>
          <DialogContentText id='alert-dialog-description'>
               Está prestes a carregar {uploadedFiles && Object.keys(uploadedFiles).length} para a pasta {row.name}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleSaveImages()} autoFocus>
            <Typography color="link.main">Concordo</Typography>
          </Button>
          <Button onClick={() => {
            setUploadedFiles();
            setNewImages();
          }} sx={{ color: 'var(--gray)' }}>Cancelar</Button>
        </DialogActions>
      </Dialog>
      <TableRow
        sx={{ '& > *': { borderBottom: 'unset' }, cursor: 'pointer' }}
        className={styles.docRow}
        style={{ borderColor: open && 'var(--primary)' }}
        onClick={() => onRowClick()}
        // styles={open && style}
      >
        <TableCell {...getRootProps()}>
          <div id='align' style={{ color: 'var(--primary)' }}>
            {open
              ? (
                <FolderOpen strokeWidth='1' style={{ marginRight: '1rem' }} />
              )
              : (
                <Folder strokeWidth='1' style={{ marginRight: '1rem' }} />
              )}
            {!isDragActive ? row.name.replace('urn:ngsi-ld:Folder:', '') : `Upload files to ${row.name.replace('urn:ngsi-ld:Folder:', '')}`}
          </div>
        </TableCell>
        <TableCell onClick={() => onRowClick()}>{moment(row.createdAt).format('DD/MM/YYYY')}</TableCell>
        <TableCell>
          <ButtonGroup>
            <Tooltip title='Edit'>
              <IconButton>
                <Edit
                  strokeWidth={pageProps?.globalVars?.iconStrokeWidth || 1}
                  size={pageProps?.globalVars?.iconSize || 20}
                  className='link'
                />
              </IconButton>
            </Tooltip>
            <Tooltip title='Delete'>
              <IconButton>
                <Trash
                  strokeWidth={pageProps?.globalVars?.iconStrokeWidth || 1}
                  size={pageProps?.globalVars?.iconSize || 20}
                  className='link'
                />
              </IconButton>
            </Tooltip>
          </ButtonGroup>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ padding: 0 }} colSpan={12}>
          <Collapse
            sx={{
              borderTop: '1px solid var(--grayEdges)',
              margin: 'none',
              padding: 'none',
            }}
            in={open}
            timeout='auto'
            unmountOnExit
          >
            <Table sx={{ padding: 0, margin: 0, maxHeight: '400px', overflow: 'scroll' }}>
              <Box sx={{ maxHeight: '400px', overflow: 'scroll' }}>
                {row.files[0] && row.files[0].map((file) => (
                  <TableRow key={file.id} fullWidth style={{ backgroundColor: '#F1FBFF' }}>
                    <TableCell width='70%'>
                      <div id='align' style={{ color: 'var(--primary)' }}>
                        <FileText
                          strokeWidth='1'
                          style={{ marginRight: '1rem' }}
                        />
                        {file.filename}
                      </div>
                    </TableCell>
                    <TableCell width='30%'>{moment(file.dataCriacao).format('DD/MM/YYYY')}</TableCell>
                    <TableCell>
                      <ButtonGroup>
                        <Tooltip title='Editar'>
                          <IconButton>
                            <Edit
                              className='link'
                              strokeWidth={pageProps?.globalVars?.iconStrokeWidth || 1}
                              size={pageProps?.globalVars?.iconSize || 20}
                            />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title='Apagar'>
                          <IconButton>
                            <Trash
                              className='link'
                              strokeWidth={pageProps?.globalVars?.iconStrokeWidth || 1}
                              size={pageProps?.globalVars?.iconSize || 20}
                            />
                          </IconButton>
                        </Tooltip>
                      </ButtonGroup>
                    </TableCell>
                  </TableRow>
                ))}
              </Box>
            </Table>
          </Collapse>
        </TableCell>
      </TableRow>
      <input {...getInputProps()} type='file' hidden multiple webkitdirectory mozdirectory directory onChange={(e) => console.log(e.target.files)} />
    </React.Fragment>
  );
};

Row.propTypes = {
  row: PropTypes.any,
  pageProps: PropTypes.any,
  index: PropTypes.number,
  setActiveFolder: PropTypes.any,
  folders: PropTypes.any,
  budget: PropTypes.any,
  setFolders: PropTypes.any,
  styles: PropTypes.any,

};

export default Row;
