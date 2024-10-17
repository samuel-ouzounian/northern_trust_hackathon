class ExchangeRateAdapter {
  private apiKey: string;
  private baseUrl: string = "https://v6.exchangerate-api.com/v6";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async pairConversion(
    baseCode: string,
    targetCode: string,
    amount?: number
  ): Promise<PairConversionResponse> {
    const url = `${this.baseUrl}/${this.apiKey}/pair/${baseCode}/${targetCode}${
      amount ? `/${amount}` : ""
    }`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async historicalData(
    baseCode: string,
    year: number,
    month: number,
    day: number
  ): Promise<HistoricalDataResponse> {
    const url = `${this.baseUrl}/${this.apiKey}/history/${baseCode}/${year}/${month}/${day}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}

interface PairConversionResponse {
  result: string;
  documentation: string;
  terms_of_use: string;
  time_last_update_unix: number;
  time_last_update_utc: string;
  time_next_update_unix: number;
  time_next_update_utc: string;
  base_code: string;
  target_code: string;
  conversion_rate: number;
  conversion_result?: number;
}

interface HistoricalDataResponse {
  result: string;
  documentation: string;
  terms_of_use: string;
  time_last_update_unix: number;
  time_last_update_utc: string;
  base_code: string;
  year: number;
  month: number;
  day: number;
  conversion_rates: Record<string, number>;
}
