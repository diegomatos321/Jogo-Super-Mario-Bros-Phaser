class Level1 extends Phaser.Scene {
    constructor() {
        super("Level1");
    }

    create() {
        this.anims.resumeAll()
        // Audio
        this.backgroundMusic = this.sound.add("backgroundMusic", {
            mute: false,
            volume: 0.3,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        })

        this.backgroundMusic.play();
        this.jumpSFX = this.sound.add("jumpSFX");
        this.bumpSFX = this.sound.add("bumpSFX");
        this.coinSFX = this.sound.add("coinSFX");
        this.gameOverSFX = this.sound.add("gameOverSFX");

        // TILEMAP
        this.physics.world.setBounds(0, 0, 3584, 288);

        this.map = this.add.tilemap("world-1-1");
        this.tileset = this.map.addTilesetImage('mariotilemap', 'tileset');

        this.background = this.map.createDynamicLayer("background", this.tileset);

        this.world = this.map.createDynamicLayer("world", this.tileset);
        this.world.setCollisionByProperty({ collide: true });

        // JOGADOR
        this.jogador = this.physics.add.sprite(100, config.height - 48, "MarioPequeno");
        this.jogador.setCollideWorldBounds(true);
        this.jogador.body.setMaxVelocity(100, 420)
        this.jogador.setGravity(0, 1000);
        this.jogador.jumpTime = 0;
        this.jogador.hasJumped = false;
        this.jogador.setDepth(3);

        this.jogador.stance = "Idle"

        // BLOCOS INTERATIVOS


        this.bricks = this.add.group();
        this.surpriseBricks = this.add.group();

        this.world.forEachTile(tile => {
            if (tile.index === 2) {
                const x = tile.getCenterX();
                const y = tile.getCenterY();

                let brick = this.physics.add.sprite(x, y, "brick");
                brick.setDepth(2);
                brick.setImmovable();
                this.bricks.add(brick);

                this.world.removeTileAt(tile.x, tile.y);
            }
            if (tile.index === 25) {
                const x = tile.getCenterX();
                const y = tile.getCenterY();

                let surpriseBricks = this.physics.add.sprite(x, y, "surpriseBlock");
                surpriseBricks.anims.play("Surprise Block 1");
                surpriseBricks.setDepth(2);
                surpriseBricks.setImmovable();
                surpriseBricks.canDrop = true;
                this.surpriseBricks.add(surpriseBricks);

                this.world.removeTileAt(tile.x, tile.y);
            }
        });

        // INIMIGOS
        this.inimigos = this.add.group();

        this.world.forEachTile(tile => {
            if (tile.index === 64) {
                const x = tile.getCenterX();
                const y = tile.getCenterY();

                let littleGomba = new Enemy(this, x, y - 20, "LittleGomba");
                littleGomba.setGravity(0, 1000);
                littleGomba.anims.play("Little Gomba Walking", true);
                littleGomba.name = "Little Gomba";
                this.inimigos.add(littleGomba);

                this.world.removeTileAt(tile.x, tile.y);
            }
            if (tile.index === 65) {
                const x = tile.getCenterX();
                const y = tile.getCenterY();

                let koopaTroopa = new Enemy(this, x, y - 20, "KoopaTroopa");
                koopaTroopa.anims.play("Koopa Troopa Walking", true);
                koopaTroopa.name = "Koopa Troopa";
                koopaTroopa.wasHit = false;
                koopaTroopa.setGravity(0, 1000);
                this.inimigos.add(koopaTroopa);

                this.world.removeTileAt(tile.x, tile.y);
            }
        });

        // ITEMS
        this.items = this.add.group();

        this.cursor = this.input.keyboard.createCursorKeys();

        // HUD

        this.hudScore = 0;
        this.hudCoins = 0;
        this.hudTime = 240;

        this.txtMARIO = this.add.text(25, 5, "MARIO", { fontFamily: "Source Code Pro", fontSize: "12px" })
        this.txtMARIO.setScrollFactor(0);
        this.txtScore = this.add.text(45, 25, `${this.hudScore}`, { fontFamily: "Source Code Pro", fontSize: "12px" })
        this.txtScore.setOrigin(0.5);
        this.txtScore.setScrollFactor(0);

        this.hudCoin = this.add.sprite(80, 20, "coin");
        this.hudCoin.setScale(0.7)
        this.hudCoin.setOrigin(0, 0);
        this.hudCoin.setScrollFactor(0);
        this.hudCoin.anims.play("Coin 1")
        this.txtCoins = this.add.text(98, 24, `x ${this.hudCoins}`, { fontFamily: "Source Code Pro", fontSize: "12px" })
        this.txtCoins.setOrigin(0.5);
        this.txtCoins.setScrollFactor(0);

        this.txtWorldLevel = this.add.text(130, 5, `MUNDO`, { fontFamily: "Source Code Pro", fontSize: "12px" })
        this.txtWorldLevel.setScrollFactor(0);
        this.txtLevel = this.add.text(152, 25, `1-1`, { fontFamily: "Source Code Pro", fontSize: "12px" })
        this.txtLevel.setOrigin(0.5);
        this.txtLevel.setScrollFactor(0);

        this.txtTimeLevel = this.add.text(190, 5, `TEMPO`, { fontFamily: "Source Code Pro", fontSize: "12px" })
        this.txtTimeLevel.setScrollFactor(0);
        this.txtTime = this.add.text(210, 25, `${this.hudTime}`, { fontFamily: "Source Code Pro", fontSize: "12px" })
        this.txtTime.setOrigin(0.5);
        this.txtTime.setScrollFactor(0);
        this.hudTimer = this.time.addEvent({
            delay: 1000,                // ms
            callback: function () {
                this.hudTime--;
                this.txtTime.text = `${this.hudTime}`;
                if (this.hudTime == 0) {
                    this.gameOver("Inimigo");
                }
            },
            args: [],
            callbackScope: this,
            loop: true,
            timeScale: 1,
        });
        // FISICA
        this.objectWorldCollider = this.physics.add.collider(this.jogador, this.world);
        this.physics.add.collider(this.jogador, this.bricks, this.playerHitBrick, null, this);
        this.physics.add.collider(this.jogador, this.surpriseBricks, this.playerHitSurpriseBrick, null, this);
        this.physics.add.overlap(this.jogador, this.items, this.collectItem, null, this);

        this.physics.add.collider(this.inimigos, this.world);
        this.physics.add.collider(this.inimigos, this.surpriseBricks);
        this.physics.add.collider(this.inimigos, this.bricks);
        this.physics.add.overlap(this.inimigos, this.inimigos, this.enemyOverlap, null, this);

        this.physics.add.collider(this.items, this.world);
        this.physics.add.collider(this.items, this.bricks);
        this.physics.add.collider(this.items, this.surpriseBricks);

        this.physics.add.collider(this.jogador, this.inimigos, this.enemyCollision, null, this);

        this.cameras.main.startFollow(this.jogador, true, 0.05, 0.05, -50);
        this.cameras.main.setBounds(0, 0, 3584, 240).setName('main');
    }
    update(time, deltaTime) {
        this.movePlayer(deltaTime)

        this.inimigos.children.each((inimigo) => {
            inimigo.update();
        })

        this.items.children.each((item) => {
            if (item.name == "Mushroom" && item.body.onWall() && (item.body.touching.down || item.body.onFloor())) {
                item.direcao *= -1;
            }

            item.update();
        })

        if (this.jogador.y + this.jogador.height / 2 == 288) {
            this.gameOver("Bordas do Mundo");
        }
    }

    movePlayer(deltaTime) {
        if (!this.jogador.active) { return; }

        if (!this.cursor.right.isDown && !this.cursor.left.isDown) {
            this.jogador.setAccelerationX(0);
            this.jogador.setDragX(200);
        }
        if (this.jogador.body.velocity.x == 0 && (this.jogador.body.touching.down || this.jogador.body.onFloor())) {
            this.jogador.stance = "Idle"
            this.jogador.anims.play("Idle", true);
        }

        if (this.cursor.right.isDown) {
            this.jogador.flipX = false;
            this.jogador.setAccelerationX(350);

            if (this.jogador.body.velocity.x < 0 && (this.jogador.body.touching.down || this.jogador.body.onFloor())) {
                this.jogador.stance = "Changing Direction"
                this.jogador.anims.play("Changing Direction", true);
            }
            else if (this.jogador.body.touching.down || this.jogador.body.onFloor()) {
                this.jogador.stance = "Walking"
                this.jogador.anims.play("Walking", true);
            }
        }
        if (this.cursor.left.isDown) {
            this.jogador.flipX = true;
            this.jogador.setAccelerationX(-350);

            if (this.jogador.body.velocity.x > 0 && (this.jogador.body.touching.down || this.jogador.body.onFloor())) {
                this.jogador.stance = "Walking"
                this.jogador.anims.play("Changing Direction", true);
            }
            else if (this.jogador.body.touching.down || this.jogador.body.onFloor()) {
                this.jogador.stance = "Walking"
                this.jogador.anims.play("Walking", true);
            }
        }
        if (this.cursor.up.isDown) {
            if ((this.jogador.body.touching.down || this.jogador.body.onFloor()) && !this.jogador.hasJumped) {
                this.jogador.jumpTime = 0;

                //this.jogador.setVelocityY(-420);
                this.jogador.stance = "Jumping";
                this.jogador.anims.play("Jump", true);
                this.jumpSFX.play();
                this.jogador.hasJumped = true;
            }
            if (this.jogador.hasJumped) {
                this.jogador.jumpTime += deltaTime;
                if (this.jogador.jumpTime > 280) {
                    return;
                }
                this.jogador.setVelocityY(-210)
            }
        }
        if (this.cursor.up.isUp) {
            this.jogador.jumpTime = 0;
            this.jogador.hasJumped = false;
        }

        /*if (!this.jogador.body.touching.down && !this.jogador.body.onFloor()) {
            this.jogador.anims.play("Jump", false);
        }*/
    }

    enemyCollision(jogador, inimigo) {
        if (jogador.y + jogador.height <= inimigo.y) {
            let newScore;
            jogador.setVelocityY(-130);
            this.bumpSFX.play();

            if (inimigo.name == "Little Gomba") {
                inimigo.anims.play("Little Gomba Dead")
                this.time.addEvent({
                    delay: 300,                // ms
                    callback: function () {
                        this.inimigos.remove(inimigo, true, true);
                    },
                    //args: [],
                    callbackScope: this
                });
                inimigo.alive = false;
                inimigo.disableBody(true);
                inimigo.setVelocityX(0);

                newScore = 200;
            }

            else if (inimigo.name == "Koopa Troopa") {
                if(!inimigo.wasHit){
                    inimigo.anims.play("Koopa Troopa Defend");
                    inimigo.canWalk = false;
                    inimigo.wasHit = true;
                    inimigo.setVelocityX(0);
                    newScore = 200;
                } else if (inimigo.wasHit && !inimigo.canWalk){
                    inimigo.maxVelocity = 250;
                    if (jogador.x < inimigo.x) {
                        //inimigo.setVelocityX(-250);
                        inimigo.direcao = 1;
                    } else if (jogador.x > inimigo.x) {
                       // inimigo.setVelocityX(250);
                        inimigo.direcao = -1;
                    }
                    newScore = 400;
                    inimigo.canWalk = true;
                }
                else {
                    inimigo.maxVelocity = 0;
                    inimigo.setVelocityX(0);
                    newScore = 400;
                    inimigo.canWalk = false;
                }
            }
            else {
                return;
            }

            let txtScore = this.add.text(inimigo.x, inimigo.y - inimigo.height, `${newScore}`, { fontFamily: "Source Code Pro", fontSize: "8px" })
            txtScore.setOrigin(0.5);
            txtScore.setDepth(5);

            this.addScore(newScore);

            this.tweens.add({
                targets: txtScore,
                y: inimigo.y - (inimigo.height * 3.5),
                ease: 'Circ',
                duration: 400,
                repeat: 0,
                yoyo: false,
                onComplete: function () {
                    txtScore.destroy()
                },
                onCompleteScope: this
            });
        } 
        else if (inimigo.name == "Koopa Troopa" && inimigo.wasHit) {
            console.log(inimigo)
            if(!inimigo.canWalk){
                inimigo.maxVelocity = 250;
                if (jogador.x < inimigo.x) {
                    //inimigo.setVelocityX(-250);
                    inimigo.direcao = 1;
                } else if (jogador.x > inimigo.x) {
                   // inimigo.setVelocityX(250);
                    inimigo.direcao = -1;
                }
                inimigo.canWalk = true;    
            }
            else {
                this.gameOver("Inimigo")
            }
        }
        else {
            this.gameOver("Inimigo");
        }
    }

    enemyOverlap(inimigoA, inimigoB) {
        if (inimigoA.name == "Koopa Troopa") {
            this.inimigos.remove(inimigoB, true, true);
        }
    }

    playerHitBrick(jogador, brick) {
        if (Math.ceil(jogador.y - jogador.height / 2) == Math.ceil(brick.y + brick.height / 2)) {
            jogador.jumpTime = 500;
            jogador.setVelocityY(0);

            //console.log("FOI")
            this.tweens.add({
                targets: brick,
                y: brick.y - brick.height / 2,
                ease: 'Circ',
                duration: 100,
                repeat: 0,
                yoyo: true
            });
        }
    }

    playerHitSurpriseBrick(jogador, brick) {
        if (Math.ceil(jogador.y - jogador.height / 2) == Math.ceil(brick.y + brick.height / 2)) {
            if (!brick.canDrop) { return; }

            if (jogador.tamanho = "Pequeno") {
                this.tweens.add({
                    targets: brick,
                    y: brick.y - brick.height / 2,
                    ease: 'Circ',
                    duration: 100,
                    repeat: 0,
                    yoyo: true
                });
            }

            let itemProb = Math.round(Math.random() * 100);
            let item;
            jogador.jumpTime = 500;
            jogador.setVelocityY(0);

            brick.canDrop = false;
            brick.anims.play("Surprise Block 2");


            if (itemProb <= 70) {
                console.log("COIN")

                this.coinSFX.play();
                item = this.physics.add.sprite(brick.x, brick.y - brick.height / 2, "coin");
                item.name = "Coin"
                this.time.addEvent({
                    delay: 500,                // ms
                    callback: function () {
                        this.collectItem(this.jogador, item);
                    },
                    args: [],
                    callbackScope: this,
                    loop: false,
                    timeScale: 1,
                });
            } else if (itemProb <= 90) {
                console.log("MUSHROOM")
                item = new Item(this, brick.x, brick.y - brick.height / 2, "mushroom")
                item.name = "Mushroom"
            } else if (itemProb <= 95) {
                console.log("MAGIC MUSHROOM")
                item = this.physics.add.sprite(brick.x, brick.y - brick.height / 2, "magicMushroom");
                item.name = "Magic Mushroom"
            } else {
                console.log("STAR MAN")
                item = this.physics.add.sprite(brick.x, brick.y - brick.height / 2, "starMan");
                item.name = "Star Man"
            }

            item.setVelocityY(-250);
            item.setGravity(0, 1000);
            item.setDepth(1);
            this.items.add(item);
        }
    }

    collectItem(jogador, item) {
        if (item.name == "Coin") {
            console.log("Coletou Coin");
            this.items.remove(item, true, true)
            this.addScore(200);
            this.addCoin();
        }
        if (item.name == "Mushroom") {
            console.log("Coletou Mushroom");
            this.items.remove(item, true, true)
        }
        if (item.name == "Magic Mushroom") {
            console.log("Coletou Magic Mushroom");
            this.items.remove(item, true, true)
        }
        if (item.name == "Star Man") {
            console.log("Coletou Star Man");
            this.items.remove(item, true, true)
        }
    }

    addScore(score) {
        this.hudScore += score;
        this.txtScore.text = this.hudScore;
    }

    addCoin() {
        this.hudCoins++;
        this.txtCoins.text = `x ${this.hudCoins}`;
    }

    gameOver(origem) {
        if (this.jogador.active == false) { return; }
        this.stopAll();
        this.jogador.setVelocity(0);
        this.jogador.setAcceleration(0)
        this.jogador.setActive(false);
        this.jogador.anims.play("Dead");
        this.gameOverSFX.play();
        //this.jogador.disableBody(true);

        if (origem == "Inimigo") {
            //this.objectWorldCollider.destroy();
            this.physics.world.colliders.destroy();
            this.tweens.add({
                targets: this.jogador,
                y: this.jogador.y - (this.jogador.height * 3),
                ease: 'Circ',
                duration: 700,
                repeat: 0,
                yoyo: false
            });
        }

        this.gameOverSFX.once('complete', (music) => {
            this.scene.start("GameOverScene", { level: "Level1", name: "World 1-1" })
        });
    }

    stopAll() {
        this.anims.pauseAll();
        this.sound.pauseAll();
        this.cameras.main.stopFollow();
        this.hudTimer.destroy();

        this.items.children.iterate((item, index) => {
            item.setVelocity(0, 0);
            item.disableBody(true);
            item.body.setAllowGravity(false);
        })

        this.inimigos.children.iterate((inimigo, index) => {
            inimigo.setVelocity(0, 0);
            inimigo.disableBody(true);
            inimigo.body.setAllowGravity(false);
        })

    }
}