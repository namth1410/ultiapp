import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "ultis/api";

const initialState = {
  members: null,
  searchUser: null,
};

export const memberSlice = createSlice({
  name: "member",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMembersOfClass.pending, (state, action) => {})
      .addCase(getMembersOfClass.fulfilled, (state, action) => {
        return {
          members: [...action.payload],
        };
      })
      .addCase(getMembersOfClass.rejected, (state, action) => {
        console.log(action);
      })
      .addCase(getUserByEmail.pending, (state, action) => {})
      .addCase(getUserByEmail.fulfilled, (state, action) => {
        console.log(action);
        return {
          ...state,
          searchUser: action.payload,
        };
      })
      .addCase(getUserByEmail.rejected, (state, action) => {
        console.log(action);
      });
  },
});

export const getMembersOfClass = createAsyncThunk(
  "member/getMembersOfClass",
  async (dataClass) => {
    try {
      const respone = await axiosInstance.post(`/member/get`, { ...dataClass });
      return respone.data;
    } catch (error) {
      throw new Error(error);
    }
  }
);

export const removeMemberFromClass = createAsyncThunk(
  "member/removeMemberFromClass",
  async (body) => {
    try {
      const respone = await axiosInstance.delete(`/member/delete`, {
        data: body,
      });
      return respone.data;
    } catch (error) {
      throw new Error(error);
    }
  }
);

export const getUserByEmail = createAsyncThunk(
  "member/getUserByEmail",
  async (email) => {
    try {
      const respone = await axiosInstance.post(`/member/get-user-by-email`, {
        params: email,
      });
      return respone.data;
    } catch (error) {
      throw new Error(error);
    }
  }
);

export const deleteRequestJoinClass = createAsyncThunk(
  "member/deleteRequestJoinClass",
  async (body) => {
    try {
      const respone = await axiosInstance.delete(
        `/member/delete-request-join-class`,
        {
          data: body,
        }
      );
      return respone.data;
    } catch (error) {
      throw new Error(error);
    }
  }
);

export const addUserToClass = createAsyncThunk(
  "member/addUserToClass",
  async (body) => {
    try {
      const respone = await axiosInstance.post(
        `/member/accept-request-join-class`,
        body
      );
      return respone.data;
    } catch (error) {
      throw new Error(error);
    }
  }
);
export default memberSlice.reducer;
