//  Nodes
import Router from 'next/router';
import React, { useState } from 'react';

//  Custom Components
import * as workersActionsRedux from '../../../store/actions/worker';
import CustomBreadcrumbs from '../../breadcrumbs';
import PrimaryBtn from '../../buttons/primaryBtn';
import Content from '../../content/content';

//  PropTypes
import PropTypes from 'prop-types';

//  Styles

//  Icons
import { Save, User, X } from 'lucide-react';

//  Material UI
import {
  Box, Typography
} from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';

//  Utlis
import ToastSet from '../../utils/ToastSet';

//  Navigation
import Notification from '../../dialogs/Notification';
// import PhoneInput from '../../inputs/phoneInput/PhoneInput';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import routes from '../../../navigation/routes';
import FormGenerator from '../../formGenerator';
import Footer from '../../layout/footer/footer';
import Navbar from '../../layout/navbar/navbar';
import EmailValidation from '../../utils/EmailValidation';

const EditUser = ({ ...props }) => {
  const { breadcrumbsPath, pageProps, profiles } = props;
  const dispatch = useDispatch();
  const updateWorker = (data) => dispatch(workersActionsRedux.updateWorker(data));
  const updateWorkerProfile = (data) => dispatch(workersActionsRedux.updateWorkersProfile(data));

  const [inputFields, setInputFields] = useState([
    {
      id: 'user.first_name',
      label: 'Primeiro Nome',
      value: props.user.user.first_name,
      error: '',
      required: true,
      tooltip: ''
    },
    {
      id: 'user.last_name',
      label: 'Último Nome',
      value: props.user.user.last_name,
      error: '',
      tooltip: ''
    },
    {
      id: 'user.email',
      label: 'Email',
      value: props.user.user.email,
      error: '',
      type: 'email',
      required: true,
      disabled: true,
    },
    {
      id: 'profile',
      label: 'Função',
      value: props.user.user.orion_groups[0]?.id,
      options: profiles.sort((a, b) => (a.name > b.name) ? 1 : -1),
      optLabel: 'name',
      error: '',
      required: true,
      tooltip: '',
    },
  ]
  );

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

    handleUpdate();
  }

  async function handleUpdate () {
    const loading = toast.loading('');
    const formData = new FormData();
    let profile = '';

    // eslint-disable-next-line array-callback-return
    inputFields.map((field) => {
      if (field.id === 'profile') {
        profile = field.value;
      } else formData.append(field.id, field.value);
    });

    await updateWorker({ data: formData, id: props?.user?.id.replace('urn:ngsi-ld:Worker:', '') })
      .then(async (res) => {
        await updateWorkerProfile({ id: res.data.id, data: { add_groups: [profile] } }).then(() => {
          ToastSet(loading, 'Utilizador atualizado!', 'success');
          Router.push(routes.private.internal.worker + props.user.id);
        });
      })
      .catch(() => {
        ToastSet(loading, 'Algo aconteceu. Por favor tente mais tarde.', 'error');
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
        <CustomBreadcrumbs path={breadcrumbsPath} />
        <Notification />
        <Content>
          <Box
            id='pad'
            className='flex'
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <Box id='align' style={{ flex: 1 }}>
              <Typography variant='title'>{breadcrumbsPath[1].title} </Typography>
            </Box>
            <Box style={{ display: 'flex' }}>
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
            </Box>
          </Box>
          <a id='align' className='lightTextSm' style={{ paddingLeft: '24px' }}>
            <User
              strokeWidth={pageProps?.globalVars?.iconStrokeWidth || 1}
              size={pageProps?.globalVars?.iconSize || 20} />
            <span>Dados de Utilizador</span>
          </a>
          <Grid id='pad' container md={12} sm={12} xs={12}>
            <FormGenerator
              perRow={3}
              fields={inputFields}
              onFormChange={handleFormChange}
            />
          </Grid>
        </Content>
      </Grid>
      <Footer/>
    </>
  );
};

EditUser.propTypes = {
  breadcrumbsPath: PropTypes.array.isRequired,
  countries: PropTypes.array.isRequired,
  user: PropTypes.object,
  pageProps: PropTypes.any,
  profiles: PropTypes.arrayOf(PropTypes.object)
};

export default EditUser;
