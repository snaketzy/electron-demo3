import { combineReducers, configureStore } from "@reduxjs/toolkit";
import commonSlice, { CommonState } from "./commonSlice";
import indexSlice from "./indexSlice";
import adminIndexSlice from "./adminIndexSlice";

const rootReducer = combineReducers({
  commonModule: commonSlice,
  indexModule: indexSlice,
  adminIndexModule: adminIndexSlice
});

export type ApplicationState = ReturnType<typeof rootReducer>;

export default configureStore({
  reducer: {
    commonModule: commonSlice,
    indexModule: indexSlice,
    adminIndexModule: adminIndexSlice
  }
})