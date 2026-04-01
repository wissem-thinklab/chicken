import BetPanel from '../bet-panel'
import GameSectionView from '../../../game/views/game-section-view'

export default function GameView() {
  return (
    <div className="pb-44">
      <div className="md:max-w-7xl max-w-full mx-auto relative">
        <div className="p-6">
          <GameSectionView />
        </div>
      </div>

      <div className="fixed bottom-4 left-0 right-0 px-4">
        <div className="md:max-w-7xl max-w-full mx-auto">
          <BetPanel />
        </div>
      </div>
    </div>
  )
}