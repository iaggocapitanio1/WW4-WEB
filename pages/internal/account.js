//  Nodes
import React, { useEffect, useState } from 'react';

//  Custom Components
import Loader from '../../components/loader/loader';

//  Page Component
import AccountScreen from '../../components/pages/account/account';

//  Proptypes
import PropTypes from 'prop-types';

//  Navigation
import { useSelector } from 'react-redux';
import routes from '../../navigation/routes';

//  Services

const Account = ({ ...pageProps }) => {
  const [loaded, setLoaded] = useState(false);
  const user = useSelector((state) => state.auth.me);

  useEffect(() => {
    const getData = async () => {
    };

    Promise.all([getData()]).then(() => setLoaded(true));
  }, []);

  if (loaded) {
    const breadcrumbsPath = [
      {
        title: 'Conta',
        href: `${routes.private.internal.user}`,
      },
    ];

    const props = {
      user,
      breadcrumbsPath,
      pageProps
    };

    return loaded && <AccountScreen {...props} />;
  }

  return <Loader center={true} />;
};

Account.propTypes = {
  users: PropTypes.object,
  breadcrumbsPath: PropTypes.array,
};

export default Account;
