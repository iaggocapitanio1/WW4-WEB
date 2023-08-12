import React, { useEffect, useState } from 'react';
import Loader from '../../components/loader/loader';
import LeftOversScreen from '../../components/pages/leftovers/leftovers';
import routes from '../../navigation/routes';

const LeftOvers = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function loadData () {
      setLoaded(true);
    }

    loadData();
  }, []);

  // Breadcrumbs path feed
  const breadcrumbsPath = [
    {
      title: 'Sobrantes',
      href: `${routes.private.internal.leftovers}`,
    },
  ];

  if (loaded) {
    const props = {
      breadcrumbsPath,
    };

    return <LeftOversScreen {...props} />;
  }

  return <Loader center={true} />;
};

export default LeftOvers;
