export default class Jogador extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, {current, tamanho}) {
        super(scene, x, y, texture)

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);
        this.body.setMaxVelocity(100, 420)
        this.setGravity(0, 1000);
        this.jumpTime = 0;
        this.hasJumped = false;
        this.setDepth(3);

        this.current = current;
        this.tamanho = tamanho;
        this.stance = "Idle"

    }

    update(cursor, deltaTime) {
        // Anima Jogador
        this.animacaoDoJogador();

        if (!this.active) { return; }
        // Movimenta o Jogador
        this.movimentacaoDoJogador(cursor, deltaTime)

    }

    movimentacaoDoJogador(cursor, deltaTime) {
        if (!cursor.right.isDown && !cursor.left.isDown) {
            this.setAccelerationX(0);
            this.setDragX(200);
        }

        if (this.body.velocity.x == 0 && (this.body.touching.down || this.body.onFloor())) {
            this.stance = "Idle"
        }

        if (cursor.right.isDown) {
            this.flipX = false;
            this.setAccelerationX(350);

            if (this.body.velocity.x < 0 && (this.body.touching.down || this.body.onFloor())) {
                this.stance = "Changing Direction";
            }
            else if (this.body.touching.down || this.body.onFloor()) {
                this.stance = "Walking";
            }
        }
        else if (cursor.left.isDown) {
            this.flipX = true;
            this.setAccelerationX(-350);

            if (this.body.velocity.x > 0 && (this.body.touching.down || this.body.onFloor())) {
                this.stance = "Changing Direction";
            }
            else if (this.body.touching.down || this.body.onFloor()) {
                this.stance = "Walking"
            }
        }

        if (cursor.up.isDown) {
            if ((this.body.touching.down || this.body.onFloor()) && !this.hasJumped) {
                this.jumpTime = 0;

                this.stance = "Jump";
                this.scene.jumpSFX.play();
                this.hasJumped = true;
            }

            if (this.hasJumped) {
                this.jumpTime += deltaTime;
                if (this.jumpTime > 280) {
                    return;
                }
                this.setVelocityY(-210)
            }
        }
        if (cursor.up.isUp) {
            this.jumpTime = 0;
            this.hasJumped = false;
        }
    }

    animacaoDoJogador() {
        this.body.setSize();
        this.anims.play(`${this.current} ${this.tamanho} ${this.stance}`, true);
    }
}