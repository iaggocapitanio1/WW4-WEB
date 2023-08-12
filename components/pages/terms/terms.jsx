/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-irregular-whitespace */
/* eslint-disable react/prop-types */
//  Nodes
import { Accordion, AccordionDetails, AccordionSummary, Checkbox, FormControlLabel } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';
import styles from '../../../styles/SignIn.module.css';
import Footer from '../../layout/footer/footer';

//  Navigation
import { ChevronDown, ChevronLeft, LogOut } from 'lucide-react';
import Image from 'next/image';
import Router from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import backgroundImg from '../../../public/Log_In.jpg';
import { logout } from '../../../store/actions/auth';
import * as ClientsActionsRedux from '../../../store/actions/client';
// import companyLogo from '../../../public/Logotipo_Vetorizado.png';
import { toast } from 'react-toastify';
import routes from '../../../navigation/routes';
import companyLogo from '../../../public/Logotipo_Vetorizado.png';
import Notification from '../../dialogs/Notification';

const Terms = ({ ...props }) => {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [windowWidth, setWindowHeight] = useState();
  // eslint-disable-next-line react/prop-types
  const { readOnly } = props;
  const dispatch = useDispatch();
  const acceptTos = (data) => dispatch(ClientsActionsRedux.acceptTos(data));
  const getCustomer = (data) => dispatch(ClientsActionsRedux.getCustomer(data));
  const reduxState = useSelector((state) => state);

  if (typeof window !== 'undefined') {
    useEffect(() => {
      setWindowHeight(window.innerWidth);
    }, [window.innerWidth]);
  }

  const listenToResize = () => {
    setWindowHeight(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', listenToResize);

    return () => window.removeEventListener('resize', listenToResize);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();

    formData.append('tos', false);

    await getCustomer({ data: { user_id: reduxState.auth.me?.id } }).then(async (res) => {
      await acceptTos({ data: { tos: true }, id: res.data.customer })
        .then(() => {
          Router.push(routes.private.projects);
        })
        .catch(() => {
          toast.error('Algo aconteceu. Por favor tente mais tarde');
        });
    });

    // const data = new FormData(event.currentTarget);
  };

  const [expanded, setExpanded] = React.useState('panel1');

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <Grid container component='main' sx={{ height: '100%', width: '100%' }}>
      <CssBaseline />
      <Notification />
      {windowWidth > 600 && <Grid item xs={0} sm={6} md={7}>
        <div
          style={{
            position: 'absolute',
            zIndex: -1,
            overflow: 'hidden',
            width: '100%',
            height: '100%',
          }}
        >
          <Image
            src={backgroundImg}
            alt='Background Image'
            layout='fill'
            placeholder="blur"
            priority
          />
        </div>
        <Box
          className={styles.logo}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
          }}
        >
          <div className={styles.logoImg}>
            <div
              style={{
                width: '300px',
                height: '300px',
                position: 'absolute',
              }}
            ></div>
          </div>
        </Box>
      </Grid> }
      <Grid item xs={12} sm={6} md={5} component={Paper} elevation={24} square>
        {readOnly && (
          <div >
            <Button
              onClick={() => Router.back()}
              style={{ textTransform: 'none', color: 'inherit' }}
            >
              <ChevronLeft />
              <a>Voltar</a>
            </Button>
          </div>
        )}
        <Box
          style={{ width: windowWidth > 600 ? '80px' : '50px', position: 'absolute', right: '25px', top: '25px' }}
        >
          <a
            target='#'
            href='http://mofreita.com/'
          >
            <Image
              width={windowWidth > 600 ? 80 : 50}
              alt='Company Logo'
              src={companyLogo}
              placeholder='blur'
            />
          </a>
        </Box>
        <Box
          sx={{
            mx: '10%',
            mt: '10%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'start',
          }}
        >
          <Typography color={'primary'}>Portal Cliente WW4.0</Typography>
          <Typography variant='titlexxl'>
            Termos e Condições
          </Typography>

          <Box style={{
            maxHeight: readOnly ? '68vh' : '50vh',
            overflow: 'scroll',
            overflowX: 'hidden',
          }}>
            <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
              <AccordionSummary aria-controls="panel1d-content" id="panel1d-header" expandIcon={<ChevronDown />}>
                <Typography>1. Propósito e alcance da plataforma</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  <p><span style={{ color: 'rgb(68, 68, 68)' }}>As presentes Condições Gerais de Contratação e Utilização, aplicam-se aos utilizadores de<a href=" https://ww40.mofreita.pt" target='#'> https://ww40.mofreita.pt</a> bem como a quaisquer interações efetuadas através deste Portal. A navegação no Portal, bem como a submissão de qualquer informação implica a aceitação das presentes Condições Gerais de Contratação e Utilização por parte do utilizador ou cliente. A Mofreita reserva-se no direito de alterar os presentes Termos Gerais de Condições e Utilização sem aviso prévio. Quaisquer alterações serão publicadas no website<a href=" https://ww40.mofreita.pt" target='#'> https://ww40.mofreita.pt</a>/.</span></p>
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')} >
              <AccordionSummary aria-controls="panel2d-content" id="panel2d-header" expandIcon={<ChevronDown />}>
                <Typography>2. Condições</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <p><span style={{ color: 'rgb(68, 68, 68)' }}>O acesso a este website é permitido a título temporário, reservando-se à Mofreita, o direito de cancelar ou modificar os serviços sem aviso prévio. A Mofreita não se responsabiliza se, por qualquer motivo este site estiver temporariamente indisponível, podendo eventualmente restringir o acesso a algumas áreas do mesmo.
