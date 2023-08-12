/* eslint-disable react/prop-types */
/* eslint-disable no-return-assign */
/* eslint-disable array-callback-return */
//  Nodes
import CssBaseline from '@mui/material/CssBaseline';
import React, { useState } from 'react';

import Grid from '@mui/material/Grid';
import CustomBreadcrumbs from '../../breadcrumbs';
import PrimaryBtn from '../../buttons/primaryBtn';
import Content from '../../content/content';

//  PropTypes

import {
  Box, ButtonGroup,
  Typography
} from '@mui/material';
import { Save, X } from 'lucide-react';
import Router from 'next/router';
import { toast } from 'react-toastify';
import * as clientsActionsRedux from '../../../store/actions/client';
import ConfirmDialog from '../../dialogs/ConfirmDialog';
import Notification from '../../dialogs/Notification';
import FormGenerator from '../../formGenerator';
import EmailValidation from '../../utils/EmailValidation';

//  PropTypes
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import routes from '../../../navigation/routes';
import Footer from '../../layout/footer/footer';
import Navbar from '../../layout/navbar/navbar';
import ToastSet from '../../utils/ToastSet';

const NewClient = ({ ...props }) => {
  const {
    breadcrumbsPath, pageProps
    // profiles
  } = props;

  const dispatch = useDispatch();
  const newClient = (data) => dispatch(clientsActionsRedux.newClient(data));
  //  Dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  //  Errors states
  const [generatePassword, setGeneratePassword] = useState(true);

  const [inputFields, setInputFields] = useState(
    [
      {
        id: 'user.first_name',
        label: 'Primeiro Nome',
        value: '',
        error: '',
        required: true,
        tooltip: '',
      },
      {
        id: 'user.last_name',
        label: 'Último Nome',
        value: '',
        error: '',
        tooltip: ''
      },
      {
        id: 'user.email',
        type: 'email',
        label: 'Email',
        value: '',
        error: '',
        required: true,
        tooltip: '',

      },
      {
        id: 'address.streetAddress',
        label: 'Rua',
        value: '',
        error: '',
        required: true,
        tooltip: '',
        maxLength: 50
      },
      {
        id: 'address.postalCode',
        label: 'Código Postal',
        value: '',
        error: '',
        required: true,
        tooltip: '',
        maxLength: 15
      },
      {
        id: 'address.addressLocality',
        label: 'Localidade',
        value: '',
        error: '',
        required: true,
        maxLength: 25,
      },
      {
        id: 'address.addressRegion',
        label: 'Região',
        value: '',
        error: '',
        required: false,
        maxLength: 25,
      },
      {
        id: 'address.addressCountry',
        label: 'País',
        value: '',
        error: '',
        type: 'country',
        required: true,
      },
      {
        id: 'isCompany',
        label: 'Particular',
        value: false,
        error: '',
        required: true,
        tooltip: '',
        type: 'checkbox',
      },
      {
        id: 'delivery_address.streetAddress',
        label: 'Rua de Entrega',
        value: '',
        error: '',
        tooltip: '',
        maxLength: 50,
        hidden: true,
      },
      {
        id: 'delivery_address.postalCode',
        label: 'Código Postal de Entrega',
        value: '',
        error: '',
        tooltip: '',
        maxLength: 15,
        hidden: true,
      },
      {
        id: 'delivery_address.addressLocality',
        label: 'Localidade de Entrega',
        value: '',
        error: '',
        maxLength: 25,
        hidden: true,
      },
      {
        id: 'delivery_address.addressRegion',
        label: 'Região de Entrega',
        value: '',
        error: '',
        maxLength: 25,
        hidden: true,
      },
      {
        id: 'delivery_address.addressCountry',
        label: 'País de Entrega',
        value: '',
        error: '',
        type: 'country',
        hidden: true,
      },
    ]
  );

  function ValidateFields () {
    let hasErrors = false;

    inputFields.map((input, i) => {
      const data = [...inputFields];

      if (input.type === 'password') {
        if (!generatePassword && input.value === '') {
          data[i].error = 'Campo Obrigatório';
          hasErrors = true;
        }
      } else if (input.required && input.value === '') {
        data[i].error = 'Campo Obrigatório';
        hasErrors = true;
        // Case it reaches here, validates specifiq fields and value structure
      } else if (input.required && input.id === 'email' && !EmailValidation(input.value)) {
        data[i].error = 'Email mal estruturado';
        hasErrors = true;
      } else if (String(input.value).replace(/ /g, '').length !== 9 && input.type === 'phone' && input.required) {
        data[i].error = 'Número mal estruturado';
        hasErrors = true;
      } else data[i].error = '';

      setInputFields(data);
    });

    if (hasErrors) {
      toast.error('Erros no formulário');

      return true;
    }

    handleSave();
  }

  async function handleSave () {
    const loading = toast.loading('');
    const qs = require('qs');

    const builtClient2 = {
      active: false,
      tos: false,
    };

    inputFields.map((ele) => {
      if (ele.type === 'checkbox') ele.value = !ele.value;

      if (ele.value !== '') {
        builtClient2[ele.id] = {};
        builtClient2[ele.id] = ele.value;
      }
    });

    builtClient2['user.username'] = builtClient2['user.email'];
    builtClient2['delivery_address.streetAddress'] = builtClient2['address.streetAddress'];
    builtClient2['delivery_address.postalCode'] = builtClient2['address.postalCode'];
    builtClient2['delivery_address.addressLocality'] = builtClient2['address.addressLocality'];
    builtClient2['delivery_address.addressRegion'] = builtClient2['address.addressRegion'];
    builtClient2['delivery_address.addressCountry'] = builtClient2['address.addressCountry'];
    builtClient2.country = builtClient2['address.addressCountry'];

    const data = qs.stringify({ ...builtClient2 });

    // eslint-disable-next-line consistent-return
    await newClient(data).then((res) => {
      if (res?.response?.status === 400) return onError(res, loading);

      ToastSet(loading, 'Cliente Criado!', 'success');
      Router.push(routes.private.internal.client + res.data.id);
    }).catch((err) => {
      onError(err, loading);
    });

    setDialogOpen(false);
  }

  function onError (error, loading) {
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
          case 'Enter a valid email address.':
            return { ...field, error: 'Email inválido' };
          case 'This field is required.':
            return { ...field, error: 'Campo Obrigatório.' };
          case 'Ensure this field has no more than 15 characters.':
            return { ...field, error: 'Tamanho máximo de 15 caracteres.' };
          case 'Ensure this field has no more than 50 characters.':
            return { ...field, error: 'Tamanho máximo de 50 caracteres.' };
          case '[\'Zip codes must be in the format XYYY-YYY (where X is a digit between 1 and 9 and Y is any other digit).\']':
            return { ...field, error: 'Mal formatado.' };
          case 'Enter a valid username. This value may contain only letters, numbers, and @/./+/-/_ characters.':
            return { ...field, error: 'Só pode conter letras, números e @/./+/-/_' };
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
      ToastSet(loading, 'Erros no formulário.', 'warning');
    } else {
      ToastSet(loading, 'Algo aconteceu. Por favor tente mais tarde.', 'error');
    }
  }

  const handleFormChange = (i, e) => {
    const data = [...inputFields];

    if (e.target.type === 'checkbox') {
      data[i].value = e.target.checked;
    } else data[i].value = e.target.value;

    data[i].error = '';
    setInputFields(data);
  };

  return (
    <>
      <Navbar />
      <Grid component='main' sx={{ padding: '0rem 2rem 4rem 2rem' }}>
        <CssBaseline />
        <Notification />
        <CustomBreadcrumbs path={breadcrumbsPath} />
        {/* Situational Panels */}
        <ConfirmDialog
          open={dialogOpen}
          handleClose={() => setDialogOpen(false)}
          onConfirm={() => handleSave()}
          message='Está prestes a criar um novo cliente, tem certeza que quer continuar?'
          icon='AlertOctagon'
        />
        <Content>
          <Box fullWidth sx={{ p: '24px', display: 'flex', alignItems: 'center' }}>
            <Typography variant='title'>Novo Cliente</Typography>
            <Box sx={{ marginLeft: 'auto' }}>
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
            </Box>
          </Box>
          <Grid container sx={{ padding: '24px' }}>
            <FormGenerator
              fields={inputFields}
              perRow={3}
              onFormChange={handleFormChange}
              optionalData={{
                generatePassword,
                setGeneratePassword,
              }}
            />
          </Grid>
        </Content>
      </Grid>
      <Footer/>
    </>
  );
};

NewClient.propTypes = {
  pageProps: PropTypes.object,
  breadcrumbsPath: PropTypes.array,
  organizations: PropTypes.array,
};

export default NewClient;
