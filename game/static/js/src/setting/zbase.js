class GameSetting {
    constructor(root) {
        this.root = root;
        this.hero="https://img0.baidu.com/it/u=1484750640,2260383730&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500";
        this.score=this.root.$login.score;
        this.$setting = $(`
<div class="game-setting">
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
            <img class ="img-5" src="../../static/image/setting/5.jpg" />
        </div>
        <div class='game-setting-origin'>
            恢复默认
        </div>
    </div>
    <div class='game-setting-username'>
        玩家:${this.root.$login.username}
    </div>
    <div class='game-setting-score'>
        天梯分:${this.score}
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
        this.$img_1 =  this.$setting.find('.img-1');
        this.$img_2 =  this.$setting.find('.img-2');
        this.$img_3 =  this.$setting.find('.img-3');
        this.$img_4 =  this.$setting.find('.img-4');
        this.$img_5 =  this.$setting.find('.img-5');


        this.start();
    }

    start() {
        this.add_listening_events();
    }

    add_listening_events() {
        let outer = this;
        this.$game_logout.click(function() {
            outer.hide();
            outer.root.$login.logout_on_remote();
        });
        this.$turn_back.click(function() {
            outer.hide();
            outer.root.$menu.bgSound_hero.pause();
            outer.root.$menu.show();
        });
        this.$img_1.click(function(){
            outer.hero="../../static/image/setting/1.jpg";
            alert("已选择：hero1");
        });
        this.$img_2.click(function(){
            outer.hero="../../static/image/setting/2.jpg";
            alert("已选择：hero2");
        });
        this.$img_3.click(function(){
            outer.hero="../../static/image/setting/3.jpg";
            alert("已选择：hero3");
        });
        this.$img_4.click(function(){
            outer.hero="../../static/image/setting/4.jpg";
            alert("已选择：hero4");
        });
        this.$img_5.click(function(){
            outer.hero="../../static/image/setting/5.jpg";
            alert("已选择：hero5");
        });
        this.$game_origin.click(function(){
            outer.hero="https://img0.baidu.com/it/u=1484750640,2260383730&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500";
            alert("已选择：默认英雄");
        });
    }

    show() {
        let outer = this;
        $.ajax({
            url: "http://39.106.22.254:8000/setting/getinfo/",
            type: "GET",
            async:false,
            success: function(resp) {
                if (resp.result === "success") {
                    outer.score=resp.score;
                }
            }
        });
        this.$setting.show();
    }
    hide() {
        this.$setting.hide();
    }

}
