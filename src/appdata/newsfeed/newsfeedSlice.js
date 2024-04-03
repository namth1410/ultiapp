import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "ultis/api";

const initialState = {
  newsfeed: null,
};

export const classSlice = createSlice({
  name: "class",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getNewsfeedOfClass.pending, (state, action) => {})
      .addCase(getNewsfeedOfClass.fulfilled, (state, action) => {
        return {
          ...state,
          newsfeed: [...action.payload],
        };
      })
      .addCase(getNewsfeedOfClass.rejected, (state, action) => {});
  },
});

export const snapshotNewsfeedOfClass = createAsyncThunk(
  "class/snapshotNewsfeedOfClass",
  async ({ classId }) => {
    try {
      const respone = await axiosInstance.get(`/newsfeed/snapshot/${classId}`);
      return respone.data;
    } catch (error) {
      throw new Error(error);
    }
  }
);

export const getNewsfeedOfClass = createAsyncThunk(
  "class/getNewsfeedOfClass",
  async ({ classId }) => {
    try {
      const respone = await axiosInstance.get(`/newsfeed/get/${classId}`);
      return respone.data;
    } catch (error) {
      throw new Error(error);
    }
  }
);
export default classSlice.reducer;
