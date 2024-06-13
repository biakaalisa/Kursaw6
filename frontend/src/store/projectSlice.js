import { createSlice } from "@reduxjs/toolkit";

export const projectSlice = createSlice({
  name: "project",
  initialState: null,
  reducers: {
    setProject: (state, action) => {
      return action.payload;
    },
    clearProject: (state) => null,
  },
});

export const { setProject, clearProject } = projectSlice.actions;

export default projectSlice.reducer;
