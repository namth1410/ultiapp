import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "ultis/api";

const initialState = {
  userCreatedClasses: null,
  userJoinedClasses: null,
  searchClass: null,
};

export const classesSlice = createSlice({
  name: "classes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserCreatedClasses.pending, (state, action) => {})
      .addCase(getUserCreatedClasses.fulfilled, (state, action) => {
        return {
          ...state,
          userCreatedClasses: [...action.payload],
        };
      })
      .addCase(getUserCreatedClasses.rejected, (state, action) => {})

      .addCase(getUserJoinedClasses.pending, (state, action) => {})
      .addCase(getUserJoinedClasses.fulfilled, (state, action) => {
        return {
          ...state,
          userJoinedClasses: [...action.payload],
        };
      })
      .addCase(getUserJoinedClasses.rejected, (state, action) => {})
      .addCase(getClassById.pending, (state, action) => {})
      .addCase(getClassById.fulfilled, (state, action) => {
        return {
          ...state,
          searchClass: action.payload,
        };
      })
      .addCase(getClassById.rejected, (state, action) => {});
  },
});

export const getUserCreatedClasses = createAsyncThunk(
  "classes/getUserCreatedClasses",
  async () => {
    try {
      const respone = await axiosInstance.get(`/classes/user-created`);
      return respone.data;
    } catch (error) {
      throw new Error(error);
    }
  }
);

export const getUserJoinedClasses = createAsyncThunk(
  "classes/getUserJoinedClasses",
  async () => {
    try {
      const respone = await axiosInstance.get(`/classes/user-joined`);
      return respone.data;
    } catch (error) {
      throw new Error(error);
    }
  }
);

export const getClassById = createAsyncThunk(
  "classes/getClassById",
  async ({ id }) => {
    try {
      const respone = await axiosInstance.get(`/classes/${id}`);
      return respone.data;
    } catch (error) {
      throw new Error(error);
    }
  }
);
export default classesSlice.reducer;
