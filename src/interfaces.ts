export interface Trade {
  traderId: number;
  asset: string;
  price: number;
  tp: number;
  sl: number;
  quantity: number;
}

export interface Order {
  userId: number;
  asset: string;
  quantity: number;
  price: number;
}

export interface TradeProvider {
  buyShares(trade: Order): Promise<void>;
  sellShares(trade: Order): Promise<void>;
  getPrice(asset: string): Promise<number>;
}
