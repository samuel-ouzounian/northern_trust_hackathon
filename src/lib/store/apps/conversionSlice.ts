import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ExchangeState {
  display: boolean;
  exchangeRate: number;
  amountToInvest: number;
  amountToReceive: number;
  fromSymbol: string;
  toSymbol: string;
  exchangeDate: string;
  conversionFees: number;
}

const initialState: ExchangeState = {
  display: false,
  exchangeRate: 5,
  amountToInvest: 0,
  amountToReceive: 0,
  fromSymbol: "",
  toSymbol: "",
  exchangeDate: "",
  conversionFees: 0,
};

const exchangeSlice = createSlice({
  name: "exchange",
  initialState,
  reducers: {
    setDisplay: (state, action: PayloadAction<boolean>) => {
      state.display = action.payload;
    },
    setExchangeRate: (state, action: PayloadAction<number>) => {
      state.exchangeRate = action.payload;
    },
    setAmountToReceive: (state, action: PayloadAction<number>) => {
      state.amountToReceive = action.payload;
    },
    setAmountToInvest: (state, action: PayloadAction<number>) => {
      state.amountToInvest = action.payload;
    },
    setSymbols: (
      state,
      action: PayloadAction<{ from: string; to: string }>
    ) => {
      state.fromSymbol = action.payload.from;
      state.toSymbol = action.payload.to;
    },
    setExchangeDate: (state, action: PayloadAction<string>) => {
      state.exchangeDate = action.payload;
    },
    setConversionFees: (state, action: PayloadAction<number>) => {
      state.conversionFees = action.payload;
    },
  },
});

export const {
  setDisplay,
  setExchangeRate,
  setAmountToInvest,
  setAmountToReceive,
  setSymbols,
  setExchangeDate,
  setConversionFees,
} = exchangeSlice.actions;

export default exchangeSlice.reducer;
