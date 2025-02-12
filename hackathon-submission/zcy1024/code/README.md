# BlackSquid: Jumping

## Introduction

A game inspired by 오징어게임(Squid Game).

Developed based on Sui, Next.js, ElizaOS, Atoma, NAVI, Bluefin...

## How to play

### Player

- Pay 1Sui to start a game round.
- In a round of the game, you can jump up to six times, and each jump will be chosen from the three grids in front of you.
- The grids in the same column are evenly distributed with three states: Down, Peace, Up
- - Down: This round of gaming will end immediately and all accumulated winnings will be lost.
- - Peace: Nothing happens, just continue the game.
- - Up: Get a certain reward (Sui) and continue the game.
- - **Note:** Atoma will make predictions based on your history to determine the status of the candidate grid.
- When you jump to the last column of grids, no matter what state the grid is in, the game will end.
- You can manually end the game round before any jump.
- If there is a cumulative prize at the end of the game, it will be deducted from the prize pool and distributed to the player's wallet address.

### Investor

- Invest your Sui into the prize pool.
- When a player receives a reward, you can draw a certain percentage of Sui based on the share of the investment.
- If the player is particularly strong and the amount in the reward pool continues to shrink, then you must also bear a corresponding proportion of losses.

### Other

- Using the hot potato design pattern, the smart contract implements a function similar to flash loans: borrowing Sui in the prize pool for profit operations.
- 1% interest will be charged when repaying the loan, and this interest will automatically be added to the prize pool.

In the future, this function may be expanded and upgraded with the help of the ElizaOS (if there is still time in this hackathon).

## Online

[vercel](https://blacksquid-jumping.vercel.app/)

## Local

```bash
# create .env file
# and configure the following settings
# ATOMA_KEY=...
# ATOMA_MODEL=meta-llama/Llama-3.3-70B-Instruct
# Finally run the following command:
bun install
bun run build
bun run start
```

Of course, you can also redeploy the smart contract: `/src/contracts/jumping`<br/>
Don’t forget to configure the newly deployed contract information: `/src/configs/networkConfig.ts`