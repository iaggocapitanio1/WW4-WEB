/* eslint-disable consistent-return */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import { Box, Grid, IconButton, ImageList, ImageListItem, Modal, Tooltip } from '@mui/material';
import { X, XCircle } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useSelector } from 'react-redux';
import PrimaryBtn from '../buttons/primaryBtn';
import Select from '../inputs/select';
import GetFileSize from '../utils/GetFileSize';
import IsInternal from '../utils/IsInternal';

const UploadImagesModal = ({ open, onClose, orderId, folders, client, ...pageProps }) => {
  const [newImages, setNewImages] = useState();
  // const [newImageDescription, setNewImageDescription] = useState('');
  // const [folders2, setFolders] = useState(folders);
  const [selectedFolder, setSelectedFolder] = useState(orderId);
  // const [uploading, setUploading] = useState(false);
  // const [errorFolder, setErrorFolder] = useState('');
  const userPermissions = useSelector((state) => state.auth.userPermissions);

  function getBase64 (file) {
    return new Promise(resolve => {
      let baseURL = '';
      // Make new FileReader
      const reader = new FileReader();

      // Convert the file to base64 text
      reader.readAsDataURL(file);

      // on reader load somthing...
      reader.onload = () => {
        // Make a fileInfo Object
        baseURL = reader.result;
        resolve(baseURL);
      };
    });
  }

  async function handleModalImageUpload (e) {
    const arr = [];

    for (let index = 0; index < Object.keys(e.target.files).length; index++) {
      const file = e.target.files[index];

      await getBase64(file)
        .then(result => {
          file.base64 = result;
          arr.push(file);
        })
        .catch(err => {
          console.log(err);
        });
    }

    setNewImages(arr);
  }

  async function handleSaveImages () {

  }
  // async function handleSaveImages () {
  //   if (!selectedFolder && !client) {
  //     setErrorFolder('Campo Obrigatório');

  //     return toast.warning('Escolha uma pasta');
  //   }

  //   if (!newImages) return toast.warning('Sem imagens escolhidas');

  //   setUploading(true);

  //   const errors = [];

  //   //  If client folder does not existe, create it (folder name === orderId)
  //   if (client && folders.find(ele => ele.name === orderId) === undefined) {
  //     const builtFolder = {
  //       name: orderId,
  //       orderDetailId: orderId
  //     };

  //     const newFolder = await FolderActions
  //       .saveFolder(builtFolder)
  //       .catch((err) => console.log(err));

  //     newFolder.data.payload.files = [];
  //     // setFolders([...folders, newFolder.data.payload]);

  //     newImages.map(async (file) => {
  //       const builtFile = {
  //         descricao: newImageDescription,
  //         url: '',
  //         data: file.base64,
  //         filename: file.name,
  //         filesize: JSON.stringify(file.size),
  //         folderId: newFolder.id,
  //       };

  //       try {
  //         await FileActions.saveFile(builtFile).then((res) => console.log(res));
  //       } catch (err) {
  //         errors.push(err);
  //       }
  //     });

  //     onClose();
  //   } else {
  //     newImages.map(async (file) => {
  //       const builtFile = {
  //         descricao: newImageDescription,
  //         url: '',
  //         data: file.base64,
  //         filename: file.name,
  //         filesize: JSON.stringify(file.size),
  //         folderId: selectedFolder,
  //       };

  //       try {
  //         await FileActions.saveFile(builtFile).then((res) => console.log(res));
  //       } catch (err) {
  //         errors.push(err);
  //       }
  //     });

  //     onClose();
  //   }

  //   if (errors[0]) toast.error('Algo aconteceu');
  //   else toast.success('Ficheiros carregados!');

  //   setNewImages();
  //   setUploading(false);
  //   onClose();
  // }

  const [uploadedFiles, setUploadedFiles] = useState();

  // function separateFilesByFolder (files) {
  //   const folders = {};

  //   for (const file of files) {
  //     const pathSegments = file.path.split('/');
  //     let currentFolder = folders;

  //     for (let i = 1; i < pathSegments.length - 1; i++) {
  //       const folderName = pathSegments[i];

  //       currentFolder[folderName] = currentFolder[folderName] || {};
  //       currentFolder = currentFolder[folderName];
  //     }

  //     const fileName = pathSegments[pathSegments.length - 1];

  //     currentFolder[fileName] = file;
  //   }

  //   return folders;
  // }

  const onDrop = useCallback(acceptedFiles => {
    setUploadedFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return <Modal open={open} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <Box bgcolor={'default.main'} sx={{ maxWidth: '600px', padding: '1rem', borderRadius: '8px', boxShadow: '0px 0px 20px -6px #5A5A5A' }}>
      <Grid container>
        <Grid container md={12} sx={{ display: 'flex' }}>
          <Box sx={{ marginLeft: 'auto' }}>
            <IconButton onClick={() => {
              setNewImages();
              onClose(false);
            }}>
              <X
                strokeWidth={pageProps?.globalVars?.iconStrokeWidth || 1}
                size={pageProps?.globalVars?.iconSize || 20}
              />
            </IconButton>
          </Box>
        </Grid>
        <Grid container md={12} sx={{ width: '100%' }}>
          {folders && !client && IsInternal(userPermissions?.description)
            ? <Grid md={6} p={1}>
              <Select
                required
                label='Pasta'
                value={selectedFolder}
                onChange={(e) => setSelectedFolder(e.target.value)}
                optionLabel={'name'}
                options={folders}
              />
            </Grid>
            : null}
        </Grid>

        <Grid container md={12} sx={{ padding: '1rem', maxHeight: '400px', overflow: 'scroll', overflowX: 'hidden' }}>
          <ImageList cols={3} sx={{ width: '100%' }} rowHeight={164} >
            {newImages?.map(image => (
              <Tooltip key={image.name} title={`${image.size >= process.env.NEXT_PUBLIC_MAX_UPLOAD_FILE_SIZE ? 'Imagem demasiado grande' : image.name}   tamanho ${GetFileSize(image.size)}`}>
                <ImageListItem container md={6} style={{ maxWidth: '100%', borderRadius: '8px', backgroundColor: image.size >= process.env.NEXT_PUBLIC_MAX_UPLOAD_FILE_SIZE && 'red' }}>
                  <Box sx={{
                    position: 'absolute',
                    top: image.size >= process.env.NEXT_PUBLIC_MAX_UPLOAD_FILE_SIZE ? '25%' : '-5px',
                    left: image.size >= process.env.NEXT_PUBLIC_MAX_UPLOAD_FILE_SIZE ? '25%' : '-5px',
                    zIndex: 12
                  }}>
                    <Tooltip title='Remover' >
                      <IconButton onClick={() => setNewImages(newImages.filter(item => item.name !== image.name))}>
                        <XCircle fill='var(--white)' color='var(--primary)' size={image.size >= process.env.NEXT_PUBLIC_MAX_UPLOAD_FILE_SIZE ? 60 : 30} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <img src={image.base64} style={{ opacity: image.size >= process.env.NEXT_PUBLIC_MAX_UPLOAD_FILE_SIZE && '0.6', borderRadius: '8px', zIndex: 11 }} />
                </ImageListItem>
              </Tooltip>
            )
            )}
          </ImageList>
          <Box className='dragDrop' {...getRootProps()} sx={{ borderColor: uploadedFiles && 'var(--green)', color: uploadedFiles && 'var(--green)' }}>
            <input {...getInputProps()} type='file' hidden multiple webkitdirectory="" onChange={(e) => handleModalImageUpload(e)} />
            {
              isDragActive
                ? <p>Drop...</p>
                : <p>{uploadedFiles ? `${Object.keys(uploadedFiles).length} ficheiros anexados` : 'Arraste ou clique para carregar ficheiros'}</p>
            }
          </Box>
        </Grid>
        <Grid md={12} sx={{ width: '100%' }}>
          <Box sx={{ display: 'flex', width: '100%' }}>
            <Box style={{ marginLeft: 'auto' }}>
              <PrimaryBtn text={ 'Guardar'} onClick={() => handleSaveImages()} />
              <PrimaryBtn light text={'Cancelar'} onClick={() => {
                setNewImages();
                onClose();
              }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  </Modal>;
};

export default UploadImagesModal;
