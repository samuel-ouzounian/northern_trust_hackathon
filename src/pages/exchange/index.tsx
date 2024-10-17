import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Line } from "react-chartjs-2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  setDisplay,
  setExchangeRate,
  setAmountToInvest,
  setAmountToReceive,
  setSymbols,
  setExchangeDate,
  setConversionFees,
} from "@/lib/store/apps/conversionSlice";
import { useAppSelector } from "@/lib/store/hooks";

const ExchangePage = () => {
  const dispatch = useDispatch();
  const exchange = useAppSelector((state: any) => state.exchange);
  const [timeFrame, setTimeFrame] = useState("1W");
  const [historicalRates, setHistoricalRates] = useState([]);

  useEffect(() => {
    // Fetch historical rates based on timeFrame
    fetchHistoricalRates(timeFrame);
  }, [timeFrame]);

  const fetchHistoricalRates = async (period: any) => {
    // Implement API call to fetch historical rates
    // For this example, we'll use mock data
    const mockData = [
      { date: "2023-10-10", rate: 1.05 },
      { date: "2023-10-11", rate: 1.06 },
      { date: "2023-10-12", rate: 1.07 },
      { date: "2023-10-13", rate: 1.08 },
      { date: "2023-10-14", rate: 1.09 },
    ];
    // setHistoricalRates(mockData);
  };

  const handleAmountToInvestChange = (e) => {
    const amount = parseFloat(e.target.value);
    dispatch(setAmountToInvest(amount));
    dispatch(setAmountToReceive(amount * exchange.exchangeRate));
  };

  const handleExchangeRateChange = (e) => {
    const rate = parseFloat(e.target.value);
    dispatch(setExchangeRate(rate));
    dispatch(setAmountToReceive(exchange.amountToInvest * rate));
  };

  const handleSymbolChange = (from, to) => {
    dispatch(setSymbols({ from, to }));
  };

  const chartData = {
    labels: historicalRates.map((item) => item.date),
    datasets: [
      {
        label: "Exchange Rate",
        data: historicalRates.map((item) => item.rate),
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Currency Exchange</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Exchange Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="amountToInvest">Amount to Invest</Label>
                <Input
                  id="amountToInvest"
                  type="number"
                  value={exchange.amountToInvest}
                  onChange={handleAmountToInvestChange}
                />
              </div>
              <div>
                <Label htmlFor="exchangeRate">Exchange Rate</Label>
                <Input
                  id="exchangeRate"
                  type="number"
                  value={exchange.exchangeRate}
                  onChange={handleExchangeRateChange}
                  readOnly={true}
                />
              </div>
              <div>
                <Label htmlFor="amountToReceive">Amount to Receive</Label>
                <Input
                  id="amountToReceive"
                  type="number"
                  value={exchange.amountToReceive}
                  readOnly
                />
              </div>
              <div className="flex space-x-4">
                <div>
                  <Label htmlFor="fromSymbol">From</Label>
                  <Select
                    onValueChange={(value) =>
                      handleSymbolChange(value, exchange.toSymbol)
                    }
                    defaultValue={exchange.fromSymbol}
                  >
                    <SelectTrigger id="fromSymbol">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="toSymbol">To</Label>
                  <Select
                    onValueChange={(value) =>
                      handleSymbolChange(exchange.fromSymbol, value)
                    }
                    defaultValue={exchange.toSymbol}
                  >
                    <SelectTrigger id="toSymbol">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* <Card>
          <CardHeader>
            <CardTitle>Historical Exchange Rates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Label htmlFor="timeFrame">Time Frame</Label>
              <Select onValueChange={setTimeFrame} defaultValue={timeFrame}>
                <SelectTrigger id="timeFrame">
                  <SelectValue placeholder="Select time frame" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1W">1 Week</SelectItem>
                  <SelectItem value="1M">1 Month</SelectItem>
                  <SelectItem value="3M">3 Months</SelectItem>
                  <SelectItem value="1Y">1 Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="h-64">
              <Line
                data={chartData}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </div>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
};

export default ExchangePage;
