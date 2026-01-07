import { createSlice } from "@reduxjs/toolkit";

const initialState: Record<string, any> = {};

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    updateField: (state, action) => {
      const { key, value } = action.payload;
      state[key] = value;
    },
    resetForm: () => initialState,
  },
});

export const { updateField, resetForm } = formSlice.actions;
export default formSlice.reducer;
