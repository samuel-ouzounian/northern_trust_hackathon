export type HistoryType = {
  base: string;
  target: string;
  exchangeRate: number;
  amount: number;
  convertedAmount: number;
};

class UserHistory {
  private history: HistoryType[] = [];

  setHistory(record: HistoryType) {
    this.history.push(record);
  }

  getHistory(filter: { to: string; from: string }) {
    return this.history
      .filter((r) => r.base == filter.from && r.target == filter.to)
      .map((r) => ({
        exchangeRate: r.exchangeRate,
        amount: r.amount,
        convertedAmount: r.convertedAmount,
      }));
  }
}

export const userHistory = new UserHistory();
