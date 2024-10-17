import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const counterSlice = createSlice({
  name: "counter",
  initialState: 0,
  reducers: {
    increment: (state) => state + 1,
    decrement: (state) => state - 1,
    incrementByAmount: (state, action: PayloadAction<number>) =>
      state + action.payload,
  },
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;

// Export the reducer as the default export
export default counterSlice.reducer;
