import { createReducer } from '@reduxjs/toolkit';
import * as furnituresActions from '../../actions/furniture';

export const initialState = {
  errors: null,
  loading: false,
  data: null,
};

const furnitures = createReducer(initialState, (builder) => {
  builder
    //  GET
    .addCase(furnituresActions.FURNITURES_SUCCESS, (state, action) => ({
      ...state,
      errors: null,
      loading: false,
      data: action.payload.data,
    }))
    .addCase(furnituresActions.FURNITURES_FAIL, (state, action) => ({
      ...state,
      errors: state.errors ? [...state.errors, action.payload] : [action.payload],
      loading: false,
    }))
    .addCase(furnituresActions.FURNITURES_REQUEST, (state) => ({
      ...state,
      loading: true,
    }))
    //  POST
    .addCase(furnituresActions.NEW_FURNITURE_SUCCESS, (state) => ({
      ...state,
      errors: null,
      loading: false,
    }))
    .addCase(furnituresActions.NEW_FURNITURE_FAIL, (state, action) => ({
      ...state,
      errors: state.errors ? [...state.errors, action.payload] : [action.payload],
      loading: false,
    }))
    .addCase(furnituresActions.NEW_FURNITURE_REQUEST, (state) => ({
      ...state,
      loading: true,
    }));
});

export default furnitures;
