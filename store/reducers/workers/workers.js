import { createReducer } from '@reduxjs/toolkit';
import * as workersActions from '../../actions/worker';

export const initialState = {
  errors: null,
  loading: false,
  data: null,
  newestWorker: null,
  displayedWorker: null,
  newestWorkerErrors: null,
};

const workers = createReducer(initialState, (builder) => {
  builder
    //  GET
    .addCase(workersActions.WORKERS_SUCCESS, (state, action) => ({
      ...state,
      errors: null,
      loading: false,
      data: action.payload.data.results,
    }))
    .addCase(workersActions.WORKERS_FAIL, (state, action) => ({
      ...state,
      errors: state.errors ? [...state.errors, action.payload] : [action.payload],
      loading: false,
    }))
    .addCase(workersActions.WORKERS_REQUEST, (state) => ({
      ...state,
      loading: true,
    }))
    //  GET
    .addCase(workersActions.WORKER_SUCCESS, (state, action) => ({
      ...state,
      errors: null,
      loading: false,
      displayedWorker: action.payload.data,
    }))
    .addCase(workersActions.WORKER_FAIL, (state, action) => ({
      ...state,
      errors: state.errors ? [...state.errors, action.payload] : [action.payload],
      loading: false,
    }))
    .addCase(workersActions.WORKER_REQUEST, (state) => ({
      ...state,
      loading: true,
    }))
    .addCase(workersActions.SET_DISPLAYED_WORKER, (state, action) => ({
      ...state,
      displayedWorker: action.data,
    }))
    //  POST
    .addCase(workersActions.ADD_WORKER_SUCCESS, (state) => ({
      ...state,
      errors: null,
      loading: false,
      // data: state.data ? state.data.push(action.payload.data) : action.payload.data,
      // newestWorker: action.payload.data,
    }))
    .addCase(workersActions.ADD_WORKER_FAIL, (state, action) => ({
      ...state,
      newestWorkerErrors: state.newestWorkerErrors ? [...state.newestWorkerErrors, action.payload] : [action.payload],
      loading: false,
    }))
    .addCase(workersActions.ADD_WORKER_REQUEST, (state) => ({
      ...state,
      loading: true,
    }));
});

export default workers;
