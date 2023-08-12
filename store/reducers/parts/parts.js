import { createReducer } from '@reduxjs/toolkit';
import * as partsActions from '../../actions/part';

export const initialState = {
  errors: null,
  loading: false,
  data: null,
};

const parts = createReducer(initialState, (builder) => {
  builder
    //  GET
    .addCase(partsActions.PARTS_SUCCESS, (state, action) => ({
      ...state,
      errors: null,
      loading: false,
      data: action.payload.data,
    }))
    .addCase(partsActions.PARTS_FAIL, (state, action) => ({
      ...state,
      errors: state.errors ? [...state.errors, action.payload] : [action.payload],
      loading: false,
    }))
    .addCase(partsActions.PARTS_REQUEST, (state) => ({
      ...state,
      loading: true,
    }));
});

export default parts;
