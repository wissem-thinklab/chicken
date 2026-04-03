import Phaser from 'phaser'
import ChickenRoadScene from '../scenes/ChickenRoadScene'

export function createChickenGame(parentId, initialState) {
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent: parentId,
    width: 1280,
    height: 720,
    backgroundColor: '#bfe3ff',
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [ChickenRoadScene],
    callbacks: {
      postBoot: (game) => {
        const scene = game.scene.keys.ChickenRoadScene
        if (scene) {
          scene.externalState = {
            ...scene.externalState,
            ...initialState,
          }
        }
      },
    },
  })
}