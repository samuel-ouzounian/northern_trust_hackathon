import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./apps/counterSlice";
import exchangeReducer from "./apps/conversionSlice";

export const makeStore = () => {
  return configureStore({
    reducer: { counter: counterReducer, exchange: exchangeReducer },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
