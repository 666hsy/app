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

    <div class='game-turn-back'>
        返回
    </div>
</div>
`);
        this.hide();
        this.root.$game.append(this.$reward);
        this.$turn_back = this.$reward.find('.game-turn-back');
        // this.$reward=this.$menu.find('.game-menu-field-item-reward');
        // this.$setting=this.$menu.find('.game-menu-field-item-setting');

        this.start();
    }
    start() {
        this.add_listening_events();
    }

    add_listening_events() {
        let outer = this;
        this.$turn_back.click(function() {
            outer.root.$menu.bgSound2.pause();
            outer.hide();
            outer.root.$menu.show();
        });
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
