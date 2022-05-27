class GameMenu {
    constructor(root) {
        this.root = root;
        this.$menu = $(`
<div class="game-menu">
    <audio id="bgMusic">
        <source src="https://downsc.chinaz.net/Files/DownLoad/sound1/201604/7170.mp3" type="audio/mpeg">
    </audio>

    <audio id="unstop">
        <source src="https://downsc.chinaz.net/Files/DownLoad/sound1/201809/10598.mp3" type="audio/mpeg">
    </audio>

    <audio id="legnerdy">
        <source src="https://downsc.chinaz.net/Files/DownLoad/sound1/201809/10597.mp3" type="audio/mpeg">
    </audio>

    <audio id="godlike">
        <source src="https://downsc.chinaz.net/Files/DownLoad/sound1/201809/10596.mp3" type="audio/mpeg">
    </audio>

    <audio id="domainting">
        <source src="https://downsc.chinaz.net/Files/DownLoad/sound1/201809/10595.mp3" type="audio/mpeg">
    </audio>

    <audio id="win">
        <source src="https://downsc.chinaz.net/files/download/sound1/201406/4507.mp3" type="audio/mpeg">
    </audio>

    <audio id="reward-bgm" loop>
        <source src="./../static/audio/background2.mp3" type="audio/mpeg">
    </audio>

    <audio id="shoot_ball">
        <source src="https://ppt-mp3cdn.hrxz.com/d/file/filemp3/hrxz.com-o20p0xghg2f48281.mp3" type="audio/mpeg">
    </audio>

    <audio id="lose">
        <source src="https://ppt-mp3cdn.hrxz.com/d/file/filemp3/hrxz.com-22hqfrdcolg22515.mp3" type="audio/mpeg">
    </audio>

    <audio id="select-hero" loop>
        <source src="https://downsc.chinaz.net/files/download/sound1/201406/4539.mp3" type="audio/mpeg">
    </audio>

    <div class="game-rule">
        鼠标右键移动<br>
        Q：1技能<br>
        F：2技能<br>
        按F11启用全屏
    </div>

    <div class="game-menu-field">
        <div class="game-menu-field-item game-menu-field-item-startgame">
            开始游戏
        </div>
        <br>
        <div class="game-menu-field-item game-menu-field-item-shop">
            商城
        </div>
        <br>
        <div class="game-menu-field-item game-menu-field-item-setting">
            设置
        </div>
        <br>
        <div class="game-menu-field-item game-menu-field-item-reward">
            打赏
        </div>
    </div>
</div>
`);
        this.$menu.hide();

        this.chat_field = new ChatField(this);
        this.gcs = new ChatSocket(this);
        let outer = this;
        this.gcs.ws.onopen = function () {
            outer.gcs.send_init(outer.root.$login.username);
        }

        this.root.$game.append(this.$menu);
        this.$startgame = this.$menu.find('.game-menu-field-item-startgame');
        this.$reward = this.$menu.find('.game-menu-field-item-reward');
        this.$shop = this.$menu.find('.game-menu-field-item-shop');
        this.$setting = this.$menu.find('.game-menu-field-item-setting');

        this.bgSound1 = document.getElementById("bgMusic");
        this.bgSound2 = document.getElementById("reward-bgm");
        this.bgSound3 = document.getElementById("shoot_ball");
        this.bgSound_lose = document.getElementById("lose");
        this.bgSound_hero = document.getElementById("select-hero");
        this.bgSound_unstop = document.getElementById("unstop");
        this.bgSound_lendy = document.getElementById("legnerdy");
        this.bgSound_godlike = document.getElementById("godlike");
        this.bgSound_domainting = document.getElementById("domainting");
        this.bgSound_win = document.getElementById("win");


        this.start();
    }
    start() {
        this.add_listening_events();
    }
    add_listening_events() {
        let outer = this;
        this.$startgame.click(function () {
            outer.bgSound1.play();
            outer.hide();
            outer.root.playground.show();
        });

        this.$shop.click(function () {
            outer.hide();
            outer.root.$shop.show();
        });

        this.$reward.click(function () {
            outer.hide();
            outer.root.$reward.show();

            outer.bgSound1.pause();
            outer.bgSound2.play();
        });

        this.$setting.click(function () {
            outer.hide();
            outer.bgSound_hero.play();
            outer.root.$setting.show();
        });
    }

    show() {
        this.$menu.show(500);
    }

    hide() {
        this.$menu.hide(500);
    }
}
