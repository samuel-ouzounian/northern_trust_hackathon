import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ForexData {
  date: string;
  close: number;
}

interface ExchangeState {
  baseRate: number;
  amountToInvest: number;
  amountToReceive: number;
  fromSymbol: string;
  toSymbol: string;
  exchangeDate: string;
  conversionFee: number;
  forexData: ForexData[];
}

const initialState: ExchangeState = {
  baseRate: 0,
  amountToInvest: 0,
  amountToReceive: 0,
  fromSymbol: "EUR",
  toSymbol: "USD",
  exchangeDate: "10/17/2024",
  conversionFee: 0,
  forexData: [],
};

const exchangeSlice = createSlice({
  name: "exchange",
  initialState,
  reducers: {
    setBaseRate: (state, action: PayloadAction<number>) => {
      state.baseRate = action.payload;
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
    setConversionFee: (state, action: PayloadAction<number>) => {
      console.log("test");
      state.conversionFee = action.payload;
    },
    setForexData: (state, action: PayloadAction<ForexData[]>) => {
      state.forexData = action.payload;
    },
  },
});

export const {
  setBaseRate,
  setAmountToInvest,
  setAmountToReceive,
  setSymbols,
  setExchangeDate,
  setConversionFee,
  setForexData,
} = exchangeSlice.actions;

export default exchangeSlice.reducer;
