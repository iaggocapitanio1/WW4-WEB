import { createReducer } from '@reduxjs/toolkit';
import moment from 'moment';
import * as appStatesActions from '../../actions/appState';

export const initialState = {
  drawerOpen: false,
  lastRefreshed: false,
  loading: false,
  theme: null,
  themeColor: 'blue'
};

const appStates = createReducer(initialState, (builder) => {
  builder
    .addCase(appStatesActions.DRAWER_TOGGLE, (state) => ({
      ...state,
      drawerOpen: !state.drawerOpen,
    }))
    .addCase(appStatesActions.SET_LAST_REFRESHED, (state) => ({
      ...state,
      lastRefreshed: moment().format(),
    }))
    .addCase(appStatesActions.SET_THEME, (state, action) => ({
      ...state,
      theme: action.data,
    }))
    .addCase(appStatesActions.SET_LOADING, (state, action) => ({
      ...state,
      loading: action.data,
    }))
    .addCase(appStatesActions.SET_THEME_COLOR, (state, action) => ({
      ...state,
      themeColor: action.data,
    }));
});

export default appStates;
