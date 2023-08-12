import { createReducer } from '@reduxjs/toolkit';
import * as clientsActions from '../../actions/client';

export const initialState = {
  errors: null,
  loading: false,
  data: null,
  newestClient: null,
  displayedClient: null,
  newestClientErrors: null,
};

const clients = createReducer(initialState, (builder) => {
  builder
    //  GET
    .addCase(clientsActions.CLIENTS_SUCCESS, (state, action) => ({
      ...state,
      errors: null,
      loading: false,
      data: action.payload.data.results,
    }))
    .addCase(clientsActions.CLIENTS_FAIL, (state, action) => ({
      ...state,
      errors: state.errors ? [...state.errors, action.payload] : [action.payload],
      loading: false,
    }))
    .addCase(clientsActions.CLIENTS_REQUEST, (state) => ({
      ...state,
      loading: true,
    }))
    //  GET
    .addCase(clientsActions.CLIENT_SUCCESS, (state, action) => ({
      ...state,
      errors: null,
      loading: false,
      displayedClient: action.payload.data,
    }))
    .addCase(clientsActions.CLIENT_FAIL, (state, action) => ({
      ...state,
      errors: state.errors ? [...state.errors, action.payload] : [action.payload],
      loading: false,
    }))
    .addCase(clientsActions.CLIENT_REQUEST, (state) => ({
      ...state,
      loading: true,
    }))
    .addCase(clientsActions.SET_DISPLAYED_CLIENT, (state, action) => ({
      ...state,
      displayedClient: action.data,
    }))
    //  POST
    .addCase(clientsActions.ADD_CLIENT_SUCCESS, (state, action) => ({
      ...state,
      errors: null,
      loading: false,
      newestClient: action.payload.data,
    }))
    // .addCase(clientsActions.UPDATE_CLIENT_SUCCESS, (state, action) => ({
    //   ...state,
    //   errors: null,
    //   loading: false,
    //   newestClient: action.payload.data,
    // }))
    .addCase(clientsActions.ADD_CLIENT_FAIL, (state, action) => ({
      ...state,
      newestClientErrors: state.newestClientErrors ? [...state.newestClientErrors, action.payload] : [action.payload],
      loading: false,
    }))
    .addCase(clientsActions.ADD_CLIENT_REQUEST, (state) => ({
      ...state,
      loading: true,
    }));
});

export default clients;
