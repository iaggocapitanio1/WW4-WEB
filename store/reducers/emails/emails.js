import { createReducer } from '@reduxjs/toolkit';
import * as emailsActions from '../../actions/email';

export const initialState = {
  errors: null,
  loading: false,
};

const permissions = createReducer(initialState, (builder) => {
  builder
    //  GET
    .addCase(emailsActions.EMAIL_SUCCESS, (state) => ({
      ...state,
      errors: null,
      loading: false,
    }))
    .addCase(emailsActions.EMAIL_FAIL, (state, action) => ({
      ...state,
      errors: state.errors ? [...state.errors, action.payload] : [action.payload],
      loading: false,
    }))
    .addCase(emailsActions.EMAIL_REQUEST, (state) => ({
      ...state,
      loading: true,
    }));
});

export default permissions;
