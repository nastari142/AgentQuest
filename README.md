# AgentQuest

Quest hub for **Agent ID** holders on BNB Chain. Check in daily, complete
on-chain-verified quests, earn XP, climb levels and the leaderboard.

- **Live app:** https://agentquesthub.web.app
- **Chain:** BNB Smart Chain mainnet (chainId 56)
- **Contract:** [`0x7A17B5b00B7a40BCf4Dc6cB2d9A7b24CC4d82a45`](https://bscscan.com/address/0x7A17B5b00B7a40BCf4Dc6cB2d9A7b24CC4d82a45)
- **Source verified:** [Sourcify exact match](https://sourcify.dev/server/v2/contract/56/0x7A17B5b00B7a40BCf4Dc6cB2d9A7b24CC4d82a45)
- **Built for:** Binance Wallet × BNB Chain Agent ID Hackathon (submission deadline 9 Dec 2026)

No token, no fees — every interaction costs gas only. The contract holds no funds.

## How it works

Every action requires holding a SPACE ID Agent ID (ERC-721, non-transferable):
[`0x60B9262456dE011F7d15a54CdD8c48bAaa8B022F`](https://bscscan.com/address/0x60B9262456dE011F7d15a54CdD8c48bAaa8B022F).

### Daily check-in — +10 XP

Call `checkIn()` once per UTC day. Consecutive days grow your streak; a missed
day resets it to 1. Check-in XP is fixed at 10.

### Quests — +50 XP each

A quest is completed by proving you hold a minimum balance of a token.
One completion per user per quest; XP is awarded once. Current quests:

| Quest | Requirement | Reward |
|-------|-------------|--------|
| Hold AGC | Hold at least **1,000 AGC** ([Agentic Coin](https://bscscan.com/address/0x63dea5acdbe1f27c968907d08610a5f0a0284ba6)) | +50 XP |
| Hold USDT | Hold at least **0.01 USDT** ([BEP-20 USDT](https://bscscan.com/address/0x55d398326f99059fF775485246999027B3197955)) | +50 XP |

Quests are verified fully on-chain: `completeQuest(questId)` checks
`balanceOf(msg.sender) >= minBalance` on the quest target contract.

### Levels

| Level | XP required |
|-------|-------------|
| 1 | 0+ |
| 2 | 100+ |
| 3 | 250+ |
| 4 | 500+ |
| 5 | 1,000+ |
| 6 | 2,000+ |

### Leaderboard

Top 10 addresses by XP, computed from on-chain `CheckIn` and `QuestCompleted`
events starting at the deploy block.

## Owner permissions (disclosed)

The contract owner can only:

- add quests (`addQuest`)
- activate / deactivate quests (`setQuestActive`)
- transfer ownership (`transferOwnership`)

The owner **cannot** touch user XP or streaks, cannot move or hold any funds,
and cannot pause the contract.

## Repository layout

```text
contracts/
  AgentQuest.sol        # The quest hub contract (Solidity ^0.8.20)
  AgentQuest.abi.json   # Compiled ABI
frontend/
  index.html            # Single-page dApp (EN / 中文 / ID)
  app.js                # Ethers v6 frontend logic
  styles.css            # Styles
```

The frontend is a static single page with no build step; the only external
dependency is ethers v6 via CDN. It requires `window.ethereum` (MetaMask or
similar) and enforces BSC mainnet (chainId 56), offering automatic
network switch/add.

## Run locally

Serve the `frontend/` directory with any static file server, e.g.:

```bash
cd frontend
python3 -m http.server 8000
```

Then open http://localhost:8000.
