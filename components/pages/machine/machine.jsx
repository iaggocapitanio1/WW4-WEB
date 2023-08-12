//  Nodes
import {
  Box,
  Typography
} from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import { Edit2, Trash } from 'lucide-react';
import Router from 'next/router';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import routes from '../../../navigation/routes';
import * as machinesActionsRedux from '../../../store/actions/machine';
import AdvancedTable from '../../advancedTable/AdvancedTable';
import CustomBreadcrumbs from '../../breadcrumbs';
import Buttons from '../../buttons/Buttons';
import Content from '../../content/content';
import ConfirmDialog from '../../dialogs/ConfirmDialog';
import Notification from '../../dialogs/Notification';
import Footer from '../../layout/footer/footer';
import Navbar from '../../layout/navbar/navbar';
import CanDo from '../../utils/CanDo';
import ToastSet from '../../utils/ToastSet';

const MachineScreen = ({ ...props }) => {
  const { breadcrumbsPath, pageProps, machine, machineActivity, headCells } = props;
  const [dialogOpen, setDialogOpen] = useState(false);
  const dispatch = useDispatch();
  const deleteMachine = (data) => dispatch(machinesActionsRedux.deleteMachine(data));

  async function onDelete () {
    const loading = toast.loading('');

    await deleteMachine(machine.id).then(() => {
      ToastSet(loading, 'Máquina Apagada.', 'success');
      Router.push(routes.private.internal.machines);
    }).catch((err) => {
      ToastSet(loading, 'Algo aconteceu. Por favor tente mais tarde.', 'error');
      console.log(err);
    });
  }

  const canChangeMachine = CanDo('update_machine');
  const canDeleteMachine = CanDo('delete_machine');

  return (
    <>
      <ConfirmDialog
        open={dialogOpen}
        handleClose={() => setDialogOpen(false)}
        onConfirm={() => onDelete()}
        message={'Está prestes a apagar uma máquina o que é irreversível, tem certeza que quer continuar?'}
      />
      <Navbar />
      <Grid component='main' sx={{ padding: '0rem 2rem 4rem 2rem' }}>
        <CssBaseline />
        <Notification />
        <CustomBreadcrumbs path={breadcrumbsPath} />
        <Content>
          <Grid id='pad' md={12} sm={12} xs={12} >
            <Grid container md={12} justifyContent={'space-between'} alignItems={'center'} >
              <Box >
                <Box id='align'>
                  <Typography variant='title'>{breadcrumbsPath[1].title}</Typography>
                  <Box pl={2} display='flex' alignItems='center'>
                    {machine.currentlyOn?.value && <Typography variant='sm' className="packingBalloon">Em utilização</Typography>}
                    {!machine.currentlyOn?.value && <Typography variant='sm' className="successBalloon">Disponível</Typography>}
                  </Box>
                </Box>
              </Box>
              <Buttons
                buttons={[
                  {
                    text: 'Editar',
                    icon: <Edit2
                      strokeWidth={pageProps?.globalVars?.iconSmStrokeWidth || 1.5}
                      size={pageProps?.globalVars?.iconSize || 20}
                    />,
                    color: 'primary',
                    href: routes.private.internal.editMachine + machine.id,
                    hidden: !canChangeMachine

                  },
                  {
                    text: 'Apagar',
                    icon: <Trash strokeWidth={pageProps?.globalVars?.iconSmStrokeWidth || 1.5} size={pageProps?.globalVars?.iconSize || 20}/>,
                    color: 'error',
                    onClick: () => setDialogOpen(true),
                    hidden: !canDeleteMachine,
                    light: true,
                  },
                ]}
              />
            </Grid>
          </Grid>
          <Grid id='pad' container md={12} sm={12} xs={12} >
            <Grid item md={6} sm={6} xs={12} pb={1} pt={1} >
              <Typography item variant="subtitle2"color='lightTextSm.main'>Tipo</Typography>
              <Typography item variant="subtitle2"color='lightTextSm.black' >{machine?.machineType?.value }</Typography>
            </Grid>
          </Grid>
        </Content>
        <Content>
          <Grid container md={12} sm={12} xs={12} >
            <Grid id='pad' container md={12} sm={12} xs={12} >
              <Typography variant='title'>Atividade</Typography>
            </Grid>
            <AdvancedTable
              rows={machineActivity}
              headCells={headCells}
            />
          </Grid>
        </Content>
      </Grid>
      <Footer/>
    </>
  );
};

MachineScreen.propTypes = {
  breadcrumbsPath: PropTypes.arrayOf(PropTypes.object).isRequired,
  machineActivity: PropTypes.arrayOf(PropTypes.object).isRequired,
  headCells: PropTypes.arrayOf(PropTypes.object).isRequired,
  machine: PropTypes.object.isRequired,
  pageProps: PropTypes.any,
};

export default MachineScreen;
