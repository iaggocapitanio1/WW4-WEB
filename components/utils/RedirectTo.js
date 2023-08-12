/* eslint-disable consistent-return */
/* eslint-disable camelcase */
import routes from '../../navigation/routes';

function RedirectTo (props) {
  if (typeof props === 'undefined') return;

  const { orion_permissions, role } = props;

  if (role === 'CUSTOMER') {
    if (props.tos === false) return routes.private.terms;

    return routes.private.projects;
  }

  const priorityPages = [
    {
      perm: 'list_project',
      page: routes.private.internal.projects
    },
    {
      perm: 'list_similarProject',
      page: routes.private.internal.similarProjects
    },
    {
      perm: 'list_stock',
      page: routes.private.internal.stocks
    },
    {
      perm: 'list_project',
      page: routes.private.internal.projects
    },
    {
      perm: 'list_machine',
      page: routes.private.internal.machines
    },
    {
      perm: 'list_factory',
      page: routes.private.internal.factorys
    },
    {
      perm: 'list_assembly',
      page: routes.private.internal.assemblys
    },
    {
      perm: 'list_package',
      page: routes.private.internal.packages
    },
    {
      perm: 'create_leftover',
      page: routes.private.internal.newLeftover
    },
    {
      perm: 'list_client',
      page: routes.private.internal.clients
    },
    {
      perm: 'list_worker',
      page: routes.private.internal.workers
    },
    {
      perm: 'list_profile',
      page: routes.private.internal.profiles
    },
    {
      perm: 'see_account',
      page: routes.private.internal.account
    },
  ];

  // eslint-disable-next-line array-callback-return
  const prio = priorityPages.filter((section) => {
    if (orion_permissions.find(ele => ele === section.perm)) {
      return section?.page;
    }
  });

  return prio[0] ? prio[0].page : routes.private.internal.account;
}

export default RedirectTo;
