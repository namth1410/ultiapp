import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "ultis/api";

const initialState = {
  dataClass: null,
  dataHomework: null,
};

export const classSlice = createSlice({
  name: "class",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDataClassById.pending, (state, action) => {})
      .addCase(getDataClassById.fulfilled, (state, action) => {
        return {
          ...state,
          dataClass: action.payload,
        };
      })
      .addCase(getDataClassById.rejected, (state, action) => {})
      .addCase(getHomeworkOfClass.pending, (state, action) => {})
      .addCase(getHomeworkOfClass.fulfilled, (state, action) => {
        console.log(action.payload);
        return {
          ...state,
          dataHomework: [...action.payload],
        };
      })
      .addCase(getHomeworkOfClass.rejected, (state, action) => {});
  },
});

export const getDataClassById = createAsyncThunk(
  "class/getDataClassById",
  async ({ id }) => {
    try {
      const respone = await axiosInstance.get(`/classes/${id}`);
      return respone.data;
    } catch (error) {
      throw new Error(error);
    }
  }
);

export const getHomeworkOfClass = createAsyncThunk(
  "class/getHomeworkOfClass",
  async ({ id }) => {
    try {
      const respone = await axiosInstance.get(
        `/classes/homework-of-class/${id}`
      );
      return respone.data;
    } catch (error) {
      throw new Error(error);
    }
  }
);
export default classSlice.reducer;
