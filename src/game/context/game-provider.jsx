import { useCallback, useEffect, useRef } from 'react'
import { GameContext } from './game-context'
import { useSetState } from '../../hooks/use-set-state'
import {
  startChickenRound,
  goChickenRound,
  cashoutChickenRound,
} from './game-services'
import { useAuthContext } from '../../auth/hooks'

const INITIAL_STATE = {
  roundId: null,
  level: 'easy',
  bet: 1,
  currentLane: 0,
  currentMultiplier: '1.00',
  isPlaying: false,
  isFinished: false,
  result: null,
  crashedAtLane: null,
  loadingAction: null,
  error: null,
}

export function GameProvider({ children }) {
  const { updateWallet } = useAuthContext()
  const game = useSetState(INITIAL_STATE)
  const gameRef = useRef(game.state)

  useEffect(() => {
    gameRef.current = game.state
  }, [game.state])

  const syncFromResponse = useCallback(
  (response) => {
    game.setState({
      roundId: response.roundId ?? gameRef.current.roundId,
      level: response.level ?? gameRef.current.level,
      bet: response.bet ?? gameRef.current.bet,
      currentLane: response.currentLane ?? gameRef.current.currentLane,
      currentMultiplier:
        response.currentMultiplier ?? gameRef.current.currentMultiplier,
      crashedAtLane: response.crashedAtLane ?? null,
      result: response.result ?? null,
      isPlaying: response.status === 'playing',
      isFinished: response.status === 'finished',
      loadingAction: null,
      error: null,
    })

    if (response.wallet) {
      updateWallet(response.wallet)
    }
  },
  [game, updateWallet]
)

  const startGame = useCallback(async ({ bet, level }) => {
    try {
      game.setState({
        loadingAction: 'start',
        error: null,
      })

      console.log('[REQUEST][START_GAME]', { bet, level })

      const response = await startChickenRound({ bet, level })

      console.log('[RESPONSE][START_GAME]', response)

      syncFromResponse(response)
    } catch (error) {
      console.error('[ERROR][START_GAME]', error)

      game.setState({
        loadingAction: null,
        error: error?.message || 'Failed to start game',
      })
    }
  }, [game, syncFromResponse])

  const goNextLane = useCallback(async () => {
    const currentState = gameRef.current

    if (!currentState.isPlaying || !currentState.roundId) return

    try {
      game.setState({
        loadingAction: 'go',
        error: null,
      })

      const payload = {
        roundId: currentState.roundId,
        level: currentState.level,
        bet: currentState.bet,
        currentLane: currentState.currentLane,
        currentMultiplier: currentState.currentMultiplier,
      }

      console.log('[REQUEST][GO_NEXT_LANE]', payload)

      const response = await goChickenRound(payload)

      console.log('[RESPONSE][GO_NEXT_LANE]', response)

      syncFromResponse(response)
    } catch (error) {
      console.error('[ERROR][GO_NEXT_LANE]', error)

      game.setState({
        loadingAction: null,
        error: error?.message || 'Failed to move to next lane',
      })
    }
  }, [game, syncFromResponse])

  const cashOut = useCallback(async () => {
    const currentState = gameRef.current

    if (!currentState.isPlaying || !currentState.roundId) return

    try {
      game.setState({
        loadingAction: 'cashout',
        error: null,
      })

      const payload = {
        roundId: currentState.roundId,
        bet: currentState.bet,
        currentLane: currentState.currentLane,
        currentMultiplier: currentState.currentMultiplier,
      }

      console.log('[REQUEST][CASH_OUT]', payload)

      const response = await cashoutChickenRound(payload)

      console.log('[RESPONSE][CASH_OUT]', response)

      syncFromResponse(response)
    } catch (error) {
      console.error('[ERROR][CASH_OUT]', error)

      game.setState({
        loadingAction: null,
        error: error?.message || 'Failed to cash out',
      })
    }
  }, [game, syncFromResponse])

  const resetGame = useCallback(() => {
    const level = gameRef.current.level || 'easy'

    game.setState({
      roundId: null,
      currentLane: 0,
      currentMultiplier: '1.00',
      isPlaying: false,
      isFinished: false,
      result: null,
      crashedAtLane: null,
      loadingAction: null,
      error: null,
      level,
    })

    console.log('[LOCAL][RESET_GAME]')
  }, [game])

  const setLevel = useCallback((level) => {
    if (gameRef.current.isPlaying) return

    console.log('[LOCAL][SET_LEVEL]', { level })

    game.setState({
      level,
      currentLane: 0,
      currentMultiplier: '1.00',
      crashedAtLane: null,
      error: null,
    })
  }, [game])

  const checkGameSession = useCallback(async () => {
    console.log('[CHECK_GAME_SESSION]', gameRef.current)
    return gameRef.current
  }, [])

  return (
    <GameContext.Provider
      value={{
        game,
        checkGameSession,
        actions: {
          startGame,
          goNextLane,
          cashOut,
          resetGame,
          setLevel,
        },
      }}
    >
      {children}
    </GameContext.Provider>
  )
}