class GameShop {
    constructor(root) {
        this.root = root;
        this.money=this.root.$login.money;
        this.tool=this.root.$login.tool;
        this.tool=String(this.tool);
        this.$shop = $(`
<div class="game-shop">
    <div class="game-reward-title">
        欢迎来到英雄之家
    </div>
    <div class="game-shop-field">
        <div class="game-shop-field-item">
            <img class ="shoose" src="data:image/jpeg;base64,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" />
        </div>
    </div>
    <div class='game-setting-username'>
        我的金币:${this.money}
    </div>
    <div class='game-turn-back'>
        返回
    </div>
</div>
`);
        this.hide();
        
        this.root.$game.append(this.$shop);

        this.$turn_back = this.$shop.find('.game-turn-back');
        this.$img_shoose =  this.$shop.find('.shoose');

        this.start();
    }

    start() {
        this.add_listening_events();
    }

    add_listening_events() {
        let outer = this;
        this.$turn_back.click(function() {
            outer.hide();
            outer.root.$menu.bgSound_hero.pause();
            outer.root.$menu.show();
        });
        this.$img_shoose.click(function(){
            if(outer.tool.indexOf("a")===-1&&outer.money>=300)
            {
                outer.root.$menu.gcs.buy(outer.root.$login.username,"shoose","a");
                alert("已购买：速度之靴");
            }
            else if(outer.tool.indexOf("a")!=-1)
                alert("已拥有");
            else
                alert("金币不足");
        });
    }

    show() {
        let outer = this;
        $.ajax({
            url: "https://yuanaiv.top/setting/getinfo/",
            type: "GET",
            async:false,
            success: function(resp) {
                if (resp.result === "success") {
                    outer.score=resp.score;
                }
            }
        });
        this.$shop.show();
    }
    hide() {
        this.$shop.hide();
    }

}
