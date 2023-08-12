//  Nodes
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

//  Custom Components
import Loader from '../../../components/loader/loader';

//  Page Component
import UserScreen from '../../../components/pages/profile/profile';

//  Navigation
import routes from '../../../navigation/routes';

//  Services
import * as workersActionsRedux from '../../../store/actions/worker';

const User = ({ ...pageProps }) => {
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const reduxState = useSelector((state) => state);
  const getWorker = (data) => dispatch(workersActionsRedux.worker(data));

  useEffect(() => {
    const getData = async () => {
      await getWorker(router.query.Id);
    };

    Promise.all([getData()]).then(() => setLoaded(true));
  }, []);

  if (loaded && reduxState.workers.displayedWorker) {
    const breadcrumbsPath = [
      {
        title: 'Utilizadores',
        href: `${routes.private.internal.workers}`,
      },
      {
        title: reduxState.workers.displayedWorker.user.email,
        // title: `${reduxState.workers.displayedWorker.user.first_name + ' ' + reduxState.workers.displayedWorker.user.last_name}`,
        href: `${routes.private.internal.worker}`,
      },
    ];

    const props = {
      user: { ...reduxState.workers.displayedWorker },
      breadcrumbsPath,
      pageProps,
    };

    return <UserScreen {...props} />;
  }

  return <Loader center={true} />;
};

export default User;
