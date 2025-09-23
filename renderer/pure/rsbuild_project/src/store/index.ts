import { combineReducers, configureStore } from "@reduxjs/toolkit";
import commonSlice, { CommonState } from "./commonSlice";
import indexSlice from "./indexSlice";

const rootReducer = combineReducers({
  commonModule: commonSlice
});

export type ApplicationState = ReturnType<typeof rootReducer>;

export default configureStore({
  reducer: {
    commonModule: commonSlice,
    indexModule: indexSlice
  }
})