import React, { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'
import { MAX_BET, MIN_BET } from '../../_mock/game'
import { useGameContext } from '../../game/context/game-context'
import LevelOptions from './level-options'

export default function BetPanel() {
  const { game, actions } = useGameContext()
  const { state } = game

  const [betAmount, setBetAmount] = useState(state.bet || 10)

  useEffect(() => {
    if (!state.isPlaying) {
      setBetAmount(state.bet)
    }
  }, [state.bet, state.isPlaying])

  const quickAmounts = [10, 25, 50]
  const isPlaying = state.isPlaying
  const isFinished = state.isFinished

  const handlePlay = () => {
  if (betAmount < MIN_BET || betAmount > MAX_BET) return

  console.log('[UI_PLAY_CLICK]', {
    betAmount,
    level: state.level,
  })

  actions.startGame({
    bet: betAmount,
    level: state.level,
  })
}

const handleGo = () => {
  console.log('[UI_GO_CLICK]', {
    currentLane: state.currentLane,
    currentMultiplier: state.currentMultiplier,
  })

  actions.goNextLane()
}

const handleCashOut = () => {
  console.log('[UI_CASH_OUT_CLICK]', {
    currentLane: state.currentLane,
    currentMultiplier: state.currentMultiplier,
  })

  actions.cashOut()
}

const handleReset = () => {
  console.log('[UI_RESET_CLICK]', {
    currentLane: state.currentLane,
    currentMultiplier: state.currentMultiplier,
    result: state.result,
  })

  actions.resetGame()
}

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Bet Amount
          </label>

          <div className="relative">
            <input
              type="number"
              value={betAmount}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10) || 0
                setBetAmount(Math.max(MIN_BET, Math.min(MAX_BET, value)))
              }}
              min={MIN_BET}
              max={MAX_BET}
              disabled={isPlaying}
              className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Enter amount"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
              <Icon icon="mdi:coin" className="w-5 h-5" />
            </span>
          </div>

          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Min: {MIN_BET}</span>
            <span>Max: {MAX_BET}</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {quickAmounts.map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => setBetAmount(amount)}
                disabled={isPlaying}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  betAmount === amount
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {amount}
              </button>
            ))}
          </div>
        </div>

        <LevelOptions />

        <div className="space-y-4 h-full">
          {!isPlaying ? (
            <button
              type="button"
              onClick={handlePlay}
              disabled={betAmount < MIN_BET || betAmount > MAX_BET}
              className="w-full px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-lg shadow-lg transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-center space-x-2">
                <Icon icon="mdi:play" className="w-5 h-5" />
                <span>PLAY GAME</span>
              </div>
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleGo}
                className="w-full px-4 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg transition-all hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <div className="flex items-center justify-center space-x-2">
                  <Icon icon="mdi:arrow-right-bold-circle" className="w-5 h-5" />
                  <span>GO</span>
                </div>
              </button>

              <button
                type="button"
                onClick={handleCashOut}
                className="w-full px-4 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-lg transition-all hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                <div className="flex items-center justify-center space-x-2">
                  <Icon icon="mdi:cash-fast" className="w-5 h-5" />
                  <span>CASH OUT</span>
                </div>
              </button>
            </div>
          )}

          {isFinished && !isPlaying && (
            <button
              type="button"
              onClick={handleReset}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              RESET ROUND
            </button>
          )}

          <div className="text-center text-xs text-gray-500 dark:text-gray-400">
            Balance: <span className="font-semibold">{state.balance}</span> coins
          </div>
        </div>
      </div>
    </div>
  )
}