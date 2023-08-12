import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../../components/loader/loader';
import NewPackagingScreen from '../../../components/pages/projectPackages/projectPackages';
import routes from '../../../navigation/routes';
import * as budgetActionsRedux from '../../../store/actions/budget';
import * as clientsActionsRedux from '../../../store/actions/client';
import * as modulesActionsRedux from '../../../store/actions/module';
import * as parsActionsRedux from '../../../store/actions/part';
import * as projectsActionsRedux from '../../../store/actions/project';

const NewPackaging = ({ ...pageProps }) => {
  const [loaded, setLoaded] = useState(false);
  const [project, setProject] = useState();
  const [parts, setParts] = useState();
  const [budget, setBudget] = useState();
  const [client, setClient] = useState();
  const router = useRouter();
  const dispatch = useDispatch();
  const reduxState = useSelector((state) => state);
  const getModules = (data) => dispatch(modulesActionsRedux.modules(data));
  const getProject = (data) => dispatch(projectsActionsRedux.project(data));
  const getParts = (data) => dispatch(parsActionsRedux.parts(data));
  const getClient = (data) => dispatch(clientsActionsRedux.client(data));
  const getBudget = (data) => dispatch(budgetActionsRedux.budget(data));

  useEffect(() => {
    const getData = async () => {
      await getProject(router.query.Id).then(async (res) => {
        setProject(res.data);
        await getBudget(res.data.hasBudget.object).then((res) => setBudget(res.data));
        await getClient(res.data.orderBy.object).then((res) => setClient(res.data));
      }).catch(() => setProject({}));

      await getParts({ belongsTo: router.query.Id }).then((res) => setParts(res.data));
      await getModules();
    };

    Promise.all([getData()]).then(() => setLoaded(true));
  }, []);

  if (loaded) {
    const breadcrumbsPath = [
      {
        title: 'Embalamentos',
        href: `${routes.private.internal.packages}`,
      },
      {
        title: `${project?.name?.value}`,
        href: `${routes.private.internal.package}`,
      },
    ];

    const props = {
      breadcrumbsPath,
      pageProps,
      modules: reduxState.modules.data,
      parts,
      project: { ...project, budget, client }
    };

    return <NewPackagingScreen {...props} />;
  }

  return <Loader center={true} />;
};

export default NewPackaging;
