/* eslint-disable no-undef */
import { parseCookies } from 'nookies';
import * as actions from '../store/actions/auth';

export const ensureAuth = async (store, ctx) => {
  const { auth_token: token } = parseCookies(ctx);
  const me = (data) => store.dispatch(actions.me(data));
  const userPermissions = (data) => store.dispatch(actions.userPermissionsSet(data));
  const state = store.getState();

  !state.auth.me && await me(token).then(() => console.log('sucesso')).catch(() => console.log('err'));

  !state.auth.userPermissions && await userPermissions(
    {
      description: 'Admin',
      type: 'internal',
      permissions: [
        { idPerfil: '123456789', subject: 'workers', action: 'READ' },
        { idPerfil: '123456789', subject: 'workers', action: 'WRITE' },
        { idPerfil: '123456789', subject: 'workers', action: 'DELETE' },

        //  DashboardsScreen
        { idPerfil: '123456789', subject: 'dashboards', action: 'READ' },

        //  FactoryScreen
        { idPerfil: '123456789', subject: 'factory', action: 'READ' },

        //  leftoversScreen
        { idPerfil: '123456789', subject: 'leftovers', action: 'READ' },

        //  Ficheiros
        { idPerfil: '123456789', subject: 'ficheiros', action: 'READ' },
        { idPerfil: '123456789', subject: 'ficheiros', action: 'WRITE' },
        { idPerfil: '123456789', subject: 'ficheiros', action: 'DELETE' },

        //  perfis
        { idPerfil: '123456789', subject: 'perfis', action: 'READ' },
        { idPerfil: '123456789', subject: 'perfis', action: 'WRITE' },
        { idPerfil: '123456789', subject: 'perfis', action: 'DELETE' },

        //  Ficheiros
        { idPerfil: '123456789', subject: 'messages', action: 'READ' },
        { idPerfil: '123456789', subject: 'messages', action: 'WRITE' },
        { idPerfil: '123456789', subject: 'messages', action: 'DELETE' },

        //  profiles
        { idPerfil: '123456789', subject: 'profiles', action: 'READ' },
        { idPerfil: '123456789', subject: 'profiles', action: 'WRITE' },
        { idPerfil: '123456789', subject: 'profiles', action: 'DELETE' },

        //  Unidades
        { idPerfil: '123456789', subject: 'unidades', action: 'READ' },
        { idPerfil: '123456789', subject: 'unidades', action: 'WRITE' },
        { idPerfil: '123456789', subject: 'unidades', action: 'DELETE' },

        //  ConversaoUnidades
        { idPerfil: '123456789', subject: 'conversaounidades', action: 'READ' },
        { idPerfil: '123456789', subject: 'conversaounidades', action: 'WRITE' },
        { idPerfil: '123456789', subject: 'conversaounidades', action: 'DELETE' },

        //  Moedas
        { idPerfil: '123456789', subject: 'moedas', action: 'READ' },
        { idPerfil: '123456789', subject: 'moedas', action: 'WRITE' },
        { idPerfil: '123456789', subject: 'moedas', action: 'DELETE' },

        //  projects
        { idPerfil: '123456789', subject: 'projects', action: 'READ' },
        { idPerfil: '123456789', subject: 'projects', action: 'WRITE' },
        { idPerfil: '123456789', subject: 'projects', action: 'DELETE' },

        //  Clients
        { idPerfil: '123456789', subject: 'clients', action: 'READ' },
        { idPerfil: '123456789', subject: 'clients', action: 'WRITE' },
        { idPerfil: '123456789', subject: 'clients', action: 'DELETE' },

        //  Stocks
        { idPerfil: '123456789', subject: 'stocks', action: 'READ' },
        { idPerfil: '123456789', subject: 'stocks', action: 'WRITE' },
        { idPerfil: '123456789', subject: 'stocks', action: 'DELETE' },

        //  Products
        { idPerfil: '123456789', subject: 'products', action: 'READ' },
        { idPerfil: '123456789', subject: 'products', action: 'WRITE' },
        { idPerfil: '123456789', subject: 'products', action: 'DELETE' },

        //  Client
        { idPerfil: 'cl16o9cag0000x3tqp8lbslzz', subject: 'clients', action: 'READ' },

        //  profiles
        { idPerfil: 'cl16o9cag0000x3tqp8lbslzz', subject: 'profiles', action: 'READ' },

        //  Unidades
        { idPerfil: 'cl16o9cag0000x3tqp8lbslzz', subject: 'unidades', action: 'READ' },

        //  ConversaoUnidades
        { idPerfil: 'cl16o9cag0000x3tqp8lbslzz', subject: 'conversaounidades', action: 'READ' },

        //  Moedas
        { idPerfil: 'cl16o9cag0000x3tqp8lbslzz', subject: 'moedas', action: 'READ' },

        //  projects
        { idPerfil: 'cl16o9cag0000x3tqp8lbslzz', subject: 'projects', action: 'READ' },

        //  Clients
        { idPerfil: 'cl16o9cag0000x3tqp8lbslzz', subject: 'clients', action: 'READ' },

        //  Stocks
        { idPerfil: 'cl16o9cag0000x3tqp8lbslzz', subject: 'stocks', action: 'READ' },

        //  Products
        { idPerfil: 'cl16o9cag0000x3tqp8lbslzz', subject: 'products', action: 'READ' },
      ]
    }
  );
};
