/* eslint-disable react/prop-types */
/* eslint-disable array-callback-return */
//  Nodes
import React, { useState } from 'react';
import { toast } from 'react-toastify';

//  Mui
import {
  ButtonGroup, Grid, Typography
} from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';

//  Custom components
import CustomBreadcrumbs from '../../breadcrumbs';
import PrimaryBtn from '../../buttons/primaryBtn';
import Content from '../../content/content';
import ConfirmDialog from '../../dialogs/ConfirmDialog';
import Notification from '../../dialogs/Notification';
import Loader from '../../loader/loader';

//  PropTypes
import PropTypes from 'prop-types';

//  Icons
import { Edit2, Save, User, X } from 'lucide-react';
import Router from 'next/router';

//  Styles
import styles from '../../../styles/NewOrder.module.css';

//  FormGenerator
import FormGenerator from '../../formGenerator';

import { useDispatch } from 'react-redux';
import routes from '../../../navigation/routes';
import * as ClientsActionsRedux from '../../../store/actions/client';
import Footer from '../../layout/footer/footer';
import Navbar from '../../layout/navbar/navbar';

const EditClient = ({ ...props }) => {
  const { breadcrumbsPath, pageProps, client } = props;
  //  Dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const processing = false;
  // const [processing, setProcessing] = useState(false);
  const dispatch = useDispatch();
  const updateClient = (data) => dispatch(ClientsActionsRedux.updateClient(data));

  const [inputFields, setInputFields] = useState(
    [
      {
        id: 'user.first_name',
        label: 'Primeiro Nome',
        value: client.user.first_name,
        error: '',
        required: true,
        tooltip: ''
      },
      {
        id: 'user.last_name',
        label: 'Último Nome',
        value: client.user.last_name,
        error: '',
        tooltip: ''
      },
      {
        id: 'user.email',
        type: 'email',
        label: 'Email',
        value: client.user.email,
        error: '',
        disabled: true,
        required: true,
        tooltip: '',
        lineBreak: true,
      },
      {
        id: 'address.streetAddress',
        label: 'Rua',
        value: client.address.streetAddress,
        error: '',
        required: true,
        tooltip: '',
        maxLength: 50
      },
      {
        id: 'address.postalCode',
        label: 'Código Postal',
        value: client.address.postalCode,
        error: '',
        required: true,
        tooltip: '',
        maxLength: 15
      },
      {
        id: 'address.addressLocality',
        label: 'Localidade',
        value: client.address.addressLocality,
        error: '',
        required: true,

      },
      {
        id: 'address.addressRegion',
        label: 'Região',
        value: client.address.addressRegion,
        error: '',

      },
      {
        id: 'address.addressCountry',
        label: 'País',
        value: client.address.addressCountry,
        error: '',
        required: true,
        type: 'country',
        lineBreak: true,
      },
      {
        id: 'delivery_address.streetAddress',
        label: 'Rua de Entrega',
        value: client.delivery_address.streetAddress,
        error: '',
        required: true,
        tooltip: '',
        maxLength: 50,
        hidden: true,
      },
      {
        id: 'delivery_address.postalCode',
        label: 'Código Postal de Entrega',
        value: client.delivery_address.postalCode,
        error: '',
        required: true,
        tooltip: '',
        maxLength: 15,
        hidden: true,
      },
      {
        id: 'delivery_address.addressLocality',
        label: 'Localidade de Entrega',
        value: client.delivery_address.addressLocality,
        error: '',
        required: true,
        maxLength: 25,
        hidden: true,

      },
      {
        id: 'delivery_address.addressRegion',
        label: 'Região de Entrega',
        value: client.delivery_address.addressRegion,
        error: '',
        maxLength: 25,
        hidden: true,
      },
      {
        id: 'delivery_address.addressCountry',
        label: 'País de Entrega',
        value: client.delivery_address.addressCountry,
        error: '',
        required: true,
        type: 'country',
        hidden: true,
      },
    ]
  );

  const handleFormChange = (i, e) => {
    const data = [...inputFields];

    data[i].value = e.target.value;
    data[i].error = '';
    setInputFields(data);
  };

  function ValidateFields () {
    let hasErrors = false;

    inputFields.map((input, i) => {
      const data = [...inputFields];

      if (input.required && input.value === '') {
        data[i].error = 'Campo Obrigatório';
        hasErrors = true;
        // Case it reaches here, validates specifiq fields and value structure
      } else if ((input.value?.length !== 11 && input.value?.length !== 9) && input.type === 'phone' && input.required) {
        data[i].error = 'Número mal estruturado';
        hasErrors = true;
      }

      setInputFields(data);
    });

    if (hasErrors) {
      toast.error('Prencha todos os campos.');

      return true;
    }

    handleSave();
  }

  async function handleSave () {
    const builtClient = {
      id: client?.id.replace('urn:ngsi-ld:Owner:', ''),
    };

    const formData = new FormData();

    inputFields.map((ele) => {
      builtClient[ele.id] = {};

      if (ele.id !== 'user.email') formData.append(ele.id, ele.value);

      builtClient[ele.id] = ele.value;
    });

    await updateClient({ data: formData, id: client?.id })
      .then(() => {
        toast.success('Atualizado.');
        Router.push(routes.private.internal.client + builtClient.id);
      })
      .catch((err) => {
        onError(err);
      });
  }

  function onError (error) {
    const errorKeys = Object.keys(error.response.data);

    const updatedFields = inputFields.map((field) => {
      const [key, subKey] = field.id.split('.');

      if (errorKeys.includes(key)) {
        if (subKey && error.response.data[key][subKey]) {
          switch (error.response.data[key][subKey][0]) {
          case 'A user with that username already exists.':
            return { ...field, error: 'Já existe um utilizador com este Nome de Utilizador.' };
          case 'User with this email address already exists.':
            return { ...field, error: 'Já existe um utilizador com este Email.' };
          case 'This field is required.':
            return { ...field, error: 'Campo Obrigatório.' };
          case 'Ensure this field has no more than 50 characters.':
            return { ...field, error: 'Tamanho máximo de 50 caracteres atingido.' };
          case '[\'Zip codes must be in the format XYYY-YYY (where X is a digit between 1 and 9 and Y is any other digit).\']':
            return { ...field, error: 'Mal formatado.' };
          default:
            return { ...field, error: error.response.data[key][subKey][0] };
          }
        } else if (!subKey && error.response.data[key]) {
          switch (error.response.data[key][0]) {
          case 'The vat number already exists.':
            return { ...field, error: 'Já existe um utilizador com este número.' };
          case 'Invalid tax ID':
            return { ...field, error: 'Número inválido' };
          default:
            return { ...field, error: error.response.data[key][0] };
          }
        }
      }

      return field;
    });

    setInputFields(updatedFields);

    if (error.response.status === 400) {
      toast.warning('Erros no formulário.');
    } else {
      toast.error('Algo aconteceu. Por favor tente mais tarde.');
    }
  }

  return (
    <>
      <Navbar />
      <Grid component='main' sx={{ padding: '0rem 2rem 4rem 2rem' }}>
        <CssBaseline />
        <Notification />
        <CustomBreadcrumbs path={breadcrumbsPath} />

        <ConfirmDialog
          open={dialogOpen}
          handleClose={() => setDialogOpen(false)}
          handleSave={() => handleSave()}
          icon='AlertOctagon'
          message={'Está prestes a alterar a informação do cliente, tem certeza que quer continuar?'}
        />
        {processing && <Loader center={true} backdrop />}
        <Content>
          <Grid container md={12} sm={12} xs={12} sx={{ p: '24px', alignItems: 'center' }}>
            <Typography variant='title'>{client?.user?.first_name + ' ' + client?.user?.last_name} - {client.isCompany ? 'Empresarial' : 'Particular'} </Typography>
            <Grid container justifyContent={{ md: 'end', sm: 'end', xs: 'center' }} sx={{ marginLeft: 'auto' }} >
              <ButtonGroup>
                <PrimaryBtn
                  text='Guardar'
                  icon={
                    <Save
                      strokeWidth={pageProps?.globalVars?.iconStrokeWidth || 1}
                      size={pageProps?.globalVars?.iconSize || 20}
                    />
                  }
                  onClick={ValidateFields}
                />
                <PrimaryBtn
                  text='Cancelar'
                  icon={
                    <X
                      strokeWidth={pageProps?.globalVars?.iconStrokeWidth || 1}
                      size={pageProps?.globalVars?.iconSize || 20}
                    />
                  }
                  light
                  onClick={() => Router.back()}
                />
              </ButtonGroup>
            </Grid>
          </Grid>
          <Grid container sx={{ padding: '24px' }}>
            <Grid item md={12} sm={12} xs={12} >

              <Grid item xs={12} md={6} sx={{ paddingRight: '.5rem' }}>
                <Typography id='align' item className='lightTextSm'>
                  <User
                    strokeWidth={pageProps?.globalVars?.iconSmStrokeWidth || 1.5}
                    size={pageProps?.globalVars?.iconSize || 20}
                  />
              Dados Gerais
                </Typography>
              </Grid>
              <FormGenerator
                perRow={3}
                fields={inputFields}
                onFormChange={handleFormChange}
              />
            </Grid>
            <Grid item md={4} sm={4} xs={12} sx={{ display: 'none' }} bgcolor={'lightGray.main'} className={styles.clientContainer}>

              <Grid container item sx={{ paddingRight: '.5rem', display: 'none' }}>
                <Typography id='align' className='lightTextSm'>
                  <Edit2
                    strokeWidth={pageProps?.globalVars?.iconSmStrokeWidth || 1.5}
                    size={pageProps?.globalVars?.iconSize || 20}
                  />
                  Dados de Faturação
                </Typography>
              </Grid>

            </Grid>
          </Grid>

        </Content>
      </Grid>
      <Footer/>
    </>
  );
};

EditClient.propTypes = {
  breadcrumbsPath: PropTypes.array.isRequired,
  client: PropTypes.object.isRequired,
  detailPage: PropTypes.string.isRequired,
  organizations: PropTypes.any,
  pageProps: PropTypes.any,
};

export default EditClient;
