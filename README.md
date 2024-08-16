# simple-trader
Simple prototype trading bot using Manifold API.

The strategy implemented here polls a market for updates and then bets the price will revert. 

# 1. Run this bot!

1. Clone the repository
2. Set your accounts credentials in the `accounts.json` file. 
4. Install npm packages with `yarn`
5. Run `yarn start-batch`

(Be careful! This bot will be placing trades with your mana.)

Feel free to fork and extend this bot with more advanced strategies!

# 2. Trade simulator bot and executor service
1. Run `yarn executor` to start the executor service
2. Run `yarn start-simulator` in another shell to start simulating trades
3. Observe the executor service logs to see the trades being executed based on the current asset price and TP/SL levels