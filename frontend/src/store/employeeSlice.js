import { createSlice } from "@reduxjs/toolkit";

export const employeeSlice = createSlice({
  name: "employee",
  initialState: {
    f_name: "",
    s_name: "",
    age: 0,
  },
  reducers: {
    setEmployee: (state, action) => {
      return action.payload;
    },
    setF_name: (state, action) => {
      state.EmployeeF_name = action.payload; // Изменяем только поле name
    },
    setS_name: (state, action) => {
      state.EmployeeS_name = action.payload; // Изменяем только поле email
    },
    setAge: (state, action) => {
      state.Employeeage = action.payload; // Изменяем только поле age
    }, },
});

export const {setEmployee, setF_name, setS_name, setAge } = employeeSlice.actions;

export default employeeSlice.reducer;
