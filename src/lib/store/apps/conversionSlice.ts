import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ForexData {
  date: string;
  rate: number;
}

interface ExchangeState {
  baseRate: number;
  amountToInvest: number;
  amountToReceive: number;
  fromSymbol: string;
  toSymbol: string;
  conversionFee: number;
  dailyForexData: ForexData[];
  monthlyForexData: ForexData[];
  yearlyForexData: ForexData[];
}

const initialState: ExchangeState = {
  baseRate: 0,
  amountToInvest: 0,
  amountToReceive: 0,
  fromSymbol: "EUR",
  toSymbol: "JPY",
  conversionFee: 0,
  dailyForexData: [],
  monthlyForexData: [],
  yearlyForexData: [],
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
    setConversionFee: (state, action: PayloadAction<number>) => {
      state.conversionFee = action.payload;
    },
    setDailyForexData: (state, action: PayloadAction<ForexData[]>) => {
      state.dailyForexData = action.payload;
    },
    setMonthlyForexData: (state, action: PayloadAction<ForexData[]>) => {
      state.monthlyForexData = action.payload;
    },
    setYearlyForexData: (state, action: PayloadAction<ForexData[]>) => {
      state.yearlyForexData = action.payload;
    },
  },
});

export const {
  setBaseRate,
  setAmountToInvest,
  setAmountToReceive,
  setSymbols,
  setConversionFee,
  setDailyForexData,
  setMonthlyForexData,
  setYearlyForexData,
} = exchangeSlice.actions;

export default exchangeSlice.reducer;
