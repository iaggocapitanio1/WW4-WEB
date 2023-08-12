/* eslint-disable react/prop-types */
//  Nodes
import CssBaseline from '@mui/material/CssBaseline';
import React, { useState } from 'react';

import Grid from '@mui/material/Grid';
import { Save, X } from 'lucide-react';
import CustomBreadcrumbs from '../../breadcrumbs';
import PrimaryBtn from '../../buttons/primaryBtn';
import Content from '../../content/content';

import { Box, ButtonGroup, Typography } from '@mui/material';
import Router from 'next/router';
import { toast } from 'react-toastify';
import routes from '../../../navigation/routes';
import Notification from '../../dialogs/Notification';
import FormGenerator from '../../formGenerator';
import Navbar from '../../layout/navbar/navbar';
import ToastSet from '../../utils/ToastSet';

const NewStock = ({ ...props }) => {
  const { breadcrumbsPath, pageProps } = props;

  const [inputFields, setInputFields] = useState([
    {
      id: 'name',
      label: 'Nome',
      value: '',
      error: '',
      required: true,
      tooltip: ''
    },
    {
      id: 'material',
      label: 'Material',
      value: '',
      error: '',
    },
    {
      id: 'warehouse',
      label: 'Armazém',
      required: true,
      value: '',
      error: '',
    },
    {
      id: 'height',
      label: 'Comprimento',
      required: false,
      value: '',
      type: 'number',
      error: '',
    },
    {
      id: 'width',
      label: 'Largura',
      required: false,
      value: '',
      type: 'number',
      error: '',
    },
    {
      id: 'thickness',
      label: 'Espessura',
      required: false,
      value: '',
      type: 'number',
      error: '',
    },
    {
      id: 'amount',
      label: 'Quantidade',
      required: true,
      value: '',
      error: '',
      type: 'number',
    },
  ]);

  const handleFormChange = (i, e) => {
    const data = [...inputFields];

    data[i].value = e.target.value;
    data[i].error = '';
    setInputFields(data);
  };

  function ValidateFields () {
    let hasErrors = false;

    // eslint-disable-next-line array-callback-return
    inputFields.map((input, i) => {
      const data = [...inputFields];

      if (input.required && input.value === '') {
        data[i].error = 'Campo Obrigatório';
        hasErrors = true;
        // Case it reaches here, validates specifiq fields and value structure
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

  function handleSave () {
    const loading = toast.loading('');

    ToastSet(loading, 'Stock adicionado.', 'success');
    Router.push(routes.private.internal.stocks);
  }

  return (
    <>
      <Notification />
      <Navbar />
      <Grid component='main' sx={{ padding: '0rem 2rem 4rem 2rem' }} >
        <CssBaseline />
        <CustomBreadcrumbs path={breadcrumbsPath} />
        <Content>
          <Grid
            container
            md={12}
            sm={12}
            xs={12}

          >
            <Grid id='pad'container md={12} sm={12} alignItems={'center'} justifyContent='space-between' >
              <Box>
                <Typography variant='title'>{breadcrumbsPath[1].title}</Typography>
              </Box>
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
            <Grid container md={12} sm={12} xs={12} p={'24px'}>
              <FormGenerator
                perRow={3}
                fields={inputFields}
                onFormChange={handleFormChange}
              />
            </Grid>
          </Grid>
        </Content>
      </Grid>
    </>
  );
};

export default NewStock;
