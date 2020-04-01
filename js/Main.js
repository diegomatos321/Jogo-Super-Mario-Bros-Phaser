let config = {
    width: 240,
    height: 240,
    type: Phaser.AUTO,
    physics: {
        default: "arcade",
        arcade:{
            gravity:{y: 0},
            debug: false
        }
    },
    backgroundColor: "#5c94fc",
    pixelArt: true,
    scene: [BootScene, LoadScene, MenuScene, GameOverScene, Level1],
    scale: {
        mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
}

let game = new Phaser.Game(config);