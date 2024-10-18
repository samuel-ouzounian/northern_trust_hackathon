import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  setAmountToInvest,
  setAmountToReceive,
  setBaseRate,
  setConversionFee,
  setDailyForexData,
  setMonthlyForexData,
  setYearlyForexData,
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
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/router";
import { userHistory } from "@/utils/history";
import axios from "axios";

const ExchangePage = () => {
  const router = useRouter(); // Initialize the router

  const [info, setInfo] = useState<null | string[]>(null);

  const dispatch = useDispatch();
  const {
    baseRate,
    amountToInvest,
    amountToReceive,
    fromSymbol,
    toSymbol,
    conversionFee,
  } = useAppSelector((state) => state.exchange);
  const [graphInterval, setGraphInterval] = useState<
    "DAILY" | "MONTHLY" | "YEARLY"
  >("DAILY");
  const apiAdapter = useMemo(
    () => new ForexApiAdapter("13b83b39301485f447565dda"),
    []
  );
  const [usdRate, setUsdRate] = useState(0);
  const [usdFee, setUsdFee] = useState(0);
  const exchangeDate = new Date();
  const dailyData = useAppSelector((state) => state.exchange.dailyForexData);
  const monthlyData = useAppSelector(
    (state) => state.exchange.monthlyForexData
  );
  const yearlyData = useAppSelector((state) => state.exchange.yearlyForexData);

  const selectedForexData =
    graphInterval === "DAILY"
      ? dailyData
      : graphInterval === "MONTHLY"
      ? monthlyData
      : yearlyData;

  useEffect(() => {
    const fetchAllForexData = async () => {
      if (fromSymbol && toSymbol) {
        try {
          // Fetch DAILY data and update progressively
          await apiAdapter.getForexData(
            "DAILY",
            fromSymbol,
            toSymbol,
            (newDailyData) => {
              dispatch(setDailyForexData(newDailyData));
            }
          );

          // After DAILY data, fetch MONTHLY data
          await apiAdapter.getForexData(
            "MONTHLY",
            fromSymbol,
            toSymbol,
            (newMonthlyData) => {
              dispatch(setMonthlyForexData(newMonthlyData));
            }
          );

          // After MONTHLY data, fetch YEARLY data
          await apiAdapter.getForexData(
            "YEARLY",
            fromSymbol,
            toSymbol,
            (newYearlyData) => {
              dispatch(setYearlyForexData(newYearlyData));
            }
          );
        } catch (error) {
          console.error("Error fetching forex data:", error);
        }
      }
    };

    fetchAllForexData();
  }, [fromSymbol, toSymbol, dispatch, apiAdapter]);

  useEffect(() => {
    const fetchBaseRate = async () => {
      if (fromSymbol && toSymbol) {
        try {
          const latestRate = await apiAdapter.getLatestExchangeRate(
            fromSymbol,
            toSymbol
          );
          dispatch(setBaseRate(latestRate));
        } catch (error) {
          console.error("Error fetching the latest exchange rate:", error);
        }
      }
    };

    fetchBaseRate();
  }, [fromSymbol, toSymbol, dispatch, apiAdapter]);

  useEffect(() => {
    const getInfo = async () => {
      const data = await axios.post(
        "http://localhost:10000/pipeline/evaluate",
        {
          base: fromSymbol,
          target: toSymbol,
          tradeHistory: userHistory.getHistory({
            from: fromSymbol,
            to: toSymbol,
          }),
        }
      );

      if (data && data.data) setInfo(data.data.message);
    };

    if (toSymbol && fromSymbol) getInfo();
  }, [toSymbol, fromSymbol]);

  const handleConvertClick = () => {
    userHistory.setHistory({
      base: toSymbol,
      target: fromSymbol,
      amount: amountToInvest,
      convertedAmount: amountToReceive,
      exchangeRate: baseRate,
    });

    dispatch(setAmountToInvest(0));
    dispatch(setAmountToReceive(0));
    dispatch(setConversionFee(0));
  };

  useEffect(() => {
    apiAdapter.getConversionRateToUSD(fromSymbol).then((e) => {
      setUsdRate(e);
    });
  }, [fromSymbol, apiAdapter]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Remove commas and convert to a number
    const amount = inputValue
      ? parseFloat(inputValue.replace(/,/g, "")) || 0
      : 0;

    // Set conversion fee based on amount
    let conversionFee: number;
    switch (true) {
      case amount < 100000:
        conversionFee = 0.03;
        break;
      case amount >= 100000 && amount < 500000:
        conversionFee = 0.02;
        break;
      case amount >= 500000:
        conversionFee = 0.01;
        break;
      default:
        conversionFee = 0.03;
        break;
    }

    const usdAmount = amount * usdRate;
    const usdFee = usdAmount * conversionFee;
    setUsdFee(usdFee);

    // Dispatch the values to the Redux store
    dispatch(setConversionFee(amount * conversionFee));
    dispatch(setAmountToInvest(amount));
    dispatch(setAmountToReceive(amount * baseRate));
  };

  const handleIntervalChange = (interval: "DAILY" | "MONTHLY" | "YEARLY") => {
    setGraphInterval(interval);
  };

  const handleBackClick = () => {
    router.push("/"); // Navigate to the root path
  };

  return (
    <div className="flex flex-col justify-center p-20 ">
      <Button className="w-28 mb-6" onClick={handleBackClick}>
        {"< Back"}
      </Button>{" "}
      {/* Back Button */}
      <div className="flex w-full h-screen max-h-[800px] flex-row justify-center">
        <Card className="w-3/5 mr-4">
          <CardHeader>
            <CardTitle>
              {fromSymbol} / {toSymbol}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{baseRate.toFixed(3)}</div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={selectedForexData}>
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
                  type="text" // Change the input type to 'text' to allow formatting with commas
                  value={amountToInvest.toLocaleString()}
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
                <div className="flex flex-row gap-2">
                  <p>{usdFee.toFixed(2)} USD</p>
                  <Separator orientation="vertical" />
                  <p>
                    {conversionFee} {fromSymbol}
                  </p>
                </div>
              </div>
              <div>
                <Label>{"You'll receive"}</Label>
                <p className="text-xl font-bold">
                  {(amountToReceive - conversionFee).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  {toSymbol}
                </p>
              </div>
              <div>
                <Label>Exchange Date</Label>
                <p>{exchangeDate.toLocaleDateString()}</p>
              </div>

              <Button className="w-full" onClick={handleConvertClick}>
                Convert
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      {info !== null && (
        <Card className="py-8 my-4">
          <CardContent className="text-gray-200 flex gap-4 flex-col">
            {info.map((i) => (
              <p key={i}>{i}</p>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ExchangePage;
