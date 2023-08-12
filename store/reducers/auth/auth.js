import { createReducer } from '@reduxjs/toolkit';
import * as authActions from '../../actions/auth';

export const initialState = {
  errors: null,
  loading: false,
  token: null,
  me: null,
  userPermissions: null,
};

const auth = createReducer(initialState, (builder) => {
  builder
    .addCase(authActions.LOGIN_SUCCESS, (state, action) => ({
      ...state,
      errors: null,
      loading: false,
      token: action.payload.data.access_token,
    }))
    .addCase(authActions.LOGIN_FAIL, (state, action) => ({
      ...state,
      errors: state.errors ? [...state.errors, action.payload] : [action.payload],
      loading: false,
      token: null,
    }))
    .addCase(authActions.LOGIN_REQUEST, (state) => ({
      ...state,
      loading: true,
    }))
    .addCase(authActions.ME_SUCCESS, (state, action) => ({
      ...state,
      errors: null,
      loading: false,
      me: action.payload.data[0] || action.payload.data,
    }))
    .addCase(authActions.ME_FAIL, (state, action) => ({
      ...state,
      errors: state.errors ? [...state.errors, action.payload] : [action.payload],
      loading: false,
      token: null,
    }))
    .addCase(authActions.ME_REQUEST, (state) => ({
      ...state,
      loading: true,
    }))
    .addCase(authActions.USER_PERMISSIONS_SET, (state, action) => ({
      ...state,
      userPermissions: action.data,
    }));
});

export default auth;
