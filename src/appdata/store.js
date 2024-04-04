import { configureStore } from "@reduxjs/toolkit";
import classSlice from "./class/classSlice";
import classesSlice from "./classes/classesSlice";
import homeworkSlice from "./homework/homeworkSlice";
import memberSlice from "./member/memberSlice";
import newsfeedSlice from "./newsfeed/newsfeedSlice";

export const store = configureStore({
  reducer: {
    classesRedux: classesSlice,
    classRedux: classSlice,
    newsfeedRedux: newsfeedSlice,
    memberRedux: memberSlice,
    homeworkRedux: homeworkSlice,
  },
});
