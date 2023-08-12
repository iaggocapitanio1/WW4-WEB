import { createReducer } from '@reduxjs/toolkit';
import * as expeditionsActions from '../../actions/expedition';

export const initialState = {
  errors: null,
  loading: false,
  data: null,
};

const expeditions = createReducer(initialState, (builder) => {
  builder
    //  GET
    .addCase(expeditionsActions.EXPEDITIONS_SUCCESS, (state, action) => ({
      ...state,
      errors: null,
      loading: false,
      data: action.payload.data,
    }))
    .addCase(expeditionsActions.EXPEDITIONS_FAIL, (state, action) => ({
      ...state,
      errors: state.errors ? [...state.errors, action.payload] : [action.payload],
      loading: false,
    }))
    .addCase(expeditionsActions.EXPEDITIONS_REQUEST, (state) => ({
      ...state,
      loading: true,
    }))
    //  POST
    .addCase(expeditionsActions.NEW_EXPEDITION_SUCCESS, (state) => ({
      ...state,
      errors: null,
      loading: false,
    }))
    .addCase(expeditionsActions.NEW_EXPEDITION_FAIL, (state, action) => ({
      ...state,
      errors: state.errors ? [...state.errors, action.payload] : [action.payload],
      loading: false,
    }))
    .addCase(expeditionsActions.NEW_EXPEDITION_REQUEST, (state) => ({
      ...state,
      loading: true,
    }));
});

export default expeditions;
