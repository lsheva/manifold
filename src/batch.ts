import { searchBinaryMarkets } from "./api";
import { trade } from "./trade";
import * as accounts from "../accounts.json";

async function main() {
  const numTickers = 5;
  const tradeIntervalMs = 10 * 60 * 1000; // 10 minutes
  const traders: { userName: string; apiKey: string }[] = accounts;

  console.log("Starting trading bot...");

  console.log("Number of traders:", traders.length);
  console.log("Number of tickers:", numTickers);
  console.log("Trade interval:", tradeIntervalMs, "ms");

  // load markets
  const markets = await searchBinaryMarkets(numTickers);
  console.log("Loaded", markets.length, "markets");
  console.log(markets.map((m) => m.id).join(", "));

  // trading loop
  const tradeLoops = traders.map((user) => {
    return markets.map((market) => {
      return trade(user.userName, user.apiKey, market.id, tradeIntervalMs);
    });
  });

  await Promise.all(tradeLoops.flat());
}

if (require.main === module) {
  main();
}
