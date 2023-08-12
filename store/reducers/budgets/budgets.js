import { createReducer } from '@reduxjs/toolkit';
import * as budgetsActions from '../../actions/budget';

export const initialState = {
  errors: null,
  loading: false,
  data: null,
  newestBudgetError: null,
  updateBudgetError: null,
  newestBudget: null,
  displayedBudget: null,
};

const budgets = createReducer(initialState, (builder) => {
  builder
    //  GET
    .addCase(budgetsActions.BUDGETS_SUCCESS, (state, action) => ({
      ...state,
      errors: null,
      loading: false,
      data: action.payload.data,
    }))
    .addCase(budgetsActions.BUDGETS_FAIL, (state, action) => ({
      ...state,
      errors: state.errors ? [...state.errors, action.payload] : [action.payload],
      loading: false,
    }))
    .addCase(budgetsActions.BUDGETS_REQUEST, (state) => ({
      ...state,
      loading: true,
    }))
    //  POST
    .addCase(budgetsActions.NEW_BUDGET_SUCCESS, (state, action) => ({
      ...state,
      errors: null,
      loading: false,
      newestBudget: action.payload.data
    }))
    .addCase(budgetsActions.NEW_BUDGET_FAIL, (state, action) => ({
      ...state,
      newestBudgetError: state.newestBudgetError ? [...state.newestBudgetError, action.payload] : [action.payload],
      loading: false,
    }))
    .addCase(budgetsActions.NEW_BUDGET_REQUEST, (state) => ({
      ...state,
      loading: true,
    }))
    //  PATCH
    .addCase(budgetsActions.UPDATE_BUDGET_SUCCESS, (state, action) => ({
      ...state,
      errors: null,
      loading: false,
      displayedBudget: action.payload.data,
    }))
    .addCase(budgetsActions.UPDATE_BUDGET_FAIL, (state, action) => ({
      ...state,
      updateBudgetError: state.newestBudgetError ? [...state.newestBudgetError, action.payload] : [action.payload],
      loading: false,
    }))
    .addCase(budgetsActions.UPDATE_BUDGET_REQUEST, (state) => ({
      ...state,
      loading: true,
    }))
    //  Set
    .addCase(budgetsActions.DISPLAYED_BUDGET_SET, (state, action) => ({
      ...state,
      displayedBudget: action.data,
    }));
});

export default budgets;
