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
