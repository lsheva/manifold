import { randomUUID } from "node:crypto";
import type { Trade, TradeProvider } from "../interfaces";
import { sleep } from "../utils";

interface TradeOrder {
  trade: Trade;
  isPurchased: boolean;
  isSold: boolean;
}

export class TradeWatcher {
  assetsMap: Map<string, TradeOrder[]>;
  checkIntervalMs: number;
  tradeProvider: TradeProvider;

  constructor(tradeProvider: TradeProvider, checkIntervalMs: number) {
    this.assetsMap = new Map();
    this.checkIntervalMs = checkIntervalMs;
    this.tradeProvider = tradeProvider;
  }

  async startWatching(): Promise<void> {
    while (true) {
      console.log("\nWatching asset prices...");
      await sleep(this.checkIntervalMs);

      for (const [asset, trades] of this.assetsMap.entries()) {
        const price = await this.tradeProvider.getPrice(asset);
        console.log(`\nPrice of ${asset} is\t$${price}`);

        for (const order of trades) {
          // check if the order is not already purchased
          if (!order.isPurchased) {
            if (price >= order.trade.price) {
              await this.tradeProvider.buyShares({
                userId: order.trade.traderId,
                asset: order.trade.asset,
                quantity: order.trade.quantity,
                price: price,
              });
              order.isPurchased = true;
              continue;
            }
          }

          // check if the order is not already sold
          if (!order.isSold) {
            if (price >= order.trade.tp || price <= order.trade.sl) {
              await this.tradeProvider.sellShares({
                userId: order.trade.traderId,
                asset,
                quantity: order.trade.quantity,
                price,
              });
              order.isSold = true;
            }
          }
        }
      }
    }
  }

  async addTrade(trade: Trade): Promise<string> {
    if (!this.assetsMap.has(trade.asset)) {
      this.assetsMap.set(trade.asset, []);
    }
    const index = this.assetsMap
      .get(trade.asset)
      ?.push({ trade, isPurchased: false, isSold: false });

    const tradeId = randomUUID();
    return tradeId;
  }
}
