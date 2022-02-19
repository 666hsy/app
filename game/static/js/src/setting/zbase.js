class GameSetting {
    constructor(root) {
        this.root = root;
        this.$setting = $(`
<div class="game-setting">
    <div class="game-reward-title">
        选择英雄
    </div>
    <div class="game-setting-field">
        <div class="game-setting-field-item">
            <img src="../../static/image/setting/1.jpg" />
        </div>
        <div class="game-setting-field-item">
            <img src="../../static/image/setting/2.jpg" />
        </div>
        <div class="game-setting-field-item">
            <img src="../../static/image/setting/3.jpg" />
        </div>
        <div class="game-setting-field-item">
            <img src="../../static/image/setting/4.jpg" />
        </div>
        <div class="game-setting-field-item">
            <img src="../../static/image/setting/5.jpg" />
        </div>
    </div>
    <div class='game-turn-back'>
        返回
    </div>
</div>
`);
        this.hide();
        this.root.$game.append(this.$setting);
        this.$turn_back = this.$setting.find('.game-turn-back');
        // this.$choose_hero = this.$setting.find('.jq_content_setting_option_select_hero');

        this.start();
    }

    start() {
        this.add_listening_events();
    }

    add_listening_events() {
        let outer = this;
        this.$turn_back.click(function() {
            outer.hide();
            outer.root.$menu.show();
        });
        // this.$choose_hero.click(function() {
        //     outer.hide();
        //     outer.root.select_hero.show();
        // });
    }

    show() {
        this.$setting.show();
    }
    hide() {
        this.$setting.hide();
    }

}