A Mofreita não se responsabiliza por danos ou prejuízos decorrentes de qualquer utilização de qualquer informação contida neste website.
                </span></p>
              </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')} >
              <AccordionSummary aria-controls="panel3d-content" id="panel3d-header" expandIcon={<ChevronDown />}>
                <Typography>3. Conteúdo </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <p><span style={{ color: 'rgb(68, 68, 68)' }}>A reprodução, transferência, distribuição ou armazenamento dos conteúdos do website<a href=" https://ww40.mofreita.pt" target='#'> https://ww40.mofreita.pt</a>/ sem autorização prévia escrita concedida pela “Mofreita”, é proibida para outros fins que não o uso estritamente pessoal.
A Mofreita, reserva-se no direito de modificar, a qualquer momento, a informação e a apresentada sobre: produtos, preços e projetos/encomendas.
É expressamente proibida a utilização de links do presente website, independentemente do fim pretendido, sem autorização prévia da Mofreita. A utilização do domínio<a href=" https://ww40.mofreita.pt" target='#'> https://ww40.mofreita.pt</a>/ com fins abusivos, e sem autorização prévia, é suscetível de recurso aos meios legais competentes por parte da Mofreita.
A Mofreita é responsável, direta ou indiretamente, por toda a informação e conteúdo deste Portal.
                </span></p>
              </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')} >
              <AccordionSummary aria-controls="panel4d-content" id="panel4d-header" expandIcon={<ChevronDown />}>
                <Typography>4. Propriedade Intelectual e Industrial</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <p><span style={{ color: 'rgb(68, 68, 68)' }}>Todos os textos, comentários, trabalhos, ilustrações e imagens reproduzidas ou representadas no Portal<a href=" https://ww40.mofreita.pt" target='#'> https://ww40.mofreita.pt</a>/, constituem propriedade da Mofreita ou dos seus fornecedores e encontram-se devidamente protegidos pela Lei Internacional de Direitos de Autor. Desta forma, e nos termos do Código de Direitos de Autor e Direitos Conexos, apenas será autorizada a sua utilização para fins privados, sem prejuízo de disposições mais restritivas constantes do mencionado Código. Qualquer reprodução ou representação total ou parcial do site https:// Mofreita.pt/ ou dos elementos incluídos no mesmo é estritamente proibida, sob pena de recurso aos meios legais competentes contra quem atuar dessa forma.
As denominações sociais, marcas e quaisquer outros sinais distintivos reproduzidos no website https://Mofreita.pt/ encontram-se protegidos de acordo com as disposições legais aplicáveis à propriedade industrial. A reprodução ou representação do todo ou parte desses sinais distintivos é estritamente proibida e deve ser objeto de uma autorização escrita prévia dos respetivos titulares.
.</span></p>
              </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel5'} onChange={handleChange('panel5')} >
              <AccordionSummary aria-controls="panel5d-content" id="panel5d-header" expandIcon={<ChevronDown />}>
                <Typography>5. Responsabilidades</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <p><span style={{ color: 'rgb(68, 68, 68)' }}>
                Todos os produtos comercializados no website https://Mofreita.pt/ encontram-se em conformidade com a legislação portuguesa.
 A Mofreita, não é responsável por prejuízos decorrentes de interferências, interrupções, vírus informáticos, avarias ou desconexões do sistema operativo que possam impedir, temporariamente, o acesso, a navegação ou a prestação de serviços aos utilizadores.
A Mofreita, declina qualquer responsabilidade por um eventual atraso ou impossibilidade de processamento da encomenda, nomeadamente no ato de entrega, decorrente de erro ou insuficiência dos dados comunicados pelo cliente.
Em caso de incumprimento, a Mofreita, reserva-se no direito de eliminar a conta do utilizador em questão.
                </span></p>
              </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel6'} onChange={handleChange('panel6')} >
              <AccordionSummary aria-controls="panel6d-content" id="panel6d-header" expandIcon={<ChevronDown />}>
                <Typography>6. Obrigações dos clientes / utilizadores</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <p><span style={{ color: 'rgb(68, 68, 68)' }}>
                O cliente e/ou utilizador compromete-se a cumprir e respeitar as presentes Condições Gerais de Contratação e Utilização, nomeadamente:
                  <p>1. Abster-se de introduzir, armazenar ou difundir, através do website, conteúdos difamatórios, obscenos, injuriosos, xenófobos e/ou de qualquer outra índole, que violem os princípios gerais de direito e a ordem pública;</p>
                  <p>2. Guardar, e não divulgar, a password de entrada no website, por forma de impedir que terceiros acedam à sua conta em<a href=" https://ww40.mofreita.pt" target='#'> https://ww40.mofreita.pt</a>/;</p>
                  <p>3. Não utilizar identidades falsas;</p>
                  <p>4. Facultar os dados pessoais e as moradas corretas de modo a que a Mofreita possa processar, devidamente, as encomendas.</p>
                </span></p>
              </AccordionDetails>
            </Accordion>
          </Box>
          {readOnly
            ? null
            : (
              <Box
                component='form'
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 1, width: '100%' }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      name='TOS'
                      value={acceptedTerms}
                      color='primary'
                      onClick={() => setAcceptedTerms(!acceptedTerms)}
                    />
                  }
                  label='Li e aceito os Termos de Utilização'
                />
                <Button
                  type='submit'
                  fullWidth
                  variant='contained'
                  disabled={!acceptedTerms}
                  sx={{ mt: 3, mb: 1 }}
                >
                Aceitar
                </Button>
                <Button
                  fullWidth
                  onClick={() => {
                    Router.push('/');
                    logout();
                  }}
                >
                  <LogOut strokeWidth='1' size={20} />Cancelar
                </Button>
              </Box>
            )}
        </Box>
        <Footer isPublicPage />
      </Grid>
    </Grid>
  );
};

export default Terms;
