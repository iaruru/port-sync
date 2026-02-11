export interface Asset {
  id: string;
  ticker: string;
  quantity: number; // Integer >= 0
  price: number; // Number >= 0
  targetWeight: number; // Percentage 0-100
}

export type RebalanceMode = "full" | "noSell";

export interface PortfolioState {
  assets: Asset[];
  cash: number;
  rebalanceMode: RebalanceMode;
}

export interface RebalanceResult {
  assetId: string;
  ticker: string;
  action: "buy" | "sell" | "hold";
  quantity: number; // Integer
  amount: number; // Positive number
  projectedWeight: number; // Percentage
}
