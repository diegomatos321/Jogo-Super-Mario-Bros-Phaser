export default class LoadScene extends Phaser.Scene {
    constructor() {
        super("LoadScene")
    }

    init(){
        const {width, height} = this.sys.game.canvas;
        this.GAME_WIDTH = width;
        this.GAME_HEIGHT = height;
    }

    preload() {
        let loadingBar = this.add.sprite(this.GAME_WIDTH / 2 - 100,  this.GAME_HEIGHT / 2, "loadingBar")
        loadingBar.setOrigin(0);

        let txtLoading = this.add.text(this.GAME_WIDTH / 2,  this.GAME_HEIGHT / 2 + 24, "Loading...:")
        txtLoading.setOrigin(0.5);
        let txtLoadingPerc = this.add.text(this.GAME_WIDTH / 2,  this.GAME_HEIGHT / 2, "0%")
        txtLoadingPerc.setOrigin(0.5);

        this.load.on('progress', function (value) {
            console.log(value);
            loadingBar.displayWidth = loadingBar.width * value
            txtLoadingPerc.setText(`${value.toFixed(2) * 100}%`)
        });

        this.load.on('fileprogress', function (file) {
            txtLoading.setText(`Loading...: ${file.key}`)
            console.log(file.src);
        });

        this.load.on('complete', function () {
            txtLoading.setText(`Loading...: Completed !`);
            console.log('complete');
        });

        // SPRITE SHEETS

        this.load.spritesheet("MarioPequeno", "./assets/imagens/Mario-Pequeno.png", {
            frameWidth: 16, frameHeight: 16
        })

        this.load.spritesheet("LittleGomba", "./assets/imagens/Little-Gomba.png", {
            frameWidth: 16, frameHeight: 16
        })

        this.load.spritesheet("surpriseBlock", "./assets/imagens/surpriseBlock.png", {
            frameWidth: 16, frameHeight: 16
        })

        this.load.spritesheet("coin", "./assets/imagens/coin.png", {
            frameWidth: 16, frameHeight: 16
        })

        this.load.spritesheet("KoopaTroopa", "./assets/imagens/Koopa-Troopa.png", {
            frameWidth: 16, frameHeight: 24
        })

        // IMAGENS PNG
        this.load.image("brick", "./assets/imagens/brick.png");
        this.load.image("magicMushroom", "./assets/imagens/MagicMushroom.png");
        this.load.image("mushroom", "./assets/imagens/Mushroom.png");
        this.load.image("starMan", "./assets/imagens/Starman.png");

        // TILEMAP

        this.load.tilemapTiledJSON("world-1-1", "./assets/tilemap/world1-1.json");

        // TILESET  

        this.load.image("tileset", "./assets/tilemap/tileset.png")

        // AUDIO FILES

        this.load.audio("jumpSFX", "./assets/audio/smb_jump-small.wav");
        this.load.audio("coinSFX", "./assets/audio/smb_coin.wav");
        this.load.audio("bumpSFX", "./assets/audio/smb_bump.wav");
        this.load.audio("backgroundMusic", "./assets/audio/BackgroundMusic.wav")
        this.load.audio("gameOverSFX", "./assets/audio/smb_gameover.wav");
    }

    create() {
        // ANIMAÇÕES DO JOGADOR

        this.anims.create(
            {
                key: "Walking",
                frames: this.anims.generateFrameNumbers("MarioPequeno", { start: 6, end: 7 }),
                frameRate: 10,
                repeat: -1
            });
        this.anims.create(
            {
                key: "Jump",
                frames: [{ key: "MarioPequeno", frame: 1 }],
                frameRate: 10,
                repeat: -1
            });
        this.anims.create(
            {
                key: "Idle",
                frames: [{ key: "MarioPequeno", frame: 0 }],
                frameRate: 10,
                repeat: -1
            });
        this.anims.create(
            {
                key: "Changing Direction",
                frames: [{ key: "MarioPequeno", frame: 5 }],
                frameRate: 10,
                repeat: -1
            });

        this.anims.create(
            {
                key: "Dead",
                frames: [{ key: "MarioPequeno", frame: 2 }],
                frameRate: 10,
                repeat: -1
            });

        // BLOCOS INTERATIVOS

        this.anims.create(
            {
                key: "Surprise Block Ativo",
                frames: this.anims.generateFrameNumbers("surpriseBlock", { start: 0, end: 3 }),
                frameRate: 7,
                repeat: -1,
                repeatDelay: 10
            });

        // INIMIGOS

        this.anims.create(
            {
                key: "Surprise Block Inativo",
                frames: [{ key: "surpriseBlock", frame: 4 }],
                frameRate: 10,
                repeat: -1
            });
        this.anims.create(
            {
                key: "Little Gomba Walking",
                frames: this.anims.generateFrameNumbers("LittleGomba", { start: 0, end: 1 }),
                frameRate: 8,
                repeat: -1
            });

        this.anims.create(
            {
                key: "Little Gomba Dead",
                frames: [{ key: "LittleGomba", frame: 2 }],
                duration: 500,
                repeat: 0
            });
        this.anims.create(
            {
                key: "Koopa Troopa Walking",
                frames: this.anims.generateFrameNumbers("KoopaTroopa", { start: 0, end: 1 }),
                frameRate: 8,
                repeat: -1
            });
        this.anims.create(
            {
                key: "Koopa Troopa Defend",
                frames: [{ key: "KoopaTroopa", frame: 2 }],
                duration: 500,
                repeat: 0
            });

        // HUD

        this.anims.create(
            {
                key: "Coin 1",
                frames: this.anims.generateFrameNumbers("coin", { start: 0, end: 2 }),
                frameRate: 6,
                repeat: -1
            });

        this.add.text(this.GAME_WIDTH / 2,  this.GAME_HEIGHT / 2 + 48, "Pressione ENTER").setOrigin(0.5);
        let enterKey = this.input.keyboard.addKey("ENTER");
        enterKey.on('down', function () {
            this.scene.start("MenuScene")
        }, this)
    }
}