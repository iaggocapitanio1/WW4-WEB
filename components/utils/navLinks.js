import { Webhook } from '@mui/icons-material';
import { Archive, Factory, MessageCircle, Network, PackageCheck, Scan, ShieldAlert, Table, Users } from 'lucide-react';
import React from 'react';
import routes from '../../navigation/routes';

export const navLinks = [
  {
    group: 'Projetos',
    underline: true,
    pages: [
      {
        title: 'Projetos',
        t: 'Projects',
        id: 'projectsInternal',
        url: routes.private.projects,
        icon: <Archive strokeWidth='1' size={20} />,
        allowed: 'projects',
        allowed_: 'list_project',
      },
      {
        title: 'Projetos',
        t: 'Projects',
        id: 'projectsClient',
        url: routes.private.internal.projects,
        icon: <Archive strokeWidth='1' size={20} />,
        allowed: 'projects',
        allowed_: 'list_project',
      },
      {
        title: 'Mensagens',
        t: 'Messages',
        id: 'messagesClient',
        url: routes.private.messages,
        icon: <MessageCircle strokeWidth='1' size={20} />,
        allowed: 'client',
        allowed_: 'list_message',
      },
      {
        title: 'Projetos Similares',
        t: 'SimilarProjects',
        id: 'similarProjects',
        url: routes.private.internal.similarProjects,
        icon: <Archive strokeWidth='1' size={20} />,
        allowed: 'projects',
        allowed_: 'list_similarProject',
      },
    ]
  },
  {
    group: 'Produção',
    underline: true,

    pages: [
      {
        title: 'Stocks',
        t: 'Stocks',
        id: 'stocks',
        url: routes.private.internal.stocks,
        icon: <Table strokeWidth='1' size={20} />,
        allowed: 'stocks',
        allowed_: 'list_stock',
      },

      {
        title: 'Chão de Fábrica',
        t: 'FactoryGround',
        id: 'fabrica',
        url: routes.private.internal.factorys,
        icon: <Factory strokeWidth='1' size={20} />,
        allowed: 'factory',
        allowed_: 'list_factory',
      },
      {
        title: 'Montagens',
        t: 'Assemblys',
        id: 'assembly',
        url: routes.private.internal.assemblys,
        icon: <Network strokeWidth='1' size={20} />,
        allowed: 'assemblys',
        allowed_: 'list_assembly',
      },
      {
        title: 'Embalamentos',
        t: 'Packages',
        id: 'packing',
        url: routes.private.internal.packages,
        icon: <PackageCheck strokeWidth='1' size={20} />,
        allowed: 'packages',
        allowed_: 'list_package',
      },

      {
        title: 'Sobrantes',
        t: 'Leftovers',
        id: 'leftovers',
        url: routes.private.internal.newLeftover,
        icon: <Scan strokeWidth='1' size={20} />,
        allowed: 'leftovers',
        allowed_: 'create_leftover',
        hidden: true,
      },
    ]
  },
  {
    group: 'Gestão',
    pages: [
      {
        title: 'Máquinas',
        t: 'Machines',
        id: 'machines',
        url: routes.private.internal.machines,
        icon: <Webhook strokeWidth='1' fontSize={'small'} />,
        allowed: 'machines',
        allowed_: 'list_machine',
      },
      {
        title: 'Clientes',
        t: 'Clients',
        id: 'clients',
        url: routes.private.internal.clients,
        icon: <Users strokeWidth='1' size={20} />,
        allowed: 'clients',
        allowed_: 'list_owner',
      },
      {
        title: 'Utilizadores',
        t: 'Users',
        id: 'workers',
        url: routes.private.internal.workers,
        icon: <Users strokeWidth='1' size={20} />,
        allowed: 'workers',
        allowed_: 'list_worker',
      },
      {
        title: 'Perfis',
        t: 'Profiles',
        id: 'profiles',
        url: routes.private.internal.profiles,
        icon: <ShieldAlert strokeWidth='1' size={20} />,
        allowed: 'dashboards',
        allowed_: 'list_profile',
      },
    ]
  },
];
