//  Nodes
import {
  Box, ButtonGroup, Typography
} from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import { Save, X } from 'lucide-react';
import Router from 'next/router';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import routes from '../../../navigation/routes';
import * as machinesActionsRedux from '../../../store/actions/machine';
import CustomBreadcrumbs from '../../breadcrumbs';
import PrimaryBtn from '../../buttons/primaryBtn';
import Content from '../../content/content';
import Notification from '../../dialogs/Notification';
import FormGenerator from '../../formGenerator';
import Footer from '../../layout/footer/footer';
import Navbar from '../../layout/navbar/navbar';
import Loader from '../../loader/loader';
import EmailValidation from '../../utils/EmailValidation';
import formatString from '../../utils/FormatString';
import ToastSet from '../../utils/ToastSet';

const EditMachineScreen = ({ ...props }) => {
  const { breadcrumbsPath, machine } = props;
  const [processing, setProcessing] = useState(false);

  const [inputFields, setInputFields] = useState([
    {
      id: 'name',
      label: 'Nome',
      value: machine.name.value,
      error: '',
      required: true,
      tooltip: ''
    },
    {
      id: 'machineType',
      label: 'Tipo',
      value: machine.machineType.value,
      error: '',
      tooltip: '',
      required: true
    },

  ]
  );

  const dispatch = useDispatch();
  const updateMachine = (data) => dispatch(machinesActionsRedux.updateMachine(data));

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

    const builtMachine = {
      type: 'Machine'
    };

    // eslint-disable-next-line array-callback-return
    inputFields.map((ele) => {
      builtMachine[ele.id] = { type: 'Property', value: ele.value };
    });

    builtMachine.id = 'urn:ngsi-ld:Machine:' + formatString(builtMachine.name.value);

    await updateMachine({ id: machine.id, data: builtMachine })
      .then(async (res) => {
        ToastSet(loading, 'Máquina Atualizada!', 'success');
        setProcessing(false);
        Router.push(routes.private.internal.machine + res.data.id);
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
          <Box
            id='pad'
            className='flex'
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <Box id='align' style={{ flex: 1 }}>
              <Typography variant='title'>{breadcrumbsPath[1].title}</Typography>
            </Box>
            <Box >
              <ButtonGroup>
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
              </ButtonGroup>
            </Box>
          </Box>
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

EditMachineScreen.propTypes = {
  pageProps: PropTypes.any,
  breadcrumbsPath: PropTypes.any,
  machine: PropTypes.any,
};

export default EditMachineScreen;
