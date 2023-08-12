import { createReducer } from '@reduxjs/toolkit';
import * as profilesActions from '../../actions/profile';

export const initialState = {
  errors: null,
  loading: false,
  data: null,
  resources: null,
  newestProfile: null,
  newestProfileError: null,
};

const profiles = createReducer(initialState, (builder) => {
  builder
    //  GET
    .addCase(profilesActions.PROFILES_SUCCESS, (state, action) => ({
      ...state,
      errors: null,
      loading: false,
      data: action.payload.data.results,
    }))
    .addCase(profilesActions.PROFILES_FAIL, (state, action) => ({
      ...state,
      errors: state.errors ? [...state.errors, action.payload] : [action.payload],
      loading: false,
    }))
    .addCase(profilesActions.PROFILES_REQUEST, (state) => ({
      ...state,
      loading: true,
    }))
    //  GET
    .addCase(profilesActions.RESOURCES_SUCCESS, (state, action) => ({
      ...state,
      errors: null,
      loading: false,
      resources: action.payload.data,
    }))
    .addCase(profilesActions.RESOURCES_FAIL, (state, action) => ({
      ...state,
      errors: state.errors ? [...state.errors, action.payload] : [action.payload],
      loading: false,
    }))
    .addCase(profilesActions.RESOURCES_REQUEST, (state) => ({
      ...state,
      loading: true,
    }))
    //  POST
    .addCase(profilesActions.NEW_PROFILE_SUCCESS, (state) => ({
      ...state,
      errors: null,
      loading: false,
    }))
    .addCase(profilesActions.NEW_PROFILE_FAIL, (state, action) => ({
      ...state,
      newestProfileError: state.newestProfileError ? [...state.newestProfileError, action.payload] : [action.payload],
      loading: false,
    }))
    .addCase(profilesActions.NEW_PROFILE_REQUEST, (state) => ({
      ...state,
      loading: true,
    }));
});

export default profiles;
