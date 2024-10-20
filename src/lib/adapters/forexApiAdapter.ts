import axios from "axios";

interface ForexData {
  date: string;
  rate: number;
}

interface ApiResponse {
  result: string;
  base_code: string;
  conversion_rates: { [key: string]: number };
}

class ForexApiAdapter {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.baseUrl = "https://v6.exchangerate-api.com/v6";
  }

  private async fetchData(
    fromSymbol: string,
    toSymbol: string,
    date: Date
  ): Promise<ApiResponse> {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const url = `${this.baseUrl}/${this.apiKey}/history/${fromSymbol}/${year}/${month}/${day}`;

    try {
      const response = await axios.get<ApiResponse>(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching forex data:", error);
      throw error;
    }
  }

  private async fetchDataForRange(
    fromSymbol: string,
    toSymbol: string,
    startDate: Date,
    endDate: Date,
    interval: "DAILY" | "MONTHLY" | "YEARLY",
    onDataFetched: (data: ForexData[]) => void // New callback function
  ): Promise<void> {
    const currentDate = new Date(startDate);

    const data: ForexData[] = [];

    while (currentDate <= endDate) {
      const response = await this.fetchData(fromSymbol, toSymbol, currentDate);
      if (response.result === "success") {
        const newData = {
          date: currentDate.toISOString().split("T")[0],
          rate: response.conversion_rates[toSymbol],
        };

        data.push(newData);
        const updatedData = [...data, newData];
        onDataFetched(updatedData);
      }

      switch (interval) {
        case "DAILY":
          currentDate.setDate(currentDate.getDate() + 1);
          break;
        case "MONTHLY":
          currentDate.setMonth(currentDate.getMonth() + 1);
          break;
        case "YEARLY":
          currentDate.setFullYear(currentDate.getFullYear() + 1);
          break;
      }
    }
  }

  public async getForexData(
    interval: "DAILY" | "MONTHLY" | "YEARLY",
    fromSymbol: string,
    toSymbol: string,
    onDataFetched: (data: ForexData[]) => void
  ): Promise<void> {
    const endDate = new Date();
    let startDate: Date;

    switch (interval) {
      case "DAILY":
        startDate = new Date(endDate);
        startDate.setDate(endDate.getDate() - 7);
        break;
      case "MONTHLY":
        startDate = new Date(endDate);
        startDate.setMonth(endDate.getMonth() - 12);
        break;
      case "YEARLY":
        startDate = new Date(endDate);
        startDate.setFullYear(endDate.getFullYear() - 5);
        break;
    }

    await this.fetchDataForRange(
      fromSymbol,
      toSymbol,
      startDate,
      endDate,
      interval,
      onDataFetched
    );
  }

  public async getConversionRateToUSD(fromSymbol: string): Promise<number> {
    try {
      const response = await this.fetchData(fromSymbol, "USD", new Date());

      if (response.result === "success") {
        return response.conversion_rates["USD"];
      } else {
        throw new Error("Failed to fetch conversion rate");
      }
    } catch (error) {
      console.error("Error getting conversion rate:", error);
      throw error;
    }
  }
  public async getLatestExchangeRate(
    fromSymbol: string,
    toSymbol: string
  ): Promise<number> {
    try {
      const url = `${this.baseUrl}/${this.apiKey}/latest/${fromSymbol}`;
      const response = await axios.get<ApiResponse>(url);

      if (response.data.result === "success") {
        return response.data.conversion_rates[toSymbol];
      } else {
        throw new Error("Failed to fetch the latest exchange rate");
      }
    } catch (error) {
      console.error("Error fetching the latest exchange rate:", error);
      throw error;
    }
  }
}

export default ForexApiAdapter;
