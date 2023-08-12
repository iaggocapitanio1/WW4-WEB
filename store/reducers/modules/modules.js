import { createReducer } from '@reduxjs/toolkit';
import * as modulesActions from '../../actions/module';

export const initialState = {
  errors: null,
  loading: false,
  data: null,
};

const modules = createReducer(initialState, (builder) => {
  builder
    //  GET
    .addCase(modulesActions.MODULES_SUCCESS, (state, action) => ({
      ...state,
      errors: null,
      loading: false,
      data: action.payload.data,
    }))
    .addCase(modulesActions.MODULES_FAIL, (state, action) => ({
      ...state,
      errors: state.errors ? [...state.errors, action.payload] : [action.payload],
      loading: false,
    }))
    .addCase(modulesActions.MODULES_REQUEST, (state) => ({
      ...state,
      loading: true,
    }))
    //  POST
    .addCase(modulesActions.NEW_MODULE_SUCCESS, (state) => ({
      ...state,
      errors: null,
      loading: false,
    }))
    .addCase(modulesActions.NEW_MODULE_FAIL, (state, action) => ({
      ...state,
      errors: state.errors ? [...state.errors, action.payload] : [action.payload],
      loading: false,
    }))
    .addCase(modulesActions.NEW_MODULE_REQUEST, (state) => ({
      ...state,
      loading: true,
    }));
});

export default modules;
