import { createReducer } from '@reduxjs/toolkit';
import * as organizationsActions from '../../actions/organization';

export const initialState = {
  errors: null,
  loading: false,
  data: null,
};

const organizations = createReducer(initialState, (builder) => {
  builder
    //  GET
    .addCase(organizationsActions.ORGANIZATIONS_SUCCESS, (state, action) => ({
      ...state,
      errors: null,
      loading: false,
      data: action.payload.data,
    }))
    .addCase(organizationsActions.ORGANIZATIONS_FAIL, (state, action) => ({
      ...state,
      errors: state.errors ? [...state.errors, action.payload] : [action.payload],
      loading: false,
    }))
    .addCase(organizationsActions.ORGANIZATIONS_REQUEST, (state) => ({
      ...state,
      loading: true,
    }));
});

export default organizations;
