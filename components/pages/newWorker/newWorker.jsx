//  Nodes
import {
  Box
} from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import { Save, X } from 'lucide-react';
import Router from 'next/router';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import routes from '../../../navigation/routes';
import * as workersActionsRedux from '../../../store/actions/worker';
import CustomBreadcrumbs from '../../breadcrumbs';
import PrimaryBtn from '../../buttons/primaryBtn';
import Content from '../../content/content';
import Notification from '../../dialogs/Notification';
import FormGenerator from '../../formGenerator';
import Footer from '../../layout/footer/footer';
import Navbar from '../../layout/navbar/navbar';
import Loader from '../../loader/loader';
import EmailValidation from '../../utils/EmailValidation';
import ToastSet from '../../utils/ToastSet';

const newWorker = ({ ...props }) => {
  const { breadcrumbsPath, organizations, profiles } = props;
  const [processing, setProcessing] = useState(false);

  const [inputFields, setInputFields] = useState([
    {
      id: 'user.first_name',
      label: 'Primeiro Nome',
      value: '',
      error: '',
      required: true,
      tooltip: ''
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
      label: 'Email',
      value: '',
      error: '',
      type: 'email',
      required: true
    },
    {
      id: 'hasOrganization',
      label: 'Organização',
      value: organizations[0]?.id,
      options: organizations,
      optLabel: 'legalName',
      error: '',
      required: true,
      tooltip: '',
      hidden: true
    },
    {
      id: 'profile',
      label: 'Função',
      value: '',
      options: profiles.filter((profile) => profile.name !== 'Customers'),
      optLabel: 'name',
      error: '',
      required: true,
      tooltip: '',
    },
  ]
  );

  const dispatch = useDispatch();
  const newWorker = (data) => dispatch(workersActionsRedux.newWorker(data));
  const updateWorkerProfile = (data) => dispatch(workersActionsRedux.updateWorkersProfile(data));

  function ValidateFields () {
    let hasErrors = false;
    const data = [...inputFields];

    data.forEach((input) => {
      if (input.required && input.value === '') {
        input.error = 'Campo Obrigatório';
        hasErrors = true;
      } else if (
        input.required &&
        input.id === 'email' &&
        !EmailValidation(input.value)
      ) {
        input.error = 'Email mal estruturado';
        hasErrors = true;
      } else if (
        input?.value?.length < 9 &&
        input.type === 'phone' &&
        input.required
      ) {
        input.error = 'Número mal estruturado';
        hasErrors = true;
      } else {
        input.error = '';
      }
    });

    setInputFields(data);

    if (hasErrors) {
      toast.error('Erros no formulário');

      return true;
    }

    handleSave();
  }

  async function handleSave () {
    setProcessing(true);

    const loading = toast.loading('');

    const builtWorker = {
      active: true,
      performanceRole: 2,
    };

    // eslint-disable-next-line array-callback-return
    inputFields.map((ele) => {
      builtWorker[ele.id] = ele.value;
    });

    builtWorker['user.username'] = builtWorker['user.email'];
    builtWorker['user.password'] = 'ChangeMe';
    builtWorker['user.password_confirm'] = 'ChangeMe';
    builtWorker.hasOrganization = builtWorker.hasOrganization.replace('urn:ngsi-ld:Organization:', '');

    const profile = builtWorker.profile;

    delete builtWorker.profile;

    const qs = require('qs');
    const data = qs.stringify({ ...builtWorker });

    await newWorker(data)
      .then(async (res) => {
        await updateWorkerProfile({ id: res.data.id, data: { add_groups: [profile] } });
        ToastSet(loading, 'Utilizador Criado!', 'success');
        setProcessing(false);
        Router.push(routes.private.internal.worker + res.data.id);
      }).catch((error) => {
        const errorKeys = Object.keys(error.response.data);

        setProcessing(false);

        const updatedFields = inputFields.map((field) => {
          const [key, subKey] = field.id.split('.');

          if (errorKeys.includes(key) && error.response.data[key][subKey]) {
            switch (error.response.data[key][subKey][0]) {
            case 'A user with that username already exists.':
              return { ...field, error: 'Já existe um utilizador com este Nome de Utilizador.' };
            case 'User with this email address already exists.':
              return { ...field, error: 'Já existe um utilizador com este Email.' };
            case 'This field is required.':
              return { ...field, error: 'Campo Obrigatório.' };
            default:
              return { ...field, error: error.response.data[key][subKey][0] };
            }
          }

          return field;
        });

        setInputFields(updatedFields);

        if (error.response.status === 400) {
          ToastSet(loading, 'Erros no formulário.', 'error');
        } else {
          ToastSet(loading, 'Algo aconteceu. Por favor tente mais tarde.', 'error');
        }
      });
  }

  const handleFormChange = (i, e) => {
    setInputFields(prevInputFields => {
      const data = [...prevInputFields];

      data[i].value = e.target.value;
      data[i].error = '';

      return data;
    });
  };

  return (
    <>
      <Navbar />
      <Grid component='main' sx={{ padding: '0rem 2rem 4rem 2rem' }}>
        <CssBaseline />
        <Notification />

        {processing && <Loader center={true} backdrop />}
        <CustomBreadcrumbs path={breadcrumbsPath} />
        <Content>
          <div
            id='pad'
            className='flex'
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <div id='align' style={{ flex: 1 }}>
              <a className='headerTitleXl'>{breadcrumbsPath[1].title}</a>
            </div>
            <div style={{ display: 'flex' }}>
              <PrimaryBtn
                text='Guardar'
                icon={<Save strokeWidth='1' />}
                onClick={ValidateFields}
              />
              <PrimaryBtn
                text='Cancelar'
                icon={<X strokeWidth='1' />}
                light
                onClick={() => Router.back()}
              />
            </div>
          </div>
          <Box>
            {/* Input Fields Generator */}
            <Grid container p={'12px'}>
              <FormGenerator
                perRow={3}
                fields={inputFields}
                onFormChange={handleFormChange}
              />
            </Grid>
          </Box>
        </Content>
      </Grid>
      <Footer/>
    </>
  );
};

export default newWorker;
