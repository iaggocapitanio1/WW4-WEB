import { createReducer } from '@reduxjs/toolkit';
import * as machinesActions from '../../actions/machine';

export const initialState = {
  errors: null,
  loading: false,
  data: null,
};

const budgets = createReducer(initialState, (builder) => {
  builder
    //  GET
    .addCase(machinesActions.MACHINES_SUCCESS, (state, action) => ({
      ...state,
      errors: null,
      loading: false,
      data: action.payload.data,
    }))
    .addCase(machinesActions.MACHINES_FAIL, (state, action) => ({
      ...state,
      errors: state.errors ? [...state.errors, action.payload] : [action.payload],
      loading: false,
    }))
    .addCase(machinesActions.MACHINES_REQUEST, (state) => ({
      ...state,
      loading: true,
    }))
    //  POST
    // .addCase(machinesActions.NEW_MACHINE_SUCCESS, (state, action) => ({
    //   ...state,
    //   errors: null,
    //   loading: false,
    //   data: state.data ? state.data.push(action.data) : state.data,
    // }))
    .addCase(machinesActions.NEW_MACHINE_FAIL, (state, action) => ({
      ...state,
      errors: state.errors ? [...state.errors, action.payload] : [action.payload],
      loading: false,
    }))
    .addCase(machinesActions.NEW_MACHINE_REQUEST, (state) => ({
      ...state,
      loading: true,
    }))
    //  PATCH
    .addCase(machinesActions.UPDATE_MACHINE_SUCCESS, (state) => ({
      ...state,
      errors: null,
      loading: false,
    }))
    .addCase(machinesActions.UPDATE_MACHINE_FAIL, (state, action) => ({
      ...state,
      errors: state.errors ? [...state.errors, action.payload] : [action.payload],
      loading: false,
    }))
    .addCase(machinesActions.UPDATE_MACHINE_REQUEST, (state) => ({
      ...state,
      loading: true,
    }));
});

export default budgets;
