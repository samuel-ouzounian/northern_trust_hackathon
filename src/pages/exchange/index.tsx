import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  setAmountToInvest,
  setAmountToReceive,
  setSymbols,
  setExchangeDate,
  setForexData,
  setBaseRate,
} from "@/lib/store/apps/conversionSlice";
import { useAppSelector } from "@/lib/store/hooks";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import ForexApiAdapter from "@/lib/adapters/forexApiAdapter";

const ExchangePage = () => {
  const dispatch = useDispatch();
  const {
    baseRate,
    amountToInvest,
    amountToReceive,
    fromSymbol,
    toSymbol,
    exchangeDate,
    conversionFee,
    forexData,
  } = useAppSelector((state) => state.exchange);
  const [graphInterval, setGraphInterval] = useState<
    "DAILY" | "MONTHLY" | "YEARLY"
  >("DAILY");

  const fetchForexData = useCallback(
    async (interval, fromSymbolParam, toSymbolParam) => {
      const apiAdapter = new ForexApiAdapter("13b83b39301485f447565dda");
      try {
        // const forexData = await apiAdapter.getForexData(
        //   interval,
        //   fromSymbolParam,
        //   toSymbolParam
        // );
        // dispatch(setForexData(forexData as any));
        // if (forexData.length > 0) {
        //   dispatch(setBaseRate(forexData[forexData.length - 1].rate));
        // }
      } catch (error) {
        console.error("Error fetching forex data:", error);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    // if (effectRan.current === false) {
    if (fromSymbol && toSymbol) {
      fetchForexData(graphInterval, fromSymbol, toSymbol);
    }
    // effectRan.current = true;
  }, [graphInterval]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Remove leading zeros and convert to number
    const amount = inputValue
      ? parseFloat(inputValue.replace(/^0+/, "")) || 0
      : 0;

    dispatch(setAmountToInvest(amount));
    dispatch(setAmountToReceive(amount * baseRate));
  };

  const handleIntervalChange = (interval: "DAILY" | "MONTHLY" | "YEARLY") => {
    setGraphInterval(interval);
  };

  return (
    <div className="flex w-[100vw] h-screen max-h-[800px] flex-row justify-between p-20 ">
      <Card className="w-3/5 mr-4">
        <CardHeader>
          <CardTitle>
            {fromSymbol} / {toSymbol}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold mb-2">{baseRate.toFixed(2)}</div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={forexData}>
              <XAxis dataKey="date" padding={{ left: 30, right: 30 }} />{" "}
              <YAxis
                domain={["auto", "auto"]}
                padding={{ top: 20, bottom: 20 }}
              />{" "}
              <Tooltip />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="#8884d8"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 ">
            <select
              className="w-32 p-2 border rounded-md"
              onChange={(e) =>
                handleIntervalChange(
                  e.target.value as "DAILY" | "MONTHLY" | "YEARLY"
                )
              }
            >
              <option value="DAILY">Daily</option>
              <option value="MONTHLY">Monthly</option>
              <option value="YEARLY">Yearly</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card className="w-2/5">
        <CardHeader>
          <CardTitle>Currency Converter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                value={amountToInvest.toString()}
                onChange={handleAmountChange}
              />
            </div>
            <div className="flex flex-row">
              <div className="w-1/2">
                <Label htmlFor="fromCurrency">From</Label>
                <div className="select-label font-bold" id="fromCurrency">
                  {fromSymbol || "Select currency"}
                </div>
              </div>
              <div className="w-1/2">
                <Label htmlFor="toCurrency">To</Label>
                <div className="select-label font-bold" id="toCurrency">
                  {toSymbol || "Select currency"}
                </div>
              </div>
            </div>

            <div>
              <Label>Exchange Rate</Label>
              <p className="text-lg font-semibold">
                1 {fromSymbol} = {baseRate} {toSymbol}
              </p>
            </div>
            <div>
              <Label>Conversion Fee</Label>
              <p>
                {conversionFee} {fromSymbol}
              </p>
            </div>
            <div>
              <Label>You'll receive</Label>
              <p className="text-xl font-bold">
                {amountToReceive.toFixed(2)} {toSymbol}
              </p>
            </div>
            <div>
              <Label>Exchange Date</Label>
              <p>{exchangeDate}</p>
            </div>

            <Button className="w-full">Convert</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExchangePage;
