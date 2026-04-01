import { levels } from '../../_mock/game'

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

let mockWallet = {
  balance: 50,
  winnings: 0,
}

export async function startChickenRound({ level, bet }) {
  await wait(300)

  if (mockWallet.balance < bet) {
    throw new Error('Insufficient balance')
  }

  mockWallet = {
    ...mockWallet,
    balance: Number((mockWallet.balance - bet).toFixed(2)),
  }

  return {
    roundId: `round_${Date.now()}`,
    status: 'playing',
    result: null,
    level,
    bet,
    currentLane: 1,
    currentMultiplier: levels[level].multipliers[0],
    crashedAtLane: null,
    wallet: { ...mockWallet },
  }
}

export async function goChickenRound({
  roundId,
  level,
  currentLane,
  currentMultiplier,
}) {
  await wait(250)

  const levelData = levels[level]
  const toLane = currentLane + 1
  const crashed = Math.random() < levelData.crashChance

  if (toLane > levelData.multipliers.length) {
    return {
      roundId,
      status: 'playing',
      result: null,
      currentLane,
      currentMultiplier,
      crashedAtLane: null,
      wallet: { ...mockWallet },
    }
  }

  if (crashed) {
    return {
      roundId,
      status: 'finished',
      result: 'lose',
      currentLane,
      currentMultiplier,
      crashedAtLane: toLane,
      wallet: { ...mockWallet },
    }
  }

  return {
    roundId,
    status: 'playing',
    result: null,
    currentLane: toLane,
    currentMultiplier: levelData.multipliers[toLane - 1],
    crashedAtLane: null,
    wallet: { ...mockWallet },
  }
}

export async function cashoutChickenRound({
  roundId,
  bet,
  currentLane,
  currentMultiplier,
}) {
  await wait(250)

  const payout = Number((bet * Number(currentMultiplier)).toFixed(2))
  const profit = Number((payout - bet).toFixed(2))

  mockWallet = {
    balance: Number((mockWallet.balance + bet).toFixed(2)),
    winnings: Number((mockWallet.winnings + profit).toFixed(2)),
  }

  return {
    roundId,
    status: 'finished',
    result: 'win',
    currentLane,
    currentMultiplier,
    crashedAtLane: null,
    payout,
    profit,
    wallet: { ...mockWallet },
  }
}