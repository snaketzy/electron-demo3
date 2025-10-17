import { createSlice, current }  from "@reduxjs/toolkit";
import {getInitPagination} from "../utils/commonUtil";
import {iPagination} from "./commonSlice";

/** 用户列表查询入参接口 */
export interface SearchParams {
  name: string;
  userName: string;
  isadminSide: number;
  status: string;
  pageIndex: number;
  pageSize: number;
}

export interface UserList {
  id: number;
  name: string;
  userName: string;
  userpassword: string;
  wzUserID: string;
  isadminSide: number;
  robotsNumber: number;
  status: number;
  isDel: boolean;
  createName: string | null;
  createtime: string;
  updateName: string | null;
  updatetime: string;
}

/** 用户列表state接口 */
export interface AdminIndexSliceType {
  searchParams: SearchParams;
  pagination: iPagination;
  userList: UserList[];
}

/** 初始化查询入参 */
export const initialSearchParams: SearchParams = {
  name: "",
  userName: "",
  isadminSide: 0,
  status: "",
  pageIndex: getInitPagination().current,
  pageSize: getInitPagination().pageSize
}

export const initialAdminIndexState: AdminIndexSliceType = {
  searchParams: {...initialSearchParams},
  pagination: {
    pageSize: 25,
    current: 1,
    total: 0
  },
  userList: []
}

export const adminIndexSlice = createSlice({
  name: "adminIndexModule",
  initialState: initialAdminIndexState,
  reducers: {
    updateAdminIndexState: (state, action) => {
      const currentDraft = current(state);
      return {
        ...currentDraft,
        ...action.payload
      }
    }
  }
})

export const { updateAdminIndexState } = adminIndexSlice.actions;

export default adminIndexSlice.reducer;