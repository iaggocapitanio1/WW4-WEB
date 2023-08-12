import { createReducer } from '@reduxjs/toolkit';
import * as assemblysActions from '../../actions/assembly';

export const initialState = {
  errors: null,
  loading: false,
  data: null,
};

const assemblys = createReducer(initialState, (builder) => {
  builder
    //  GET
    .addCase(assemblysActions.ASSEMBLYS_SUCCESS, (state, action) => ({
      ...state,
      errors: null,
      loading: false,
      data: action.payload.data,
    }))
    .addCase(assemblysActions.ASSEMBLYS_FAIL, (state, action) => ({
      ...state,
      errors: state.errors ? [...state.errors, action.payload] : [action.payload],
      loading: false,
    }))
    .addCase(assemblysActions.ASSEMBLYS_REQUEST, (state) => ({
      ...state,
      loading: true,
    }))
    //  POST
    .addCase(assemblysActions.NEW_ASSEMBLY_SUCCESS, (state) => ({
      ...state,
      errors: null,
      loading: false,
    }))
    .addCase(assemblysActions.NEW_ASSEMBLY_FAIL, (state, action) => ({
      ...state,
      errors: state.errors ? [...state.errors, action.payload] : [action.payload],
      loading: false,
    }))
    .addCase(assemblysActions.NEW_ASSEMBLY_REQUEST, (state) => ({
      ...state,
      loading: true,
    }));
});

export default assemblys;
