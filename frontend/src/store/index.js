/*Настройка Redux Store*/
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice';
import employeeSlice from "./employeeSlice";
import projectSlice from "./projectSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    employee: employeeSlice,
    project: projectSlice,
  },
});


