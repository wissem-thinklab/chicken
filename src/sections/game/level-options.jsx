import React from 'react'
import { levelsArray } from '../../_mock/game'
import { useGameContext } from '../../game/context/game-context'

export default function LevelOptions() {
  const { game, actions } = useGameContext()
  const { state } = game

  const isGameActive = state.isPlaying

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Difficulty Level
      </label>

      <div className="grid grid-cols-3 gap-2">
        {levelsArray.map((level) => (
          <button
            key={level}
            type="button"
            onClick={() => actions.setLevel(level)}
            disabled={isGameActive}
            className={`px-4 py-3 rounded-lg font-medium capitalize transition-all ${
              state.level === level
                ? 'bg-red-600 text-white shadow-lg scale-105'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <div className="flex items-center justify-center">
              <span>{level}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}