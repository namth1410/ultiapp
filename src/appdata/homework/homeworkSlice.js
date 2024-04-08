import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "ultis/api";

const initialState = {
  status: "none",
  usersNotDoHomework: null,
  allResultOfHomework: null,
  recordsHomeworkOfUser: null,
  dataHomeworkById: null,
  loading: false,
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
      })
      .addCase(getUsersNotDoHomework.pending, (state, action) => {})
      .addCase(getUsersNotDoHomework.fulfilled, (state, action) => {
        return {
          ...state,
          usersNotDoHomework: [...action.payload],
        };
      })
      .addCase(getUsersNotDoHomework.rejected, (state, action) => {})
      .addCase(getAllResultOfHomework.pending, (state, action) => {})
      .addCase(getAllResultOfHomework.fulfilled, (state, action) => {
        return {
          ...state,
          allResultOfHomework: [...action.payload],
        };
      })
      .addCase(getAllResultOfHomework.rejected, (state, action) => {})
      .addCase(getDataRecordsHomeworkByUID.pending, (state, action) => {})
      .addCase(getDataRecordsHomeworkByUID.fulfilled, (state, action) => {
        return {
          ...state,
          recordsHomeworkOfUser: [...action.payload],
        };
      })
      .addCase(getDataRecordsHomeworkByUID.rejected, (state, action) => {})
      .addCase(getDataHomeworkById.pending, (state, action) => {})
      .addCase(getDataHomeworkById.fulfilled, (state, action) => {
        return {
          ...state,
          dataHomeworkById: { ...action.payload },
        };
      })
      .addCase(getDataHomeworkById.rejected, (state, action) => {})
      .addCase(uploadFile.pending, (state, action) => {
        return {
          ...state,
          loading: true,
        };
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        return {
          ...state,
          loading: false,
        };
      })
      .addCase(uploadFile.rejected, (state, action) => {
        return {
          ...state,
          loading: false,
        };
      });
  },
});

// đây là tất cả homework của 1 class
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

export const getUsersNotDoHomework = createAsyncThunk(
  "homework/getUsersNotDoHomework",
  async (body) => {
    try {
      const respone = await axiosInstance.post(
        `/homework/get-users-not-do-homework`,
        body
      );
      return respone.data;
    } catch (error) {
      throw new Error(error);
    }
  }
);

export const getAllResultOfHomework = createAsyncThunk(
  "homework/getAllResultOfHomework",
  async ({ homeworkId }) => {
    try {
      const respone = await axiosInstance.get(
        `/homework/get-all-result-of-homework/${homeworkId}`
      );
      console.log(respone.data);
      return respone.data;
    } catch (error) {
      throw new Error(error);
    }
  }
);

export const getDataRecordsHomeworkByUID = createAsyncThunk(
  "homework/getDataRecordsHomeworkByUID",
  async (body) => {
    try {
      const respone = await axiosInstance.post(
        `/homework/get-records-homework-by-uid`,
        body
      );
      return respone.data;
    } catch (error) {
      throw new Error(error);
    }
  }
);

export const getDataHomeworkById = createAsyncThunk(
  "homework/getDataHomeworkById",
  async (body) => {
    try {
      const respone = await axiosInstance.post(
        `/homework/get-data-homework-by-id`,
        body
      );
      return respone.data;
    } catch (error) {
      throw new Error(error);
    }
  }
);

export const updateHomeworkById = createAsyncThunk(
  "homework/updateHomeworkById",
  async (body) => {
    try {
      const respone = await axiosInstance.post(
        `/homework/update-homework-by-id`,
        body
      );
      return respone.data;
    } catch (error) {
      throw new Error(error);
    }
  }
);

export const uploadFile = createAsyncThunk(
  "homework/uploadFile",
  async (body) => {
    const { classId, file, nameFile } = body;
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("classId", classId);
      formData.append("nameFile", nameFile);

      const response = await axiosInstance.post(
        `/homework/upload-file`,
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

export const { setStatus } = homeworkSlice.actions;

export default homeworkSlice.reducer;
