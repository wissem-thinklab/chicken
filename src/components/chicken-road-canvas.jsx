import { useEffect, useMemo, useRef } from 'react'
import { createChickenGame } from '../phaser/config/create-chicken-game'
import { prototypeMultipliers } from '../phaser/data/prototype-lanes'

export default function ChickenRoadCanvas({
  level = 'easy',
  currentLane = 0,
  result = null,
  crashedAtLane = null,
  isPlaying = false,
  command = null,
  onBusyChange = null,
  className = '',
}) {
  const containerRef = useRef(null)
  const gameRef = useRef(null)
  const sceneRef = useRef(null)

  const statePayload = useMemo(() => {
    return {
      level,
      currentLane,
      result,
      crashedAtLane,
      isPlaying,
      multipliers: prototypeMultipliers[level] || prototypeMultipliers.easy,
    }
  }, [level, currentLane, result, crashedAtLane, isPlaying])

  useEffect(() => {
    const containerId = `phaser-container-${Math.random().toString(36).slice(2)}`

    if (!containerRef.current) return
    containerRef.current.id = containerId

    const game = createChickenGame(containerId, statePayload)
    gameRef.current = game

    const waitForScene = () => {
      const scene = game.scene.keys.ChickenRoadScene
      if (scene) {
        sceneRef.current = scene
        sceneRef.current.events.emit('setState', statePayload)

        if (onBusyChange) {
          sceneRef.current.events.on('busy-change', onBusyChange)
        }
      } else {
        requestAnimationFrame(waitForScene)
      }
    }

    waitForScene()

    return () => {
      if (sceneRef.current && onBusyChange) {
        sceneRef.current.events.off('busy-change', onBusyChange)
      }

      sceneRef.current = null
      gameRef.current?.destroy(true)
      gameRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!sceneRef.current) return
    sceneRef.current.events.emit('setState', statePayload)
  }, [statePayload])

  useEffect(() => {
    if (!sceneRef.current || !command) return
    sceneRef.current.events.emit('command', command)
  }, [command])

  return (
    <div
      ref={containerRef}
      className={`w-full rounded-2xl overflow-hidden bg-sky-100 border border-gray-200 ${className}`}
    />
  )
}