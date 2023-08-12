//  Custom Components

//  Page Component
import AssemblysScreen from '../../components/pages/assembly/assembly';

//  Proptypes
import PropTypes from 'prop-types';

//  Navigation
import Loader from '../../components/loader/loader';
import routes from '../../navigation/routes';
//  Services
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as modulesActionsRedux from '../../store/actions/module';

const Assembly = ({ ...pageProps }) => {
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();
  const reduxState = useSelector((state) => state);
  const getModules = (data) => dispatch(modulesActionsRedux.modules(data));

  useEffect(() => {
    const getData = async () => {
      await getModules({ finishTime: '' });
    };

    Promise.all([getData()]).then(() => setLoaded(true));
  }, []);

  if (loaded) {
    const breadcrumbsPath = [
      {
        title: 'Montagens',
        href: `${routes.private.internal.assemblys}`,
      },
    ];

    const props = {
      breadcrumbsPath,
      pageProps,
      modules: reduxState.modules.data,
    };

    return <AssemblysScreen {...props} />;
  }

  return <Loader center={true} />;
};

Assembly.propTypes = {
  breadcrumbsPath: PropTypes.array,
};

export default Assembly;
