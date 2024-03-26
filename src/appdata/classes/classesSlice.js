import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userCreatedClasses: null,
  userJoinedClasses: null,
  searchClass: null,
};

export const classesSlice = createSlice({
  name: "classes",
  initialState,
  reducers: {},
});

export default classesSlice.reducer;
