import { configureStore } from "@reduxjs/toolkit";
import classSlice from "./class/classSlice";
import classesSlice from "./classes/classesSlice";
import memberSlice from "./member/memberSlice";
import newsfeedSlice from "./newsfeed/newsfeedSlice";

export const store = configureStore({
  reducer: {
    classesRedux: classesSlice,
    classRedux: classSlice,
    newsfeedRedux: newsfeedSlice,
    memberRedux: memberSlice,
  },
});
