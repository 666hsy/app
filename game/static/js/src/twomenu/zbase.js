class TwoGameMenu {
    constructor(root) {
        this.root = root;
        this.$twomenu = $(`
<div class="game-twomenu">
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

    <div class="game-twomenu-field">
        <div class="game-menu-field-item game-menu-field-item-startgame">
            单人模式
        </div>
        <br>
        <div class="game-menu-field-item game-menu-field-item-shop">
            多人模式
        </div>
        <br>
        <div class="game-menu-field-item game-menu-field-item-setting">
            返回
        </div>
    </div>
</div>
`);
        this.$twomenu.hide();


        this.root.$game.append(this.$twomenu);
        this.$single = this.$twomenu.find('.game-menu-field-item-startgame');
        this.$multi = this.$twomenu.find('.game-menu-field-item-shop');
        this.$back = this.$twomenu.find('.game-menu-field-item-setting');

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
        this.$single.click(function () {
            outer.bgSound1.play();
            outer.hide();
            outer.root.playground.show("single mode");
        });

        this.$multi.click(function () {
            outer.bgSound1.play();
            outer.hide();
            outer.root.playground.show("multi mode");
        });

        this.$back.click(function () {
            outer.hide();
            outer.root.$menu.show();
        });
    }

    show() {
        this.$twomenu.show(500);
    }

    hide() {
        this.$twomenu.hide(500);
    }
}
