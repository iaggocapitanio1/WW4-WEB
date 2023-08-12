import Router, { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import React from 'react';
import styles from '../../../styles/components/navbar.module.css';

import { MenuItem } from '@mui/material';
import Link from 'next/link';
// import { useTranslation } from 'react-i18next';
import routes from '../../../navigation/routes';
export const pageSections = {
  projects: 'Projetos',
  project: 'Projetos',
  budget: 'Projetos',
  newProject: 'Projetos',
  editProject: 'Projetos',
  editBudget: 'Projetos',
  similarProjects: 'Projetos Similares',
  stocks: 'Stocks',
  stock: 'Stocks',
  editStock: 'Stocks',
  clients: 'Clientes',
  client: 'Clientes',
  editClient: 'Clientes',
  newClient: 'Clientes',
  workers: 'Utilizadores',
  worker: 'Utilizadores',
  editWorker: 'Utilizadores',
  newWorker: 'Utilizadores',
  leftovers: 'Sobrantes',
  newLeftover: 'Sobrantes',
  factorys: 'Chão de Fábrica',
  factory: 'Chão de Fábrica',
  packages: 'Embalamentos',
  newPackage: 'Embalamentos',
  package: 'Embalamentos',
  projectPackages: 'Embalamentos',
  assemblys: 'Montagens',
  account: 'Conta',
  messages: 'Mensagens',
  newProfile: 'Perfis',
  editProfile: 'Perfis',
  profiles: 'Perfis',
  profile: 'Perfis',
  machines: 'Máquinas',
  machine: 'Máquinas',
  newMachine: 'Máquinas',
  editMachine: 'Máquinas',
};

function ActiveLink ({ toggleDrawer, item }) {
  const path = useRouter();
  // const { t, i18n } = useTranslation();

  const currentSection = Object.entries(pageSections).find(([page]) => {
    const regex = new RegExp(`^${routes.private.internal[page]}(\\[.+\\])?$`);
    const regex2 = new RegExp(`^${routes.private[page]}(\\[.+\\])?$`);

    return regex.test(path.route) || regex2.test(path.route);
  })?.[1] ?? '';

  const style = {
    borderLeft: '5px solid',
    borderColor: item.title === currentSection ? 'var(--white)' : 'transparent',
  };

  return !item.hidden && (

    <Link href={item.url}>
      <MenuItem id={item.id}
        sx={{ padding: '0', width: '100%', ...style }}
        className={styles.navItemContainer}
        onClick={(e) => {
          e.preventDefault();
          toggleDrawer();
          Router.push(item.url);
        }}>
        {item.icon}
        <div style={{ paddingRight: '.5rem' }} />
        {item.title}
        {/* {t(item.t)} */}
      </MenuItem>
    </Link>

  );
}

ActiveLink.propTypes = {
  item: PropTypes.any,
  toggleDrawer: PropTypes.func,
  page: PropTypes.string,
};

export default ActiveLink;
