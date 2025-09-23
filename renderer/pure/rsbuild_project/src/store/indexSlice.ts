import { createSlice, current }  from "@reduxjs/toolkit";

export const initialIndexState = {
  stepListFrom: undefined,
  addCardFrom: undefined
}

export const indexSlice = createSlice({
  name: "indexModule",
  initialState: initialIndexState,
  reducers: {
    updateIndexState: (state, action) => {
      const currentDraft = current(state);
      return {
        ...currentDraft,
        ...action.payload
      }
    }
  }
})

export const { updateIndexState } = indexSlice.actions;

export default indexSlice.reducer;