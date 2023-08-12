//  Nodes
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

//  Custom Components
import Loader from '../../../components/loader/loader';

//  Page Component
import StockScreen from '../../../components/pages/stock/stock';

//  Navigation
import { useSelector } from 'react-redux';
import routes from '../../../navigation/routes';

//  Utils
const Stock = () => {
  const [loaded, setLoaded] = useState(false);
  const [stock, setStock] = useState();
  const router = useRouter();
  const reduxState = useSelector((state) => state);

  useEffect(() => {
    const getData = async () => {
      setStock(reduxState.stocks.data.find(ele => ele.id === router.query.Id));
    };

    Promise.all([getData()]).then(() => setLoaded(true));
  }, []);

  if (loaded) {
    const breadcrumbsPath = [
      {
        title: 'Stocks',
        href: `${routes.private.internal.stocks}`,
      },
      {
        title: `${stock?.material}`,
        href: `${routes.private.internal.stock}`,
      },
    ];

    const props = {
      breadcrumbsPath,
      stock: reduxState.stocks.data.find(ele => ele.id === router.query.Id),
    };

    return <StockScreen {...props} />;
  }

  return <Loader center={true} />;
};

export default Stock;
