import { getBets, placeBet } from "./api";
import { roundProb, sleep } from "./utils";

const BET_AMOUNT = 25;
const PROB_THESHOLD = 0.02;
const REVERSION_FACTOR = 0.5;

export async function trade(
  username: string,
  apiKey: string,
  contractId: string,
  tradeIntervalMs: number,
  dryRun = false
) {
  let lastBetId: string | undefined = undefined;
  let lastProbability: number | undefined = undefined;

  while (true) {
    // poll every 15 seconds
    if (lastBetId !== undefined) await sleep(tradeIntervalMs);

    const loadedBets = await getBets({
      contractId: contractId,
      limit: 5,
    });

    console.log("bets refreshed");

    // filter out limit orders, redemptions, and antes
    const newBets = loadedBets.filter((bet) => bet.amount > 0 && !bet.isRedemption && !bet.isAnte);

    if (newBets.length === 0) continue;

    const newestBet = newBets[0];
    if (
      newestBet.id === lastBetId ||
      newestBet.userUsername === username // exclude own bets
    )
      continue;

    console.log(
      "Loaded bet:",
      newestBet.userUsername,
      newestBet.outcome,
      `M${newestBet.amount}`,
      `${roundProb(lastProbability ?? Number.NaN) * 100}% => ${
        roundProb(newestBet.probAfter) * 100
      }%`,
      new Date().toLocaleTimeString()
    );

    if (lastProbability) {
      const diff = newestBet.probAfter - lastProbability;

      if (Math.abs(diff) >= PROB_THESHOLD) {
        const outcome = diff > 0 ? "NO" : "YES";
        const limitProb = roundProb(REVERSION_FACTOR * diff + lastProbability);

        const resultBet = await placeBet(
          {
            contractId,
            amount: BET_AMOUNT,
            outcome,
            limitProb,
            dryRun,
          },
          apiKey
        );

        console.log(
          "Bet placed:",
          resultBet.outcome,
          `M${Math.floor(resultBet.amount)}`,
          `${roundProb(newestBet.probAfter) * 100}% => ${roundProb(limitProb) * 100}%\n`
        );
      }
    }

    lastBetId = newestBet.id;
    lastProbability = newestBet.probAfter;
  }
}
