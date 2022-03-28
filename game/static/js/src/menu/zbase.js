class GameMenu {
    constructor(root) {
        this.root = root;
        this.$menu = $(`
<div class="game-menu">
    <audio id="bgMusic" loop>
        <source src="./../static/audio/menu/background1.mp3" type="audio/mpeg">
    </audio>

    <audio id="reward-bgm" loop>
        <source src="./../static/audio/background2.mp3" type="audio/mpeg">
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
        this.$menu.hide();

        this.chat_field=new ChatField(this);
        this.gcs = new ChatSocket(this);
        let outer = this;
        this.gcs.ws.onopen = function () {
            outer.gcs.send_init(outer.root.$login.username);
        }
        
        this.root.$game.append(this.$menu);
        this.$startgame=this.$menu.find('.game-menu-field-item-startgame');
        this.$reward=this.$menu.find('.game-menu-field-item-reward');
        this.$setting=this.$menu.find('.game-menu-field-item-setting');

        this.bgSound1 = document.getElementById("bgMusic");
        this.bgSound2 = document.getElementById("reward-bgm");
        
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
           outer.bgSound1.play();
            outer.hide();
            outer.root.playground.show();
        });
        this.$reward.click(function(){
            outer.hide();
            outer.root.$reward.show();

            outer.bgSound1.pause();
           outer.bgSound2.play();
        });

        this.$setting.click(function(){
            outer.hide();
            outer.root.$setting.show();
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
