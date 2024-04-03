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
      .addCase(getNewsfeedOfClass.rejected, (state, action) => {})
      .addCase(postNewsfeed.pending, (state, action) => {})
      .addCase(postNewsfeed.fulfilled, (state, action) => {})
      .addCase(postNewsfeed.rejected, (state, action) => {})
      .addCase(deleteNewsfeed.pending, (state, action) => {})
      .addCase(deleteNewsfeed.fulfilled, (state, action) => {})
      .addCase(deleteNewsfeed.rejected, (state, action) => {})
      .addCase(postCommentNewsfeed.pending, (state, action) => {})
      .addCase(postCommentNewsfeed.fulfilled, (state, action) => {})
      .addCase(postCommentNewsfeed.rejected, (state, action) => {});
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

export const postNewsfeed = createAsyncThunk(
  "class/postNewsfeed",
  async ({ body }) => {
    const { classId, imageNewFeed, currentUser, content } = body;
    try {
      const formData = new FormData();
      formData.append("classId", classId);
      formData.append("imageNewFeed", imageNewFeed);
      formData.append("currentUser", JSON.stringify(currentUser));
      formData.append("content", content);

      const response = await axiosInstance.post(
        `/newsfeed/post-newsfeed`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  }
);

export const deleteNewsfeed = createAsyncThunk(
  "class/deleteNewsfeed",
  async ({ newsfeedId }) => {
    try {
      const respone = await axiosInstance.delete(
        `/newsfeed/delete-newsfeed/${newsfeedId}`
      );
      return respone.data;
    } catch (error) {
      throw new Error(error);
    }
  }
);

export const postCommentNewsfeed = createAsyncThunk(
  "class/postCommentNewsfeed",
  async ({ body }) => {
    try {
      const respone = await axiosInstance.post(`/newsfeed/post-comment`, body);
      return respone.data;
    } catch (error) {
      throw new Error(error);
    }
  }
);
export default classSlice.reducer;
