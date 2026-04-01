import { createContext, useContext } from 'react'

export const GameContext = createContext(undefined)

export const GameConsumer = GameContext.Consumer

export function useGameContext() {
  const context = useContext(GameContext)

  if (!context) {
    throw new Error('useGameContext must be used within GameProvider')
  }

  return context
}