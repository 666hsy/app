class GamePlayground {
    constructor(root) {
        this.root = root;
        this.$playground = $(`<div class="game-playground"></div>`);

        // this.hide();
        this.root.$game.append(this.$playground);
        this.width=this.$playground.width();
        this.height=this.$playground.height();
        this.game_map=new GameMap(this);
        this.player=new Player(this,this.width/2,this.height/2,this.height*0.05,"white",this.height*0.15,true)

        this.start();
    }
    start() 
    {
        
    }
    show()
    {
        this.$playground.show();
    }
    hide()
    {
        this.$playground.hide();
    }

}
