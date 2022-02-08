class GameMenu {
    constructor(root) {
        this.root = root;
        this.$menu = $(`
<div class="game-menu">
<audio class="ac-game-menu-bgm" src="../../audio/menu/background1.mp3" preload="auto" autoplay="autoplay" loop="loop"></audio>
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
