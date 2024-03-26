import { configureStore } from "@reduxjs/toolkit";
import classesSlice from "./classes/classesSlice";

export const store = configureStore({
  reducer: {
    classesRedux: classesSlice,
  },
});
