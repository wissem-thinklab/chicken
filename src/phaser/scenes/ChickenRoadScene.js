import Phaser from 'phaser'
import { PROTOTYPE_LANES, prototypeMultipliers } from '../data/prototype-lanes'

const WORLD = {
    width: PROTOTYPE_LANES * 200 + 550,
    height: 900,
    leftSidewalkWidth: 260,
    rightSidewalkWidth: 260,
    roadWidth: PROTOTYPE_LANES * 200,
    roadHeight: 640,
    laneGap: 1,
}

const COLORS = {
    bg: 0xbfe3ff,
    sidewalk: 0xd9d2c3,
    road: 0x353535,
    laneLine: 0xf7f3a1,
    textBg: 0x111111,
    blocker: 0xffb703,
    player: 0xffffff,
    playerOutline: 0x222222,
    carA: 0xe63946,
    carB: 0x457b9d,
    carC: 0x2a9d8f,
    crash: 0xff4d4f,
}

export default class ChickenRoadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ChickenRoadScene' })

        this.externalState = {
            level: 'easy',
            currentLane: 0, // 0 = left sidewalk
            result: null,
            crashedAtLane: null,
            isPlaying: false,
            multipliers: prototypeMultipliers.easy,
        }

        this.commandQueue = []
        this.isAnimating = false
        this.blockers = new Map()
        this.cars = []
        this.manuallyBlockedLanes = new Set()

        this.dragState = {
            isDragging: false,
            lastX: 0,
        }
    }

    init(data) {
        if (data?.initialState) {
            this.externalState = {
                ...this.externalState,
                ...data.initialState,
            }
        }
    }

    preload() {
        // Prototype uses shapes only
    }

    create() {
        this.buildWorld()
        this.buildLanes()
        this.buildPlayer()
        this.buildTraffic()
        this.setupCamera()
        this.setupInput()

        this.events.on('setState', this.handleSetState, this)
        this.events.on('command', this.handleCommand, this)

        this.syncVisualState(true)
    }

    update(_, delta) {
        this.updateTraffic(delta)
        this.consumeCommandQueue()
    }

    buildWorld() {
        this.cameras.main.setBackgroundColor(COLORS.bg)

        this.add.rectangle(
            WORLD.width / 2,
            WORLD.height / 2,
            WORLD.width,
            WORLD.height,
            COLORS.bg
        )

        const roadX = WORLD.leftSidewalkWidth + WORLD.roadWidth / 2

        this.add.rectangle(
            WORLD.leftSidewalkWidth / 2,
            WORLD.height / 2,
            WORLD.leftSidewalkWidth,
            WORLD.height,
            COLORS.sidewalk
        )

        this.add.rectangle(
            WORLD.leftSidewalkWidth + WORLD.roadWidth + WORLD.rightSidewalkWidth / 2,
            WORLD.height / 2,
            WORLD.rightSidewalkWidth,
            WORLD.height,
            COLORS.sidewalk
        )

        this.add.rectangle(
            roadX,
            WORLD.height / 2,
            WORLD.roadWidth,
            WORLD.roadHeight,
            COLORS.road
        )
    }

    buildLanes() {
        this.laneCenters = []
        this.laneData = []

        const laneWidth =
            (WORLD.roadWidth - WORLD.laneGap * (PROTOTYPE_LANES - 1)) / PROTOTYPE_LANES

        const startX = WORLD.leftSidewalkWidth + laneWidth / 2
        const laneY = WORLD.height / 2

        for (let i = 0; i < PROTOTYPE_LANES; i += 1) {
            const x = startX + i * (laneWidth + WORLD.laneGap)

            this.laneCenters.push({
                index: i + 1,
                x,
            })

            const laneRect = this.add.rectangle(
                x,
                laneY,
                laneWidth,
                WORLD.roadHeight,
                COLORS.road
            )
            laneRect.setStrokeStyle(2, 0x4a4a4a)

            const centerDash = this.add.rectangle(
                x,
                laneY,
                laneWidth - 30,
                6,
                COLORS.laneLine
            )
            centerDash.setAlpha(0.35)

            const labelBg = this.add.rectangle(
                x,
                laneY - WORLD.roadHeight / 2 - 55,
                120,
                40,
                COLORS.textBg,
                0.88
            )

            const labelText = this.add
                .text(x, laneY - WORLD.roadHeight / 2 - 55, '1.00x', {
                    fontFamily: 'Arial',
                    fontSize: '22px',
                    color: '#ffffff',
                    fontStyle: 'bold',
                })
                .setOrigin(0.5)

            this.laneData.push({
                laneRect,
                centerDash,
                labelBg,
                labelText,
            })
        }
    }

    buildPlayer() {
        const startPos = this.getPositionForLane(0)

        this.playerShadow = this.add.ellipse(
            startPos.x,
            startPos.y + 34,
            60,
            20,
            0x000000,
            0.18
        )

        this.player = this.add.container(startPos.x, startPos.y)

        const outline = this.add.ellipse(0, 0, 60, 74)
        outline.setStrokeStyle(3, COLORS.playerOutline)

        const body = this.add.ellipse(0, 0, 58, 72, COLORS.player)
        const eye1 = this.add.circle(-10, -8, 4, 0x111111)
        const eye2 = this.add.circle(10, -8, 4, 0x111111)
        const beak = this.add.triangle(0, 6, -8, 0, 8, 0, 0, 12, 0xffb703)

        this.player.add([outline, body, eye1, eye2, beak])
    }

    buildTraffic() {
        this.cars = []

        for (let i = 0; i < PROTOTYPE_LANES; i += 1) {
            const lane = i + 1
            const car = this.createCar(lane)
            this.cars.push(car)
        }
    }

    createCar(lane) {
        const laneInfo = this.laneCenters[lane - 1]

        const width = Phaser.Math.Between(120, 160)
        const height = 64

        const colorPool = [COLORS.carA, COLORS.carB, COLORS.carC]
        const color = colorPool[(lane - 1) % colorPool.length]

        const speed = Phaser.Math.Between(240, 320)
        const startY = Phaser.Math.Between(-900, -120)

        const laneOffsetX = Phaser.Math.Between(-10, 10)
        const rect = this.add.rectangle(laneInfo.x + laneOffsetX, startY, width, height, color)
        rect.setStrokeStyle(2, 0x222222)

        return {
            lane,
            speed,
            width,
            height,
            rect,
            reservedUntil: 0,
            mode: 'normal', // normal | stop-before-barrier | rush-out | crash-hit
            stopY: null,
            targetCrashY: null,
            isDedicatedCrashCar: false,
        }
    }

    setupCamera() {
        const cam = this.cameras.main
        cam.setBounds(0, 0, WORLD.width, WORLD.height)
        cam.setZoom(1)
        cam.centerOn(WORLD.leftSidewalkWidth + 320, WORLD.height / 2)

        this.scale.on('resize', (gameSize) => {
            const { width, height } = gameSize
            cam.setViewport(0, 0, width, height)
        })
    }

    setupInput() {
        this.input.on('pointerdown', (pointer) => {
            this.dragState.isDragging = true
            this.dragState.lastX = pointer.x
        })

        this.input.on('pointerup', () => {
            this.dragState.isDragging = false
        })

        this.input.on('pointermove', (pointer) => {
            if (!this.dragState.isDragging) return

            const deltaX = pointer.x - this.dragState.lastX
            this.dragState.lastX = pointer.x

            this.cameras.main.scrollX -= deltaX
            this.cameras.main.scrollX = Phaser.Math.Clamp(
                this.cameras.main.scrollX,
                0,
                WORLD.width - this.scale.width
            )
        })
    }

    handleSetState(nextState) {
        this.externalState = {
            ...this.externalState,
            ...nextState,
        }

        this.syncVisualState(false)
    }

    handleCommand(command) {
        this.commandQueue.push(command)
    }

    consumeCommandQueue() {
        if (this.isAnimating) return
        if (!this.commandQueue.length) return

        const command = this.commandQueue.shift()

        switch (command.type) {
            case 'PLAY':
                this.animatePlayToLane1()
                break
            case 'PLAY_CRASH':
                this.animatePlayCrash()
                break
            case 'GO_SAFE':
                this.animateSafeMove(command.toLane)
                break
            case 'GO_CRASH':
                this.animateCrashMove(command.attemptedLane)
                break
            case 'CASHOUT':
                this.animateCashout()
                break
            case 'RESET':
                this.animateReset()
                break
            case 'AUTO_FINISH':
                this.animateFinishJump()
                break
            default:
                break
        }
    }

    syncVisualState(initial = false) {
        const multipliers =
            prototypeMultipliers[this.externalState.level] || prototypeMultipliers.easy

        this.externalState.multipliers = multipliers

        this.laneData.forEach((laneObj, index) => {
            laneObj.labelText.setText(`${multipliers[index]}x`)
        })

        if (initial) {
            const pos = this.getPositionForLane(this.externalState.currentLane || 0)
            this.player.setPosition(pos.x, pos.y)
            this.playerShadow.setPosition(pos.x, pos.y + 34)

            const currentLane = this.externalState.currentLane || 0
            for (let lane = 1; lane <= currentLane; lane += 1) {
                this.placeBlocker(lane)
            }
        }
    }

    getPositionForLane(lane) {
        const centerY = WORLD.height / 2
        const startX = WORLD.leftSidewalkWidth / 2
        const finishX =
            WORLD.leftSidewalkWidth + WORLD.roadWidth + WORLD.rightSidewalkWidth / 2

        if (lane === 0) {
            return { x: startX, y: centerY }
        }

        if (lane === PROTOTYPE_LANES + 1) {
            return { x: finishX, y: centerY }
        }

        return {
            x: this.laneCenters[lane - 1].x,
            y: centerY,
        }
    }

    getBarrierYForLane(lane) {
        const pos = this.getPositionForLane(lane)
        return pos.y - 92
    }

    getIsLaneBlocked(lane) {
        const blockedUntilLane = this.externalState.currentLane || 0
        return lane <= blockedUntilLane || this.manuallyBlockedLanes.has(lane)
    }

    clearLaneTrafficForReset() {
        this.cars.forEach((car) => {
            car.mode = 'normal'
            car.stopY = null
            car.targetCrashY = null
            car.reservedUntil = 0

            if (car.isDedicatedCrashCar) {
                car.rect.destroy()
                return
            }

            car.rect.setVisible(true)
            car.rect.y = -Phaser.Math.Between(220, 700)
        })

        this.cars = this.cars.filter((car) => !car.isDedicatedCrashCar)
    }

    blockLaneForSafe(lane) {
        const barrierY = this.getBarrierYForLane(lane)

        this.cars.forEach((car) => {
            if (car.lane !== lane || car.isDedicatedCrashCar) return

            if (car.rect.y < barrierY - 10) {
                car.mode = 'stop-before-barrier'
                car.stopY = barrierY - 38
            } else {
                car.mode = 'rush-out'
            }
        })
    }

    blockLaneForCrash(lane) {
        this.manuallyBlockedLanes.add(lane)

        const chickenPos = this.getPositionForLane(lane)
        const hitZoneY = chickenPos.y
        const candidateCars = this.cars.filter(
            (car) => car.lane === lane && !car.isDedicatedCrashCar
        )

        let crashCar = null

        for (const car of candidateCars) {
            if (car.rect.y < hitZoneY - 20) {
                crashCar = car
                break
            }
        }

        candidateCars.forEach((car) => {
            if (car === crashCar) return
            car.mode = 'rush-out'
        })

        if (crashCar) {
            crashCar.mode = 'crash-hit'
            crashCar.targetCrashY = hitZoneY
            return crashCar
        }

        return null
    }

    spawnDedicatedCrashCar(lane) {
        const laneInfo = this.laneCenters[lane - 1]
        const chickenPos = this.getPositionForLane(lane)

        const rect = this.add.rectangle(
            laneInfo.x,
            chickenPos.y - 320,
            145,
            64,
            COLORS.crash
        )
        rect.setStrokeStyle(2, 0x111111)

        const crashCar = {
            lane,
            speed: 900,
            width: 145,
            height: 64,
            rect,
            reservedUntil: 0,
            mode: 'crash-hit',
            stopY: null,
            targetCrashY: chickenPos.y,
            isDedicatedCrashCar: true,
        }

        this.cars.push(crashCar)
        return crashCar
    }

    placeBlocker(lane) {
        if (this.blockers.has(lane)) return

        const pos = this.getPositionForLane(lane)
        const blocker = this.add.rectangle(pos.x, pos.y - 92, 56, 18, COLORS.blocker)
        blocker.setStrokeStyle(2, 0x7a5600)

        this.blockers.set(lane, blocker)
        this.blockLaneForSafe(lane)
    }

    reserveTrafficGap(lane, duration = 900) {
        const now = this.time.now
        this.cars.forEach((car) => {
            if (car.lane === lane && !car.isDedicatedCrashCar) {
                car.reservedUntil = now + duration
            }
        })
    }

    updateTraffic(delta) {
        const dt = delta / 1000

        this.cars.forEach((car) => {
            if (!car.rect.active) return

            const isLaneBlocked = this.getIsLaneBlocked(car.lane)
            const barrierY = this.getBarrierYForLane(car.lane)

            if (car.mode === 'crash-hit') {
                const crashSpeed = car.speed || 900
                car.rect.setVisible(true)
                car.rect.y += crashSpeed * dt

                if (car.targetCrashY && car.rect.y >= car.targetCrashY) {
                    car.rect.y = car.targetCrashY
                }

                return
            }

            if (isLaneBlocked && car.mode === 'normal') {
                if (car.rect.y < barrierY - 10) {
                    car.mode = 'stop-before-barrier'
                    car.stopY = barrierY - 38
                } else {
                    car.mode = 'rush-out'
                }
            }

            if (car.mode === 'stop-before-barrier') {
                car.rect.setVisible(true)

                const stopSpeed = car.speed * 0.9
                car.rect.y += stopSpeed * dt

                if (car.stopY !== null && car.rect.y >= car.stopY) {
                    car.rect.y = car.stopY
                }

                return
            }

            if (car.mode === 'rush-out') {
                car.rect.setVisible(true)

                car.rect.y += car.speed * 2.4 * dt

                if (car.rect.y - car.height / 2 > WORLD.height + 200) {
                    if (isLaneBlocked) {
                        car.rect.setVisible(false)
                        car.rect.y = WORLD.height + 500
                    } else {
                        car.mode = 'normal'
                        car.rect.y = -Phaser.Math.Between(220, 700)
                    }
                }

                return
            }

            car.rect.setVisible(true)

            let effectiveSpeed = car.speed

            if (car.reservedUntil > this.time.now) {
                const targetPos = this.getPositionForLane(car.lane)
                const gapCenterY = targetPos.y
                const nearGap = Math.abs(car.rect.y - gapCenterY) < 130

                if (nearGap) {
                    effectiveSpeed = car.speed * 2.2
                }
            }

            car.rect.y += effectiveSpeed * dt

            if (car.rect.y - car.height / 2 > WORLD.height + 200) {
                if (isLaneBlocked) {
                    car.rect.setVisible(false)
                    car.rect.y = WORLD.height + 500
                } else {
                    car.rect.y = -Phaser.Math.Between(220, 700)
                }
            }
        })
    }

    animatePlayToLane1() {
        this.startAnimation()
        const toLane = 1
        const toPos = this.getPositionForLane(toLane)

        this.reserveTrafficGap(toLane, 1200)
        this.setPlayerJumpPose()

        this.tweens.add({
            targets: this.player,
            x: toPos.x,
            y: toPos.y - 52,
            duration: 260,
            ease: 'Sine.easeOut',
            onComplete: () => {
                this.tweens.add({
                    targets: this.player,
                    y: toPos.y,
                    duration: 190,
                    ease: 'Sine.easeIn',
                    onComplete: () => {
                        this.playerShadow.setPosition(toPos.x, toPos.y + 34)
                        this.placeBlocker(1)
                        this.setPlayerIdlePose()
                        this.endAnimation()
                    },
                })
            },
        })

        this.tweens.add({
            targets: this.playerShadow,
            x: toPos.x,
            y: toPos.y + 34,
            duration: 450,
            ease: 'Linear',
        })

        this.panCameraToX(toPos.x)
    }

    animatePlayCrash() {
        this.startAnimation()

        const attemptedLane = 1
        this.manuallyBlockedLanes.add(attemptedLane)

        const toPos = this.getPositionForLane(attemptedLane)

        let crashCar = this.blockLaneForCrash(attemptedLane)

        if (!crashCar) {
            crashCar = this.spawnDedicatedCrashCar(attemptedLane)
        }

        this.setPlayerJumpPose()

        this.tweens.add({
            targets: this.player,
            x: toPos.x,
            y: toPos.y - 42,
            duration: 220,
            ease: 'Sine.easeOut',
        })

        this.tweens.add({
            targets: crashCar.rect,
            y: toPos.y,
            duration: 180,
            ease: 'Linear',
            onComplete: () => {
                this.cameras.main.shake(180, 0.01)
                this.setPlayerCrashPose()

                this.tweens.add({
                    targets: this.player,
                    angle: 90,
                    alpha: 0.55,
                    duration: 220,
                })

                this.time.delayedCall(420, () => {
                    this.endAnimation()
                })
            },
        })

        this.panCameraToX(toPos.x)
    }

    animateSafeMove(toLane) {
        this.startAnimation()

        const toPos = this.getPositionForLane(toLane)
        this.reserveTrafficGap(toLane, 1200)
        this.setPlayerJumpPose()

        this.tweens.add({
            targets: this.player,
            x: toPos.x,
            y: toPos.y - 56,
            duration: 270,
            ease: 'Sine.easeOut',
            onComplete: () => {
                this.tweens.add({
                    targets: this.player,
                    y: toPos.y,
                    duration: 190,
                    ease: 'Sine.easeIn',
                    onComplete: () => {
                        this.playerShadow.setPosition(toPos.x, toPos.y + 34)
                        this.placeBlocker(toLane)
                        this.setPlayerIdlePose()

                        if (toLane === PROTOTYPE_LANES) {
                            this.commandQueue.unshift({ type: 'AUTO_FINISH' })
                        }

                        this.endAnimation()
                    },
                })
            },
        })

        this.tweens.add({
            targets: this.playerShadow,
            x: toPos.x,
            y: toPos.y + 34,
            duration: 450,
            ease: 'Linear',
        })

        this.panCameraToX(toPos.x)
    }

    animateCrashMove(attemptedLane) {
        this.startAnimation()
        this.manuallyBlockedLanes.add(attemptedLane)

        const toPos = this.getPositionForLane(attemptedLane)

        let crashCar = this.blockLaneForCrash(attemptedLane)

        if (!crashCar) {
            crashCar = this.spawnDedicatedCrashCar(attemptedLane)
        }

        this.setPlayerJumpPose()

        this.tweens.add({
            targets: this.player,
            x: toPos.x,
            y: toPos.y - 42,
            duration: 220,
            ease: 'Sine.easeOut',
        })

        this.tweens.add({
            targets: crashCar.rect,
            y: toPos.y,
            duration: 180,
            ease: 'Linear',
            onComplete: () => {
                this.cameras.main.shake(180, 0.01)
                this.setPlayerCrashPose()

                this.tweens.add({
                    targets: this.player,
                    angle: 90,
                    alpha: 0.55,
                    duration: 220,
                })

                this.time.delayedCall(420, () => {
                    this.endAnimation()
                })
            },
        })

        this.panCameraToX(toPos.x)
    }

    animateCashout() {
        this.startAnimation()
        this.setPlayerCelebratePose()

        this.tweens.add({
            targets: this.player,
            scaleX: 1.08,
            scaleY: 1.08,
            duration: 180,
            yoyo: true,
            repeat: 2,
            onComplete: () => {
                this.player.setScale(1)
                this.setPlayerIdlePose()
                this.endAnimation()
            },
        })
    }

    animateFinishJump() {
        this.startAnimation()

        const toPos = this.getPositionForLane(PROTOTYPE_LANES + 1)
        this.setPlayerJumpPose()

        this.tweens.add({
            targets: this.player,
            x: toPos.x,
            y: toPos.y - 58,
            duration: 300,
            ease: 'Sine.easeOut',
            onComplete: () => {
                this.tweens.add({
                    targets: this.player,
                    y: toPos.y,
                    duration: 220,
                    ease: 'Sine.easeIn',
                    onComplete: () => {
                        this.playerShadow.setPosition(toPos.x, toPos.y + 34)
                        this.setPlayerCelebratePose()

                        this.tweens.add({
                            targets: this.player,
                            scaleX: 1.1,
                            scaleY: 1.1,
                            duration: 180,
                            yoyo: true,
                            repeat: 2,
                            onComplete: () => {
                                this.player.setScale(1)
                                this.setPlayerIdlePose()
                                this.endAnimation()
                            },
                        })
                    },
                })
            },
        })

        this.tweens.add({
            targets: this.playerShadow,
            x: toPos.x,
            y: toPos.y + 34,
            duration: 520,
            ease: 'Linear',
        })

        this.panCameraToX(toPos.x)
    }

    animateReset() {
        this.startAnimation()

        this.blockers.forEach((blocker) => blocker.destroy())
        this.blockers.clear()
        this.manuallyBlockedLanes.clear()

        const startPos = this.getPositionForLane(0)

        this.tweens.add({
            targets: this.player,
            x: startPos.x,
            y: startPos.y,
            angle: 0,
            alpha: 1,
            duration: 320,
            ease: 'Sine.easeInOut',
            onComplete: () => {
                this.playerShadow.setPosition(startPos.x, startPos.y + 34)
                this.setPlayerIdlePose()

                this.clearLaneTrafficForReset()

                this.panCameraToX(startPos.x)
                this.endAnimation()
            },
        })

        this.tweens.add({
            targets: this.playerShadow,
            x: startPos.x,
            y: startPos.y + 34,
            duration: 320,
            ease: 'Linear',
        })
    }

    panCameraToX(x) {
        const targetScrollX = Phaser.Math.Clamp(
            x - this.scale.width / 2,
            0,
            WORLD.width - this.scale.width
        )

        this.tweens.add({
            targets: this.cameras.main,
            scrollX: targetScrollX,
            duration: 260,
            ease: 'Sine.easeInOut',
        })
    }

    setPlayerIdlePose() {
        this.player.setScale(1)
        this.player.setAngle(0)
        this.player.setAlpha(1)
    }

    setPlayerJumpPose() {
        this.player.setScale(1.05)
        this.player.setAngle(0)
        this.player.setAlpha(1)
    }

    setPlayerCrashPose() {
        this.player.setScale(0.96)
    }

    setPlayerCelebratePose() {
        this.player.setScale(1.08)
        this.player.setAngle(0)
        this.player.setAlpha(1)
    }

    setSceneBusy(isBusy) {
        this.isAnimating = isBusy

        if (this.events) {
            this.events.emit('busy-change', isBusy)
        }
    }

    startAnimation() {
        this.setSceneBusy(true)
    }

    endAnimation() {
        this.setSceneBusy(false)
    }
}