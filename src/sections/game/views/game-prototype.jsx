import { useMemo, useState } from 'react'
import ChickenRoadCanvas from '../../../components/chicken-road-canvas'
import { PROTOTYPE_LANES } from '../../../phaser/data/prototype-lanes'

export default function ChickenPhaserPrototypePage() {
  const [level, setLevel] = useState('easy')
  const [currentLane, setCurrentLane] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [result, setResult] = useState(null)
  const [crashedAtLane, setCrashedAtLane] = useState(null)
  const [lastCommand, setLastCommand] = useState(null)
  const [sceneBusy, setSceneBusy] = useState(false)

  const emitCommand = (payload) => {
    setLastCommand({
      ...payload,
      id: Date.now() + Math.random(),
    })
  }

  const handlePlay = () => {
    if (sceneBusy) return

    setCurrentLane(1)
    setIsPlaying(true)
    setResult(null)
    setCrashedAtLane(null)
    emitCommand({ type: 'PLAY' })
  }

  const handlePlayCrash = () => {
    if (sceneBusy) return

    setResult('lose')
    setIsPlaying(false)
    setCrashedAtLane(1)
    emitCommand({ type: 'PLAY_CRASH' })
  }

  const handleSafeGo = () => {
    if (sceneBusy) return

    const nextLane = Math.min(currentLane + 1, PROTOTYPE_LANES)
    setCurrentLane(nextLane)
    emitCommand({ type: 'GO_SAFE', toLane: nextLane })
  }

  const handleCrashGo = () => {
    if (sceneBusy) return

    const attemptedLane = Math.min(currentLane + 1, PROTOTYPE_LANES)
    setResult('lose')
    setIsPlaying(false)
    setCrashedAtLane(attemptedLane)
    emitCommand({ type: 'GO_CRASH', attemptedLane })
  }

  const handleCashout = () => {
    if (sceneBusy) return

    setResult('win')
    setIsPlaying(false)
    emitCommand({ type: 'CASHOUT' })
  }

  const handleReset = () => {
    if (sceneBusy) return

    setCurrentLane(0)
    setIsPlaying(false)
    setResult(null)
    setCrashedAtLane(null)
    emitCommand({ type: 'RESET' })
  }

  const canPlay = currentLane === 0 && !isPlaying
  const canGo = isPlaying && currentLane >= 1 && currentLane < PROTOTYPE_LANES

  const stateLabel = useMemo(() => {
    if (sceneBusy) return 'Animating...'
    if (result === 'lose') return 'Lose'
    if (result === 'win') return 'Win'
    if (isPlaying) return 'Playing'
    return 'Idle'
  }, [sceneBusy, result, isPlaying])

  return (
    <div className="w-full ">
      <div className="mx-auto max-w-full space-y-4">
       

        <div className="">
          <ChickenRoadCanvas
            level={level}
            currentLane={currentLane}
            isPlaying={isPlaying}
            result={result}
            crashedAtLane={crashedAtLane}
            command={lastCommand}
            onBusyChange={setSceneBusy}
            className="h-[420px] sm:h-[500px] md:h-[580px] lg:h-[680px]"
          />

          
        </div>
        <div className="z-20 px-3 md:px-4">
            <div className="mx-auto max-w-5xl rounded-2xl border border-white/20 bg-black/55 backdrop-blur-md p-3 md:p-4 shadow-2xl">
              <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
                <button
                  disabled={!canPlay || sceneBusy}
                  onClick={handlePlay}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50"
                >
                  PLAY
                </button>

                <button
                  disabled={!canPlay || sceneBusy}
                  onClick={handlePlayCrash}
                  className="px-4 py-2 rounded-lg bg-red-700 text-white disabled:opacity-50"
                >
                  PLAY CRASH
                </button>

                <button
                  disabled={!canGo || sceneBusy}
                  onClick={handleSafeGo}
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white disabled:opacity-50"
                >
                  GO SAFE
                </button>

                <button
                  disabled={!canGo || sceneBusy}
                  onClick={handleCrashGo}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white disabled:opacity-50"
                >
                  GO CRASH
                </button>

                <button
                  disabled={!isPlaying || sceneBusy}
                  onClick={handleCashout}
                  className="px-4 py-2 rounded-lg bg-yellow-500 text-black disabled:opacity-50"
                >
                  CASH OUT
                </button>

                <button
                  disabled={sceneBusy}
                  onClick={handleReset}
                  className="px-4 py-2 rounded-lg bg-gray-700 text-white disabled:opacity-50"
                >
                  RESET
                </button>
                <div className="flex">
                  <p>Level:</p>
                   <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setLevel('easy')}
            disabled={sceneBusy}
            className="px-3 py-2 rounded-lg bg-red-600 text-white disabled:opacity-50"
          >
            Easy
          </button>
          <button
            onClick={() => setLevel('medium')}
            disabled={sceneBusy}
            className="px-3 py-2 rounded-lg bg-red-600 text-white disabled:opacity-50"
          >
            Medium
          </button>
          <button
            onClick={() => setLevel('hard')}
            disabled={sceneBusy}
            className="px-3 py-2 rounded-lg bg-red-600 text-white disabled:opacity-50"
          >
            Hard
          </button>
        </div>
                </div>
              </div>

              <div className="mt-3 text-center text-xs md:text-sm text-white/90">
                Level: <b>{level}</b> | Lane: <b>{currentLane}</b> / <b>{PROTOTYPE_LANES}</b> | Status:{' '}
                <b>{stateLabel}</b>
              </div>
              
            </div>
          </div>
      </div>
    </div>
  )
}