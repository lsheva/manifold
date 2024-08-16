import { assets } from "./fixtures";
import type { Trade } from "./interfaces";
import { randomInt, sleep } from "./utils";

async function main() {
  const numTraders = 5;
  const tradeIntervalMs = 10 * 60 * 1000; // 10 minutes

  while (true) {
    for (let i = 0; i < numTraders; i++) {
      for (let j = 0; j < assets.length; j++) {
        const traderId = i;
        const asset = assets[j];
        const price = randomInt(0.9 * asset.price, 1.1 * asset.price);
        const tp = price + randomInt(1, 10);
        const sl = price - randomInt(1, 10);
        const quantity = randomInt(1, 10);

        await postTrade({ traderId, asset: asset.ticker, price, tp, sl, quantity });
        console.log(
          `Trader ${traderId} is buying ${quantity} shares of ${asset.ticker} at $${price} with TP: $${tp} and SL: $${sl}`
        );
      }
    }
    await sleep(tradeIntervalMs);
  }
}

async function postTrade(trade: Trade): Promise<string> {
  const baseURL = "http://localhost:3000";
  try {
    return await fetch(`${baseURL}/trades`, {
      method: "POST",
      body: JSON.stringify(trade),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => data.id as string);
  } catch (e) {
    console.error("trade failed", e);
    throw e;
  }
}

main();
