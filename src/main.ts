import { getMarketBySlug } from "./api";
import { trade } from "./trade";

const main = async () => {
  const username = process.env.MANIFOLD_USERNAME;
  const key = process.env.MANIFOLD_API_KEY;
  const slug = process.env.MANIFOLD_MARKET_SLUG;

  if (!username) throw new Error("Please set MANIFOLD_USERNAME variable in .env file.");
  if (!key) throw new Error("Please set MANIFOLD_API_KEY variable in .env file.");
  if (!slug) throw new Error("Please set MANIFOLD_SLUG variable in .env file.");

  console.log("Starting simple trading bot...");

  const market = await getMarketBySlug(slug);
  console.log(`Loaded market: ${market.question}\n`);

  const contractId = market.id;

  await trade(username, key, contractId, 15 * 1000);
};

if (require.main === module) {
  main();
}
