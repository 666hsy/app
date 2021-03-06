class GameSetting {
    constructor(root) {
        this.root = root;
        this.hero = "https://img0.baidu.com/it/u=1484750640,2260383730&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500";
        this.score = this.root.$login.score;
        this.money = this.root.$login.money;
        this.hero = 0;
        this.$setting = $(`
<div class="game-setting">
    <audio id="hero6">
        <source src="https://downsc.chinaz.net/Files/DownLoad/sound1/202011/13592.mp3" type="audio/mpeg">
    </audio>
    <audio id="hero5">
        <source src="https://downsc.chinaz.net/Files/DownLoad/sound1/201903/11308.mp3" type="audio/mpeg">
    </audio>
    <div class="game-reward-title">
        选择英雄
    </div>
    <div class="game-setting-field">
        <div class="game-setting-field-item">
            <img class ="img-1" src="../../static/image/setting/1.jpg" />
        </div>
        <div class="game-setting-field-item">
            <img class ="img-2" src="../../static/image/setting/2.jpg" />
        </div>
        <div class="game-setting-field-item">
            <img class ="img-3" src="../../static/image/setting/3.jpg" />
        </div>
        <div class="game-setting-field-item">
            <img class ="img-4" src="../../static/image/setting/4.jpg" />
        </div>
        <div class="game-setting-field-item">
            <img class ="img-5" src="https://icons.iconarchive.com/icons/fazie69/league-of-legends/256/Ezreal-Pulsefire-without-LoL-logo-icon.png" />
        </div>
        <div class="game-setting-field-item">
            <img class ="img-6" src="https://img.anfensi.com/upload/2019-3/201932790313858.png" />
        </div>
        <div class="game-setting-field-item">
            <img class ="img-7" src="https://gameplus-platform.cdn.bcebos.com/gameplus-platform/upload/file/source/QQ%E6%88%AA%E5%9B%BE20211024095740_1635041048562.png" />
        </div>
        <div class='game-setting-origin'>
            恢复默认
        </div>
    </div>
    <div class='game-setting-logout'>
        退出登录
    </div>
    <div class='game-turn-back'>
        返回
    </div>
</div>
`);
        this.hide();

        this.root.$game.append(this.$setting);

        this.$game_logout = this.$setting.find('.game-setting-logout');
        this.$game_origin = this.$setting.find('.game-setting-origin');
        this.$turn_back = this.$setting.find('.game-turn-back');
        this.$score = this.$setting.find('.game-setting-score');
        this.$img_1 = this.$setting.find('.img-1');
        this.$img_2 = this.$setting.find('.img-2');
        this.$img_3 = this.$setting.find('.img-3');
        this.$img_4 = this.$setting.find('.img-4');
        this.$img_5 = this.$setting.find('.img-5');
        this.$img_6 = this.$setting.find('.img-6');
        this.$img_7 = this.$setting.find('.img-7');
        this.bgSound_hero5 = document.getElementById("hero5");
        this.bgSound_hero6 = document.getElementById("hero6");

        this.start();
    }

    start() {
        this.add_listening_events();
    }

    add_listening_events() {
        let outer = this;
        this.$game_logout.click(function () {
            outer.hide();
            outer.root.$login.logout_on_remote();
        });
        this.$turn_back.click(function () {
            outer.hide();
            outer.root.$menu.bgSound_hero.pause();
            outer.root.$menu.show();
        });
        this.$img_1.click(function () {
            outer.hero = 1;  //"../../static/image/setting/1.jpg";
            alert("已选择：hero1");
        });
        this.$img_2.click(function () {
            outer.hero = 2;//"../../static/image/setting/2.jpg";
            alert("已选择：hero2");
        });
        this.$img_3.click(function () {
            outer.hero = 3;//"../../static/image/setting/3.jpg";
            alert("已选择：hero3");
        });
        this.$img_4.click(function () {
            outer.hero = 4;//"../../static/image/setting/4.jpg";
            alert("已选择：hero4");
        });
        this.$img_5.click(function () {
            outer.hero = 5;//"https://icons.iconarchive.com/icons/fazie69/league-of-legends/256/Ezreal-Pulsefire-without-LoL-logo-icon.png";
            outer.bgSound_hero5.play();
        });
        this.$img_6.click(function () {
            outer.hero = 6;//"https://img.anfensi.com/upload/2019-3/201932790313858.png";
            outer.bgSound_hero6.play();
        });
        this.$img_7.click(function () {
            outer.hero = 7;//"https://gameplus-platform.cdn.bcebos.com/gameplus-platform/upload/file/source/QQ%E6%88%AA%E5%9B%BE20211024095740_1635041048562.png";
            alert("已选择：hero7");
        });
        this.$game_origin.click(function () {
            outer.hero = "https://img0.baidu.com/it/u=1484750640,2260383730&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500";
            alert("已选择：默认英雄");
        });
    }

    show() {
        this.setting_board = new SettingBoard(this);
        this.$setting.show(500);
    }
    hide() {
        if (this.setting_board)
            this.setting_board.hide();
        this.$setting.hide(500);
    }

}
