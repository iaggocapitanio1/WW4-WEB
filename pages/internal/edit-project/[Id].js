//  Nodes
import React, { useEffect, useState } from 'react';

//  Preloader
import Loader from '../../../components/loader/loader';

//  Page Component
import EditProjectScreen from '../../../components/pages/editBudget/editBudget';

//  Navigation
import routes from '../../../navigation/routes';

const EditProject = ({ ...pageProps }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const getAll = async () => {
    };

    Promise.all([getAll()]).then(() => setLoaded(true));
  }, []);

  if (loaded) {
    const breadcrumbsPath = [
      {
        title: 'Projetos',
        href: `${routes.private.internal.projects}`,
      },
      {
        title: 'Editar',
        href: `${routes.private.internal.project}`,
      },
    ];

    const props = {
      project: [],
      breadcrumbsPath,
      pageProps,
      clients: [],
      products: []
    };

    return <EditProjectScreen {...props} />;
  }

  return <Loader center={true} />;
};

export default EditProject;
