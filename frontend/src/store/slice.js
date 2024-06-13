import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuth: false,
  user: {
    counter_projects: null,
    counter_active_projects: null,
    user_projects: null,
    counter_employees: null,
    counter_free_employees: null,
    user_employees: null,
  },
};

const saveUserToLocalStorage = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuth = true;
      state.user = action.payload;
      localStorage.setItem('isAuth', true);
      saveUserToLocalStorage(action.payload);
    },

    logout: (state) => {
      state.isAuth = false;
      state.user = null;
      localStorage.removeItem('isAuth');
      localStorage.removeItem('user');
    },

    setCounterEmployees: (state, action) => {
      if (state.user) {
        state.user.counter_employees = action.payload;
        saveUserToLocalStorage(state.user);
      }
    },
    setCounterFreeEmployees: (state, action) => {
      if (state.user) {
        state.user.counter_free_employees = action.payload;
        saveUserToLocalStorage(state.user);
      }
    },
    setCounterProjects: (state, action) => {
      if (state.user) {
        state.user.counter_projects = action.payload;
        saveUserToLocalStorage(state.user);
      }
    },
    setCounterActiveProject: (state, action) => {
      if (state.user) {
        state.user.counter_active_projects = action.payload;
        saveUserToLocalStorage(state.user);
      }
    },
    setEmployees: (state, action) => {
      if (state.user) {
        state.user.user_employees = action.payload;
        saveUserToLocalStorage(state.user);
      }
    },
    setProjects: (state, action) => {
      if (state.user) {
        state.user.user_projects = action.payload;
        saveUserToLocalStorage(state.user);
      }
    },
    loadUserFromLocalStorage: (state) => {
      const isAuth = localStorage.getItem('isAuth') === 'true';
      const user = JSON.parse(localStorage.getItem('user'));

      state.isAuth = isAuth;
      state.user = user;
    },
  },
});

export const {
  loadUserFromLocalStorage,
  login,
  logout,
  setCounterEmployees,
  setCounterActiveProject,
  setCounterFreeEmployees,
  setCounterProjects,
  setEmployees,
  setProjects,
} = slice.actions;

export const selectIsAuth = (state) => state.auth.isAuth;
export const selectUser = (state) => state.auth.user;
export default slice.reducer;
