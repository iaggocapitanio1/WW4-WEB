export const DRAWER_TOGGLE = 'DRAWER_TOGGLE';
export const SET_LAST_REFRESHED = 'SET_LAST_REFRESHED';
export const SET_LOADING = 'SET_LOADING';
export const SET_THEME = 'SET_THEME';
export const SET_THEME_COLOR = 'SET_THEME_COLOR';

export const toggleDrawer = () => {
  return {
    type: DRAWER_TOGGLE,
  };
};

export const setLastRefreshed = () => {
  return {
    type: SET_LAST_REFRESHED,
  };
};

export const setLoading = (data) => {
  return {
    type: SET_LOADING,
    data,
  };
};

export const setTheme = (data) => {
  return {
    type: SET_THEME,
    data,
  };
};

export const setThemeColor = (data) => {
  return {
    type: SET_THEME_COLOR,
    data,
  };
};
