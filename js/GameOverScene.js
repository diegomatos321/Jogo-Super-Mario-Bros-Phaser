class GameOverScene extends Phaser.Scene{
    constructor(){
        super("GameOverScene");
    }

    init(parameters){
        this.level = parameters.level;
        this.name = parameters.name;
    }
    create(){ 
        console.log(this.level);
        this.cameras.main.setBackgroundColor("black");
        this.txtLevel = this.add.text(config.width / 2, config.height/3, `${this.name}`, { fontFamily: "Source Code Pro", fontSize: "12px" })
        this.txtLevel.setOrigin(0.5)

        this.time.addEvent({
            delay: 4000,                // ms
            callback: function (){
                this.scene.start(this.level)
            },
            //args: [],
            callbackScope: this
        });
    }
    update(){

    }
}