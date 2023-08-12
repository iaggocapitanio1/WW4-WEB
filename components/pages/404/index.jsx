import { AppBar, Box, Tooltip } from '@mui/material';
import Router from 'next/router';
import React from 'react';
import styles from '../../../styles/404.module.css';
import Footer from '../../layout/footer/footer';
import Navbar from '../../layout/navbar/navbar';

const notFoundPage = (props) => {
  const { noAccess } = props;

  return (<>
    <Box className={styles.main} target="_blank" rel="noreferrer">
      <Navbar />
      <AppBar position='sticky' className={styles.topheader} sx={{ backgroundColor: 'transparent' }}></AppBar>
      <Box>
        <Box className={styles.starsec}></Box>
        <Box className={styles.starthird}></Box>
        <Box className={styles.starfourth}></Box>
        <Box className={styles.starfifth}></Box>
      </Box>
      <section className={styles.error}>
        <Box className={styles.error__content}>
          <Box className={styles.error__message}>
            <h1 className={styles.message__title}> {noAccess ? 'Não tem acesso a esta página' : 'Página não encontrada' }</h1>
            <p className={styles.message__text}>
              {noAccess
                ? <>Se é suposto ter acesso a esta página, por favor entre em
                  <Tooltip title='Escrever email'>
                    <a href={`mailto:${process.env.NEXT_PUBLIC_REPORT_EMAIL}`} className='link'> contacto </a>
                  </Tooltip>
                        com o responsavel
                </>
                : ' Desculpe, a página que você estava procurando não foi encontrada aqui. O link que você seguiu pode estar quebrado ou não existir mais.'}
            </p>
          </Box>
          <Box className={styles.error__nav} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <a onClick={() => Router.back()} className={styles.enav__link}>
              Voltar
            </a>
          </Box>
        </Box>
      </section>
    </Box>
    <Footer />
  </>
  );
};

export default notFoundPage;
