import { configureStore } from "@reduxjs/toolkit";
import classesSlice from "./classes/classesSlice";
import classSlice from "./class/classSlice";

export const store = configureStore({
  reducer: {
    classesRedux: classesSlice,
    classRedux: classSlice,
  },
});
