/* eslint-disable no-unused-vars */
//  Nodes
import React, { useState } from 'react';

//  Custom Components
import Loader from '../../components/loader/loader';

//  Page Component
import NewStockScreen from '../../components/pages/newStock/newStock';

//  Navigation
import routes from '../../navigation/routes';

const NewStock = ({ ...pageProps }) => {
  const [loaded, setLoaded] = useState(true);

  if (loaded) {
    const breadcrumbsPath = [
      {
        title: 'Stocks',
        href: `${routes.private.internal.stocks}`,
      },
      {
        title: 'Novo stock',
        href: `${routes.private.internal.newStock}`,
      },
    ];

    const props = {
      breadcrumbsPath,
      pageProps
    };

    return <NewStockScreen {...props} />;
  }

  return <Loader center={true} />;
};

export default NewStock;
