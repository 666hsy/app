class GameMenu {
    constructor(root) {
        this.root = root;
        this.$menu = $(`
<div class="game-menu">
    <div class="game-menu-field">
        <div class="game-menu-field-item game-menu-field-item-startgame">
            开始游戏
        </div>
        <br>
        <div class="game-menu-field-item game-menu-field-item-reward">
            打赏
        </div>
        <br>
        <div class="game-menu-field-item game-menu-field-item-setting">
            设置
        </div>
    </div>
</div>
`);
        this.root.$game.append(this.$menu);
        this.$startgame=this.$menu.find('.game-menu-field-item-startgame');
        this.$reward=this.$menu.find('.game-menu-field-item-reward');
        this.$setting=this.$menu.find('.game-menu-field-item-setting');

        this.start();
    }
    start()
    {
        this.add_listening_events();
    }

    add_listening_events()
    {
        let outer=this;
        this.$startgame.click(function(){

        });
        this.$reward.click(function(){
            outer.hide();
            outer.root.$reward.show();
        });

        this.$setting.click(function(){

        });
    }

    show()
    {
        this.$menu.show();
    }

    hide()
    {
        this.$menu.hide();
    }
}
class GameReward {
    constructor(root) {
        this.root = root;
        this.$reward = $(`
<div class ="game-reward">
    <div class="game-reward-title">
        创作不易，来打个赏吧！
    </div>

    <div class="game-reward-field">
        <div class="game-reward-field-item1">
            
        </div>

        <div class="game-reward-field-item2">
            
        </div>
        
    </div>
</div>
`);
        this.hide();
        this.root.$game.append(this.$reward);
        // this.$startgame=this.$menu.find('.game-menu-field-item-startgame');
        // this.$reward=this.$menu.find('.game-menu-field-item-reward');
        // this.$setting=this.$menu.find('.game-menu-field-item-setting');

        this.start();
    }
    start()
    {

    }

    show()
    {
        this.$reward.show();
    }

    hide()
    {
        this.$reward.hide();
    }
}
class Game{
    constructor(id) {
        this.id = id;
        this.$game = $('#' + id);
        this.$menu = new GameMenu(this);
        this.$reward=new GameReward(this);

        this.start();
    }
    start()
    {

    }
}
