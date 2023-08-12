import { createReducer } from '@reduxjs/toolkit';
import * as packagesActions from '../../actions/package';

export const initialState = {
  errors: null,
  loading: false,
  data: null,
};

const packages = createReducer(initialState, (builder) => {
  builder
    //  GET
    .addCase(packagesActions.PACKAGES_SUCCESS, (state, action) => ({
      ...state,
      errors: null,
      loading: false,
      data: action.payload.data,
    }))
    .addCase(packagesActions.PACKAGES_FAIL, (state, action) => ({
      ...state,
      errors: state.errors ? [...state.errors, action.payload] : [action.payload],
      loading: false,
    }))
    .addCase(packagesActions.PACKAGES_REQUEST, (state) => ({
      ...state,
      loading: true,
    }))
    //  POST
    .addCase(packagesActions.NEW_PACKAGE_SUCCESS, (state) => ({
      ...state,
      errors: null,
      loading: false,
    }))
    .addCase(packagesActions.NEW_PACKAGE_FAIL, (state, action) => ({
      ...state,
      errors: state.errors ? [...state.errors, action.payload] : [action.payload],
      loading: false,
    }))
    .addCase(packagesActions.NEW_PACKAGE_REQUEST, (state) => ({
      ...state,
      loading: true,
    }));
});

export default packages;
