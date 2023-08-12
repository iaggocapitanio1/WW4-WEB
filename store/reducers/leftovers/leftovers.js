import { createReducer } from '@reduxjs/toolkit';
import * as leftoversActions from '../../actions/leftover';

export const initialState = {
  errors: null,
  loading: false,
  data: null,
};

const leftovers = createReducer(initialState, (builder) => {
  builder
    //  GET
    .addCase(leftoversActions.LEFTOVERS_SUCCESS, (state, action) => ({
      ...state,
      errors: null,
      loading: false,
      data: action.payload.data,
    }))
    .addCase(leftoversActions.LEFTOVERS_FAIL, (state, action) => ({
      ...state,
      errors: state.errors ? [...state.errors, action.payload] : [action.payload],
      loading: false,
    }))
    .addCase(leftoversActions.LEFTOVERS_REQUEST, (state) => ({
      ...state,
      loading: true,
    }));
});

export default leftovers;
