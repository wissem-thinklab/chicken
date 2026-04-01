import React from 'react'
import { Icon } from '@iconify/react'
import { levels } from '../../_mock/game'
import { useGameContext } from '../context/game-context'

export default function GameSectionView() {
  const { game } = useGameContext()
  const { state } = game

  const currentLevelData = levels[state.level] || levels.easy
  const multipliers = currentLevelData.multipliers

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Chicken Game Arena
        </h2>

        <div className="flex justify-center items-center gap-3 text-sm flex-wrap">
          <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full capitalize">
            {state.level} Level
          </span>

          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full">
            Bet: {state.bet} coins
          </span>

          {state.isPlaying && (
            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full flex items-center">
              <Icon icon="mdi:play" className="w-4 h-4 mr-1" />
              Playing
            </span>
          )}
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {multipliers.map((multiplier, index) => {
            const laneNumber = index + 1
            const isCurrentLane = state.currentLane === laneNumber
            const isPassedLane = laneNumber < state.currentLane
            const isLoseLane =
              state.isFinished && state.result === 'lose' && state.currentLane === laneNumber

            return (
              <div
                key={laneNumber}
                className={`relative rounded-lg p-4 text-center transition-all duration-300 ${
                  isCurrentLane && state.isPlaying
                    ? 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg scale-105 ring-2 ring-red-400 ring-offset-2'
                    : isLoseLane
                    ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-800'
                    : isPassedLane
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 hover:border-red-400 hover:shadow-md'
                }`}
              >
                <div className="absolute top-2 left-2 text-xs font-semibold opacity-60">
                  #{laneNumber}
                </div>

                <div className="text-2xl font-bold mb-1">{multiplier}x</div>

                {isCurrentLane && state.isPlaying && (
                  <div className="flex justify-center items-center space-x-1">
                    <Icon icon="mdi:chicken" className="w-6 h-6 animate-bounce" />
                    <span className="text-xs font-medium">YOU</span>
                  </div>
                )}

                {isPassedLane && (
                  <div className="flex justify-center">
                    <Icon icon="mdi:check-circle" className="w-5 h-5 text-green-500" />
                  </div>
                )}

                {isLoseLane && (
                  <div className="flex justify-center">
                    <Icon icon="mdi:close-circle" className="w-5 h-5 text-red-500" />
                  </div>
                )}

                <div className="text-xs opacity-75 mt-2">
                  Win: {(state.bet * parseFloat(multiplier)).toFixed(2)}
                </div>
              </div>
            )
          })}
        </div>

        {state.isPlaying && (
          <div className="mt-6 text-center">
            <div className="inline-flex items-center space-x-3 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg">
              <Icon icon="mdi:timer" className="w-5 h-5 animate-pulse" />
              <span className="font-medium">
                Current Multiplier: {state.currentMultiplier}x
              </span>
            </div>
          </div>
        )}

        {state.isFinished && state.result && (
          <div className="mt-6 text-center">
            <div
              className={`inline-flex items-center space-x-3 px-4 py-2 rounded-lg ${
                state.result === 'win'
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                  : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
              }`}
            >
              <Icon
                icon={state.result === 'win' ? 'mdi:trophy' : 'mdi:skull'}
                className="w-5 h-5"
              />
              <span className="font-medium capitalize">
                {state.result === 'win'
                  ? `You won ${(state.bet * parseFloat(state.currentMultiplier)).toFixed(2)} coins`
                  : 'You lost the round'}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
        <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
          How to Play:
        </h3>
        <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
          <li>• Place your bet and select difficulty level</li>
          <li>• Start the round, then press GO to move lane by lane</li>
          <li>• Press CASH OUT anytime before the crash</li>
          <li>• Higher difficulty means higher potential reward</li>
        </ul>
      </div>
    </div>
  )
}