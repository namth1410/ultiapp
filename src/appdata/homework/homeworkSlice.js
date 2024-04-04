import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "ultis/api";

const initialState = {
  status: "none",
};

export const homeworkSlice = createSlice({
  name: "member",
  initialState,
  reducers: {
    setStatus: (state, action) => {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteHomework.pending, (state, action) => {})
      .addCase(deleteHomework.fulfilled, (state, action) => {})
      .addCase(deleteHomework.rejected, (state, action) => {
        console.log(action);
      })
      .addCase(addHomework.pending, (state, action) => {
        return {
          ...state,
          status: "pending",
        };
      })
      .addCase(addHomework.fulfilled, (state, action) => {
        return {
          ...state,
          status: "fulfilled",
        };
      })
      .addCase(addHomework.rejected, (state, action) => {
        console.log(action);
      });
  },
});

export const snapshotDataHomework = createAsyncThunk(
  "class/snapshotDataHomework",
  async ({ id }) => {
    try {
      const respone = await axiosInstance.get(`/homework/snapshot/${id}`);
      return respone.data;
    } catch (error) {
      throw new Error(error);
    }
  }
);

export const addHomework = createAsyncThunk(
  "homework/addHomework",
  async (body) => {
    const {
      classId,
      config,
      currentUser,
      correctAnswer,
      nameHomework,
      file,
      nameFile,
    } = body;
    try {
      const formData = new FormData();
      formData.append("classId", classId);
      formData.append("file", file);
      formData.append("currentUser", JSON.stringify(currentUser));
      formData.append("config", config);
      formData.append("correctAnswer", correctAnswer);
      formData.append("nameHomework", nameHomework);
      formData.append("nameFile", nameFile);

      const response = await axiosInstance.post(`/homework/post`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  }
);

export const deleteHomework = createAsyncThunk(
  "homework/deleteHomework",
  async (body) => {
    try {
      const respone = await axiosInstance.delete(`/homework/delete`, {
        data: body,
      });
      return respone.data;
    } catch (error) {
      throw new Error(error);
    }
  }
);

export const { setStatus } = homeworkSlice.actions;

export default homeworkSlice.reducer;
