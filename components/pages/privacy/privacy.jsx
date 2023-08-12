/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-irregular-whitespace */
/* eslint-disable react/prop-types */
//  Nodes
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
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
import { ChevronDown, ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import Router from 'next/router';
import backgroundImg from '../../../public/Log_In.jpg';
import companyLogo from '../../../public/Logotipo_Vetorizado.png';

const Terms = ({ ...props }) => {
  const [windowWidth, setWindowHeight] = useState();
  // eslint-disable-next-line react/prop-types
  const { readOnly } = props;

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

  const [expanded, setExpanded] = React.useState('panel1');

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <Grid container component='main' sx={{ height: '100%', width: '100%' }}>
      <CssBaseline />
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
          sx={{
            mx: '10%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'start',
          }}
        >
          <Box
            style={{ width: windowWidth > 600 ? '160px' : '100px', position: 'absolute', right: '25px', top: '25px' }}
          >
            <a
              target='#'
              href='http://mofreita.com/'
            >
              <Image
                width={windowWidth > 600 ? 160 : 100}
                alt='Company Logo'
                src={companyLogo}
                placeholder='blur'
              />
            </a>
          </Box>
          <Typography color={'primary'}>Portal Cliente WW4.0</Typography>
          <Typography variant='titlexxl'>
            Politica de Privacidade
          </Typography>

          <Box style={{
            maxHeight: readOnly ? '68vh' : '50vh',
            overflow: 'scroll',
            overflowX: 'hidden',
          }}>
            <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
              <AccordionSummary aria-controls="panel1d-content" id="panel1d-header" expandIcon={<ChevronDown />}>
                <Typography>1. Introdução</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  <p><span style={{ color: 'rgb(68, 68, 68)' }}>
                  A Mofreita respeita a privacidade de todos os utilizadores do seu Portal de Cliente e compromete-se a proteger as informações pessoais que cada utilizador decida partilhar.
                  </span></p>

                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
              <AccordionSummary aria-controls="panel1d-content" id="panel1d-header" expandIcon={<ChevronDown />}>
                <Typography>2. Responsável pelo tratamento de dados pessoais</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  <p><span style={{ color: 'rgb(68, 68, 68)' }}>
                  Mofreita é a entidade responsável pela recolha e tratamento de dados pessoais dos utilizadores deste Portal. Os dados partilhados pelos utilizadores estarão sujeitos a tratamento informático e constarão da(s) base(s) de dados da Mofreita.
                  </span></p>

                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
              <AccordionSummary aria-controls="panel1d-content" id="panel1d-header" expandIcon={<ChevronDown />}>
                <Typography>3. Processamento e alteração</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  <p><span style={{ color: 'rgb(68, 68, 68)' }}>
                  Ao disponibilizar os seus dados pessoais a Mofreita, o utilizador consente que os mesmos sejam processados de acordo com esta Política de Privacidade e com os Termos e Condições. Sempre que se justifique, alteraremos a presente Política de Privacidade sem necessidade de qualquer autorização prévia.                  </span></p>

                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
              <AccordionSummary aria-controls="panel1d-content" id="panel1d-header" expandIcon={<ChevronDown />}>
                <Typography>4. Dados pessoais que podemos recolher</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  <p><span style={{ color: 'rgb(68, 68, 68)' }}>
                  Algumas secções e/ou funcionalidades deste sítio da internet podem ser navegadas sem recurso a divulgação de qualquer informação pessoal por parte do utilizador. Os dados pessoais recolhidos por Mofreita limitam-se aos estritamente necessários à prestação do serviço, nomeadamente, o nome, a morada, número de contribuinte, número de telefone ou correio eletrónico e outros que sejam necessários.
A Mofreita recolhe dados pessoais, por exemplo, quando o utilizador efetua um pedido de orçamento, ou quando entra em contacto com Mofreita.
                  </span></p>

                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel5'} onChange={handleChange('panel5')}>
              <AccordionSummary aria-controls="panel1d-content" id="panel1d-header" expandIcon={<ChevronDown />}>
                <Typography>5. Como mantemos seguros dados pessoais?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  <p><span style={{ color: 'rgb(68, 68, 68)' }}>
                  Mofreita implementa as necessárias medidas para preservar a confidencialidade e a segurança dos dados pessoais recolhidos e tratados.
Diversas medidas de segurança física, lógica e de procedimentos referentes a este sítio da internet são aplicados de forma a proteger os dados pessoais contra a sua difusão, perda, uso indevido, alteração, tratamento ou acesso não autorizado, bem como contra qualquer outra forma de tratamento ilícito.
O utilizador deverá ser parte ativa na garantia da segurança guardando em local seguro e não divulgando a terceiros os códigos de acesso e seguindo as práticas de segurança aplicáveis a equipamentos e ao software utilizado nesses mesmos dispositivos.

                  </span></p>

                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel6'} onChange={handleChange('panel6')}>
              <AccordionSummary aria-controls="panel1d-content" id="panel1d-header" expandIcon={<ChevronDown />}>
                <Typography>6. Durante quanto tempo os dados são mantidos?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  <p><span style={{ color: 'rgb(68, 68, 68)' }}>
                  Os dados referentes a encomendas serão mantidos durante dez anos.
Os restantes dados dos utilizadores, como nome, contactos telefónicos poderão ser criados, alterados ou eliminados pelo próprio utilizador, na sua área reservada.

                  </span></p>

                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel7'} onChange={handleChange('panel7')}>
              <AccordionSummary aria-controls="panel1d-content" id="panel1d-header" expandIcon={<ChevronDown />}>
                <Typography>7. Com quem podemos partilhar os seus dados pessoais?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  <p><span style={{ color: 'rgb(68, 68, 68)' }}>
                  Os dados pessoais recolhidos não serão transmitidos a terceiros.

                  </span></p>

                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel8'} onChange={handleChange('panel8')}>
              <AccordionSummary aria-controls="panel1d-content" id="panel1d-header" expandIcon={<ChevronDown />}>
                <Typography>8. Como pode exercer os seus direitos?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  <p><span style={{ color: 'rgb(68, 68, 68)' }}>
                  Os O fornecimento de dados pessoais é facultativo e será sempre garantido, nos termos da lei, o direito de acesso, retificação e anulação de qualquer dado fornecido, podendo aquele direito ser exercido pessoalmente ou por escrito, diretamente para o endereço constante no sítio da internet ww.mofreita.pt. pessoais recolhidos não serão transmitidos a terceiros.

                  </span></p>

                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel9'} onChange={handleChange('panel9')}>
              <AccordionSummary aria-controls="panel1d-content" id="panel1d-header" expandIcon={<ChevronDown />}>
                <Typography>9. Uso de cookies</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  <p><span style={{ color: 'rgb(68, 68, 68)' }}>
                  Este sítio da internet utiliza Cookies de forma a proporcionar a melhor experiência ao utilizador. Considerando-se como tal, pequenos ficheiros de texto com informação relevante que o dispositivo de acesso (computador ou tablet) carrega, através do navegador de internet (browser), quando um site é visitado pelo utilizador. Os cookies utilizados neste sítio da internet permitem melhorar o desempenho e a experiência de navegação dos seus utilizadores, aumentando, por um lado, a rapidez e eficiência de resposta e, por outro, eliminando a necessidade de introduzir repetidamente as mesmas informações. A colocação de cookies não só ajuda o site a reconhecer o dispositivo do utilizador na próxima vez que este o visita, mas também será imprescindível para o funcionamento do mesmo. Os cookies usados neste sítio da internet, não recolhem informações pessoais que permitam identificar o utilizador, guardando apenas informações genéricas, designadamente a forma ou local/país de acesso e o modo como o utilizador usa o sítio da internet, entre outros. Os cookies retêm apenas informação relacionada com as preferências do utilizador e este pode, a qualquer momento e através do seu navegador de internet (browser), decidir ser notificado sobre a receção de cookies, bem como bloquear a respetiva entrada no seu sistema. Cada navegador de internet dispõe de um processo de configuração próprio para esta configuração. Esse processo pode ser consultado no menu Ajuda, o qual explica como configurar as preferências em matéria de cookies. Alerta-se, contudo, que a recusa de uso de cookies pode resultar na impossibilidade de acesso a algumas das áreas deste sítio da internet.
                  </span></p>

                </Typography>
              </AccordionDetails>
            </Accordion>
          </Box>
        </Box>
        <Footer isPublicPage />
      </Grid>
    </Grid>
  );
};

export default Terms;
