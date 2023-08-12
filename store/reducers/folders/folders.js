import { createReducer } from '@reduxjs/toolkit';
import * as foldersActions from '../../actions/folder';

export const initialState = {
  errors: null,
  loading: false,
  data: null,
};

const folders = createReducer(initialState, (builder) => {
  builder
    //  GET
    .addCase(foldersActions.FOLDERS_SUCCESS, (state, action) => ({
      ...state,
      errors: null,
      loading: false,
      data: action.payload.data,
    }))
    .addCase(foldersActions.FOLDERS_FAIL, (state, action) => ({
      ...state,
      errors: state.errors ? [...state.errors, action.payload] : [action.payload],
      loading: false,
    }))
    .addCase(foldersActions.FOLDERS_REQUEST, (state) => ({
      ...state,
      loading: true,
    }));
});

export default folders;
