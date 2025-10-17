import { createSlice, current }  from "@reduxjs/toolkit";

export interface iPagination {
  pageSize: number;
  current: number;
  total?: number;
  totalPages?: number;
}

export interface LoginUserInfo {
  name: string;
  userName: string;
  wzUserID: string;
  isadminSide: string;
  robotCode: string;
  robotName: string;
  bindBoos: string;
  allowallowedStarttime: string;
  allowallowedEndtime: string;
  allowRunningWeek: string;
  robotID: string;
  userID: string;
  token: string;
  isAIagent: string;
}

export interface CommonState {
  loginUserInfo: LoginUserInfo | undefined;
}

export const initialCommonState: CommonState = {
  loginUserInfo: undefined
}

export const commonSlice = createSlice({
  name: "commonModule",
  initialState: initialCommonState,
  reducers: {
    updateCommonState: (state, action) => {
      const currentDraft = current(state);
      return {
        ...currentDraft,
        ...action.payload
      }
    }
  }
})

export const { updateCommonState } = commonSlice.actions;

export default commonSlice.reducer;