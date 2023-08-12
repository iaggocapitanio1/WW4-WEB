import { createReducer } from '@reduxjs/toolkit';
import * as projectActions from '../../actions/project';

export const initialState = {
  errors: null,
  loading: false,
  data: null,
  displayedProject: null,
  updateProjectError: null,
  inProduction: null,
};

const projects = createReducer(initialState, (builder) => {
  builder
    //  GET
    .addCase(projectActions.PROJECTS_SUCCESS, (state, action) => ({
      ...state,
      errors: null,
      loading: false,
      data: action.payload.data,
    }))
    .addCase(projectActions.PROJECTS_FAIL, (state, action) => ({
      ...state,
      errors: state.errors ? [...state.errors, action.payload] : [action.payload],
      loading: false,
    }))
    .addCase(projectActions.PROJECTS_REQUEST, (state) => ({
      ...state,
      loading: true,
    }))
    //  GET
    .addCase(projectActions.PROJECT_SUCCESS, (state) => ({
      ...state,
      errors: null,
      loading: false,
    }))
    .addCase(projectActions.PROJECT_FAIL, (state, action) => ({
      ...state,
      errors: state.errors ? [...state.errors, action.payload] : [action.payload],
      loading: false,
    }))
    .addCase(projectActions.PROJECT_REQUEST, (state) => ({
      ...state,
      loading: true,
    }))
    //  GET
    .addCase(projectActions.PROD_PROJECTS_SUCCESS, (state, action) => ({
      ...state,
      errors: null,
      loading: false,
      inProduction: action.payload.data,
    }))
    .addCase(projectActions.PROD_PROJECTS_FAIL, (state, action) => ({
      ...state,
      errors: state.errors ? [...state.errors, action.payload] : [action.payload],
      loading: false,
    }))
    .addCase(projectActions.PROD_PROJECTS_REQUEST, (state) => ({
      ...state,
      loading: true,
    }))
    //  POST
    .addCase(projectActions.NEW_PROJECT_SUCCESS, (state, action) => ({
      ...state,
      errors: null,
      loading: false,
      data: state.data?.length > 0 ? state.data.push(action.data) : [action.data],
    }))
    .addCase(projectActions.NEW_PROJECT_FAIL, (state, action) => ({
      ...state,
      errors: state.errors ? [...state.errors, action.payload] : [action.payload],
      loading: false,
    }))
    .addCase(projectActions.NEW_PROJECT_REQUEST, (state) => ({
      ...state,
      loading: true,
    }))
    //  PATCH
    .addCase(projectActions.UPDATE_PROJECT_SUCCESS, (state, action) => ({
      ...state,
      errors: null,
      loading: false,
      displayedProject: action.payload.data,
    }))
    .addCase(projectActions.UPDATE_PROJECT_FAIL, (state, action) => ({
      ...state,
      updateProjectError: state.updateProjectError ? [...state.updateProjectError, action.payload] : [action.payload],
      loading: false,
    }))
    .addCase(projectActions.UPDATE_PROJECT_REQUEST, (state) => ({
      ...state,
      loading: true,
    }))
    //  SET
    .addCase(projectActions.DISPLAYED_PROJECT_SET, (state, action) => ({
      ...state,
      displayedProject: action.data,
    }));
});

export default projects;
