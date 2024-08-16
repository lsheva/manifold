import { assets } from "./fixtures";
import type { Order } from "./interfaces";
import { randomInt } from "./utils";

export class TradeProviderApiMock {
  buyShares(trade: Order): Promise<void> {
    console.log(
      `Trader ${trade.userId}: buying ${trade.quantity} ${trade.asset} at $${trade.price}`
    );
    return Promise.resolve();
  }

  sellShares(trade: Order): Promise<void> {
    console.log(
      `Trader ${trade.userId}: selling ${trade.quantity} ${trade.asset} at $${trade.price}`
    );
    return Promise.resolve();
  }

  getPrice(asset: string): Promise<number> {
    const price = assets.find((a) => a.ticker === asset)?.price;
    if (!price) {
      throw new Error(`Asset ${asset} not found`);
    }
    return Promise.resolve(randomInt(0.9 * price, 1.1 * price));
  }
}
