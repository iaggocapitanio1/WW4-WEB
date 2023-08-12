// Node modules
import { configureStore } from '@reduxjs/toolkit';
import { HYDRATE, createWrapper } from 'next-redux-wrapper';
// Store
import { api } from '../pages/api/middlewares';
import rootReducer from './reducers';

const reducer = (state, action) => {
  if (action.type === HYDRATE) {
    const nextState = {
      ...state, // use previous state
      ...action.payload, // apply delta from hydration
    };

    return nextState;
  }

  return rootReducer(state, action);
};

const makeStore = () =>
  configureStore({
    devTools: process.env.NEXT_PUBLIC_ENV !== 'prod',
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api(process.env.NEXT_PUBLIC_ENV)),
    reducer,
  });

export const storeWrapper = createWrapper(makeStore);
