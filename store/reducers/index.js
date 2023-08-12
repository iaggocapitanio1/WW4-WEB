import { combineReducers } from 'redux';

import { LOGOUT } from '../actions/logout';
import appStates from './appStates';
import assemblys from './assemblys';
import auth from './auth';
import budgets from './budgets';
import clients from './clients';
import countries from './countries';
import emails from './emails';
import expeditions from './expeditions';
import folders from './folders';
import furnitures from './furnitures';
import leftovers from './leftovers';
import machines from './machines';
import modules from './modules';
import organizations from './organizations';
import packages from './packages';
import parts from './parts';
import profiles from './profiles';
import projects from './projects';
import workers from './workers';
import stocks from './stocks';

const appReducer = combineReducers({
  auth,
  workers,
  budgets,
  clients,
  projects,
  appStates,
  expeditions,
  organizations,
  profiles,
  parts,
  emails,
  folders,
  machines,
  assemblys,
  leftovers,
  countries,
  furnitures,
  modules,
  packages,
  stocks
});

const rootReducer = (state, action) => {
  let updatedState = state;

  // Reset store when logging out
  if (action.type === LOGOUT) {
    updatedState = undefined;
  }

  return appReducer(updatedState, action);
};

export default rootReducer;
