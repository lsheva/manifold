import Fastify from "fastify";
import type { Trade } from "./interfaces";
import { TradeWatcher } from "./trade-watcher";
import { TradeProviderApiMock } from "./trade-provider-api";

async function main() {
  const port = 3000;
  const checkIntervalMs = 5000;

  const fastify = Fastify({
    logger: false,
  });

  const tradeProvider = new TradeProviderApiMock();
  const tradeWatcher = new TradeWatcher(tradeProvider, checkIntervalMs);

  fastify.post("/trades", async (req, res) => {
    const trade = req.body as Trade;

    const id = await tradeWatcher.addTrade(trade);
    console.log(
      `added trade ${id}\ntraderId: ${trade.traderId} ${trade.asset} $${trade.price}, TP $${trade.tp}, SL $${trade.sl}, qty ${trade.quantity}\n`
    );

    return { id };
  });

  try {
    const watcherPromise = tradeWatcher.startWatching();
    const serverPromise = fastify.listen({ port });

    await Promise.all([watcherPromise, serverPromise]);
  } catch (err) {
    fastify.log.error(err);
    throw err;
  }
}

main();
