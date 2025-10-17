import { createSlice, current }  from "@reduxjs/toolkit";

export interface iPagination {
  pageSize: number;
  current: number;
  total?: number;
  totalPages?: number;
}


export interface CommonState {
  [x: string]: string | undefined;
  frontIdCard: string;
  backIdCard: string;
  sendMsgCheckCodeUrl: string;
  stepListFrom: string | undefined;
  addCardFrom: string | undefined;
  huamingce_upload: string | undefined;
  groupCode: string;
  qrcodeUrl: string;
  qrcode: string;
  storageKey: string;
  /** url上的base64参数 */
  base64: string;
  huamingceToken: string;
  huamingce_business_data: string;
}

export const initialCommonState: CommonState = {
  frontIdCard: "",
  backIdCard: "",
  sendMsgCheckCodeUrl: "",
  stepListFrom: undefined,
  addCardFrom: undefined,
  huamingce_upload: undefined,
  groupCode: "",
  qrcodeUrl: "",
  qrcode: "",
  storageKey: "",
  base64: "",
  huamingceToken:"",
  huamingce_business_data: ""
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