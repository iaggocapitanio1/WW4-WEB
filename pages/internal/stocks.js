//  Nodes
import React, { useEffect, useState } from 'react';

//  Custom Components
import Loader from '../../components/loader/loader';

//  Page Component
import StockScreen from '../../components/pages/stocks/stocks';

//  PropTypes

//  Navigation
import { useDispatch, useSelector } from 'react-redux';
import routes from '../../navigation/routes';
import * as lefctoversActionsRedux from '../../store/actions/leftover';
import * as stocksActionsRedux from '../../store/actions/stock';

const Stock = () => {
  const [loaded, setLoaded] = useState(false);
  const [stocks, setStocks] = useState();
  const [filtersSizes, setFiltersSizes] = useState();
  const dispatch = useDispatch();
  const getLeftovers = (data) => dispatch(lefctoversActionsRedux.leftovers(data));
  const getStocks = (data) => dispatch(stocksActionsRedux.stocks(data));
  const reduxState = useSelector((state) => state);

  //  Data Fetching
  useEffect(() => {
    const getData = async () => {
      !reduxState.stocks.data ? await getStocks() : setStocks(reduxState.stocks.data);

      await getLeftovers().then(() => {
        const realStocks = [...reduxState.stocks.data];

        setFiltersSizes({
          Largura: {
            values: [Math.min(...realStocks.map(o => o.width)), Math.max(...realStocks.map(o => o.width))],
            min: Math.min(...realStocks.map(o => o.width)),
            max: Math.max(...realStocks.map(o => o.width))
          },
          Espessura: {
            values: [Math.min(...realStocks.map(o => o.thickness)), Math.max(...realStocks.map(o => o.thickness))],
            min: Math.min(...realStocks.map(o => o.thickness)),
            max: Math.max(...realStocks.map(o => o.thickness))
          },
          Comprimento: {
            values: [Math.min(...realStocks.map(o => o.height)), Math.max(...realStocks.map(o => o.height))],
            min: Math.min(...realStocks.map(o => o.height)),
            max: Math.max(...realStocks.map(o => o.height))
          },
        });
      });
    };

    Promise.all([getData()]).then(() => setLoaded(true));
  }, []);

  if (loaded && stocks) {
    //  Table header
    const headCells = [
      {
        id: 'material',
        label: 'Material',
        width: '20%',
        show: true,
      },
      {
        id: 'amount',
        label: 'Disponível',
        show: true,
      },
      {
        id: 'Comprimento',
        label: 'Comprimento',
        show: true,
      },
      {
        id: 'Largura',
        label: 'Largura',
        show: true,
      },
      {
        id: 'Espessura',
        label: 'Espessura',
        show: true,
      },
      {
        id: 'warehouse',
        label: 'Armazém',
        show: true,
      },
      {
        id: 'actions',
        numeric: true,
        label: 'Ações',
        show: true,
      },
    ];

    //  Breadcrumbs path feed
    const breadcrumbsPath = [
      {
        title: 'Stocks',
        href: `${routes.private.internal.stocks}`,
      },
    ];

    const detailPage = routes.private.internal.stock;

    const props = {
      breadcrumbsPath,
      detailPage,
      headCells,
      stocks: stocks.map((ele) => {
        return { ...ele, available: ele.amount > 0 };
      }),
      filtersSizes
    };

    return <StockScreen {...props} />;
  }

  return <Loader center={true} />;
};

export default Stock;
