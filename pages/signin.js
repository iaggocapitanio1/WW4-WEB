import React, { useEffect, useState } from 'react';
import Loader from '../components/loader/loader';
import SignInScreen from '../components/pages/signin/signin';

//  Navigation
import routes from '../navigation/routes';

const SignIn = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoaded(true);
    }, 500);
  }, []);

  if (loaded) {
    const loginSuccessRoute = routes.private.internal.projects;
    const forgotPasswordRoute = routes.public.forgotPasswordInternal;

    const props = {

      loginSuccessRoute,
      forgotPasswordRoute
    };

    return <SignInScreen {...props} />;
  }

  return <Loader center={true} />;
};

export default SignIn;
