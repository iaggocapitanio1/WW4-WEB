import { Box, Checkbox, Grid, Typography } from '@mui/material';
import { Edit2, Trash } from 'lucide-react';
import Router from 'next/router';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import routes from '../../../navigation/routes';
import * as permissionsActionsRedux from '../../../store/actions/profile';
import CustomBreadcrumbs from '../../breadcrumbs/breadcrumbs';
import Buttons from '../../buttons/Buttons';
import Content from '../../content/content';
import ConfirmDialog from '../../dialogs/ConfirmDialog';
import Notification from '../../dialogs/Notification';
import Footer from '../../layout/footer/footer';
import Navbar from '../../layout/navbar/navbar';
import CanDo from '../../utils/CanDo';
import ToastSet from '../../utils/ToastSet';

const ProfileScreen = (props) => {
  const { breadcrumbsPath, profile, resources } = props;
  const [dialogOpen, setDialogOpen] = useState(false);
  const dispatch = useDispatch();
  const deleteProfile = (data) => dispatch(permissionsActionsRedux.deleteProfile(data));

  async function onDelete () {
    const loading = toast.loading('');

    await deleteProfile(profile.id).then(() => {
      ToastSet(loading, 'Perfil Apagado.', 'success');
      Router.push(routes.private.internal.profiles);
    }).catch((err) => {
      ToastSet(loading, 'Algo aconteceu. Por favor tente mais tarde.', 'error');
      console.log(err);
    });
  }

  const headCells = [
    { key: 'key', label: 'Opção' },
    { key: 'list', label: 'Listar' },
    { key: 'see', label: 'Visualizar' },
    { key: 'create', label: 'Criar' },
    { key: 'update', label: 'Editar' },
    { key: 'delete', label: 'Apagar' },
  ];

  const cellWidth = 12 / (Object.keys(headCells).length);
  const canEditProfile = CanDo('update_profile');
  const canDeleteProfile = CanDo('delete_profile');

  return <>
    <ConfirmDialog
      open={dialogOpen}
      handleClose={() => setDialogOpen(false)}
      onConfirm={() => onDelete()}
      message={'Está prestes a apagar um perfil o que é irreversível, tem certeza que quer continuar?'}
    />
    <Navbar />
    <Notification />
    <Grid component='main' sx={{ padding: '0rem 2rem 4rem 2rem' }}>
      <CustomBreadcrumbs path={breadcrumbsPath} />
      <Content>
        <Grid container id='pad' md={12} justifyContent={'space-between'} >
          <Typography variant='title'>{breadcrumbsPath[1].title}</Typography>
          <Box>
            <Buttons buttons={[
              {
                text: 'Editar',
                hidden: !canEditProfile,
                href: routes.private.internal.editProfile + profile.id,
                icon: <Edit2 strokeWidth='1' size={20} />,
                color: 'primary'
              },
              {
                text: 'Apagar',
                hidden: !canDeleteProfile,
                icon: <Trash strokeWidth='1' size={20} />,
                onClick: () => setDialogOpen(true),
                color: 'error',
                light: true
              },
            ]} />
          </Box>
        </Grid>
        <Grid container md={12} sm={12} xs={12} sx={{ padding: 0, overflow: 'scroll', pb: 0 }}>

          <Grid container md={12} sm={12} xs={12} sx={{ minWidth: '1024px', height: 'fit-content' }}>

            <Grid container md={12} sm={12} xs={12}>
              {/* Header */}
              <Grid container md={12} sm={12} xs={12} bgcolor={'primary.main'} color='white'>
                {headCells.map((cell) => {
                  return <Grid key={cell.label} container alignItems='center' p={2}
                    md={cellWidth}
                    sm={cellWidth}
                    xs={cellWidth}>
                    {cell.label}
                  </Grid>;
                })}
              </Grid>
              {Object.keys(profile?.listPermissions).sort((a, b) => (a > b) ? 1 : -1).map((perm, rowIndex) => {
                return headCells.map((cell, index) => {
                  return <Grid key={cell.label} container alignItems='center' p={0} bgcolor={rowIndex % 2 !== 0 && 'lightGray.edges'}
                    md={cellWidth}
                    sm={cellWidth}
                    xs={cellWidth}>
                    {index === 0
                      ? <Typography pl={2} variant='subtitle2'>{perm}</Typography>
                      : <>
                        {resources.find(ele => ele.codename === `${cell.key}_${resources.find(ele => ele.name === perm).codename.split('_')[1]}`) &&
                    <Checkbox disabled checked={!!profile.listPermissions[perm][cell.key]} />}
                      </>
                    }
                  </Grid>;
                });
              })}
            </Grid>
          </Grid>
        </Grid>
      </Content>
    </Grid>

    <Footer />
  </>;
};

ProfileScreen.propTypes = {
  breadcrumbsPath: PropTypes.arrayOf(PropTypes.object).isRequired,
  resources: PropTypes.arrayOf(PropTypes.object).isRequired,
  pageProps: PropTypes.any,
  profile: PropTypes.any,
};

export default ProfileScreen;
