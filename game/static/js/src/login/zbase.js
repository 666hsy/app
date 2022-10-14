class GameLogin {
    constructor(root) {
        this.root = root;
        this.username = "";
        this.score = 0;
        this.money = 0;
        this.tool = null;
        this.$login = $(`
<div class="game-login">
    <div class="game-login-login">
        <div class="game-login-title">
            登录
        </div>
        <div class="game-login-username">
            <div class="game-login-item">
                <input type="text" placeholder="用户名">
            </div>
        </div>
        <div class="game-login-password">
            <div class="game-login-item">
                <input type="password" placeholder="密码">
            </div>
        </div>

        <div class="game-login-code">
             <div class="game-login-item2">
                <input type="text" placeholder="验证码">
            </div>
            <div class="game-login-item2">
                <canvas id="canvas" width="100" height="35"></canvas>
            </div>
        </div>

        <div class="game-login-submit">
            <div class="game-login-item">
                <button>登录</button>
            </div>
        </div>
        <div class="game-login-error-message">
        </div>
        <div class="game-login-option">
            注册
        </div>
        <image width="30" src="https://yeahye.com/media/image/qq_logo.jpg">
        <div class="game-login-qq">
            QQ一键登录
        </div>
    </div>

    <div class="game-login-register">
        <div class="game-login-title">
            注册
        </div>
        <div class="game-login-username">
            <div class="game-login-item">
                <input type="text" placeholder="用户名">
            </div>
        </div>
        <div class="game-login-password game-login-password-first">
            <div class="game-login-item">
                <input type="password" placeholder="密码">
            </div>
        </div>
        <div class="game-login-password game-login-password-second">
            <div class="game-login-item">
                <input type="password" placeholder="确认密码">
            </div>
        </div>
        <div class="game-login-submit">
            <div class="game-login-item">
                <button>注册</button>
            </div>
        </div>
        <div class="game-login-error-message">
        </div>
        <div class="game-login-option">
            登录
        </div>
        <br>
    </div>
</div>
`);
        this.$login_login = this.$login.find(".game-login-login");
        this.$login_username = this.$login.find(".game-login-username input");
        this.$login_password = this.$login.find(".game-login-password input");
        this.$login_submit = this.$login_login.find(".game-login-submit button");
        this.$login_error_message = this.$login.find(".game-login-error-message");
        this.$login_register = this.$login.find(".game-login-option");

        this.$login_code = this.$login.find(".game-login-code input");
        this.$login_canvas = this.$login.find(".game-login-code canvas");

        this.$login_login.hide();

        this.$register = this.$login.find(".game-login-register");
        this.$register_username = this.$register.find(".game-login-username input");
        this.$register_password = this.$register.find(".game-login-password-first input");
        this.$register_password_confirm = this.$register.find(".game-login-password-second input");
        this.$register_submit = this.$register.find(".game-login-submit button");
        this.$register_error_message = this.$register.find(".game-login-error-message");
        this.$register_login = this.$register.find(".game-login-option");

        this.$qq_login = this.$login.find('.game-login-login img');

        this.start();
        this.root.$game.append(this.$login);
        this.$register.hide();
    }


    draw(show_num) {
        var canvas_width = 100;
        var canvas_height = 35;
        var ctx = this.$login_canvas[0].getContext('2d');//获取到canvas画图的环境，演员表演的舞台
        ctx.canvas.width = canvas_width;
        ctx.canvas.height = canvas_height;
        var sCode = "a,b,c,d,e,f,g,h,i,j,k,m,n,p,q,r,s,t,u,v,w,x,y,z,A,B,C,E,F,G,H,J,K,L,M,N,P,Q,R,S,T,W,X,Y,Z,1,2,3,4,5,6,7,8,9,0";
        var aCode = sCode.split(",");
        var aLength = aCode.length;//获取到数组的长度

        for (var i = 0; i < 4; i++) {  //这里的for循环可以控制验证码位数（如果想显示6位数，4改成6即可）
            var j = Math.floor(Math.random() * aLength);//获取到随机的索引值
            // var deg = Math.random() * 30 * Math.PI / 180;//产生0~30之间的随机弧度
            var deg = Math.random() - 0.5; //产生一个随机弧度
            var txt = aCode[j];//得到随机的一个内容
            show_num[i] = txt.toLowerCase();
            var x = 10 + i * 20;//文字在canvas上的x坐标
            var y = 20 + Math.random() * 8;//文字在canvas上的y坐标
            ctx.font = "bold 23px 微软雅黑";
            ctx.translate(x, y);
            ctx.rotate(deg);
            ctx.fillStyle = this.randomColor();
            ctx.fillText(txt, 0, 0);
            ctx.rotate(-deg);
            ctx.translate(-x, -y);
        }
        for (var i = 0; i <= 5; i++) { //验证码上显示线条
            ctx.strokeStyle = this.randomColor();
            ctx.beginPath();
            ctx.moveTo(Math.random() * canvas_width, Math.random() * canvas_height);
            ctx.lineTo(Math.random() * canvas_width, Math.random() * canvas_height);
            ctx.stroke();
        }
        for (var i = 0; i <= 30; i++) { //验证码上显示小点
            ctx.strokeStyle = this.randomColor();
            ctx.beginPath();
            var x = Math.random() * canvas_width;
            var y = Math.random() * canvas_height;
            ctx.moveTo(x, y);
            ctx.lineTo(x + 1, y + 1);
            ctx.stroke();
        }
    }

    //得到随机的颜色值
    randomColor() {
        var r = Math.floor(Math.random() * 256);
        var g = Math.floor(Math.random() * 256);
        var b = Math.floor(Math.random() * 256);
        return "rgb(" + r + "," + g + "," + b + ")";
    }


    start() {
        this.show_num = [];
        this.draw(this.show_num);
        if (this.root.access) {
            this.refresh_jwt_token();
            this.getinfo();
        }
        else {
            if (localStorage.getItem('access')) {
                this.refresh_jwt_token();
                this.root.accesss = localStorage.getItem("access");
                this.root.refresh = localStorage.getItem("refresh");
                this.getinfo();
            }
            else
                this.login();
        }
        this.add_listening_events();
    }

    getinfo() {
        let outer = this;
        $.ajax({
            url: "https://www.yuanaiv.top/setting/getinfo/",
            type: "GET",
            async: false,
            headers: {
                'Authorization': "Bearer " + this.root.access,
            },
            success: function (resp) {
                if (resp.result === "success") {
                    outer.username = resp.username;
                    outer.score = resp.score;
                    outer.money = resp.money;
                    outer.tool = resp.tool;
                    outer.hide();
                    outer.root.$menu.show();
                } else {
                    outer.login();
                }
            }
        });
    }

    add_listening_events() {
        let outer = this;
        this.add_listening_events_login();
        this.add_listening_events_register();
    }

    add_listening_events_login() {
        let outer = this;
        this.$qq_login.click(function () {
            outer.qq_login();
        });
        this.$login_register.click(function () {
            outer.$login_error_message.empty();
            outer.register();
        });
        this.$login_submit.click(function () {
            outer.login_on_remote();
        });
        this.$login_canvas.click(function () {
            outer.show_num = [];
            outer.draw(outer.show_num);
        });
    }

    qq_login() {
        $.ajax({
            url: "https://www.yuanaiv.top/setting/qq_login/apply_code",
            type: "GET",
            success: function (resp) {
                if (resp.result === "success") {
                    window.location.replace(resp.apply_code_url);
                }
            }
        })
    }

    login_on_remote(username, password, flag) {  // 在远程服务器上登录
        username = username || this.$login_username.val();
        password = password || this.$login_password.val();
        if (!flag) {
            let code = this.$login_code.val();
            let num = this.show_num.join("");
            if (num != code) {
                this.$login_error_message.html("验证码错误！");
                this.show_num = [];
                this.draw(this.show_num);
                return false;
            }

            this.$login_error_message.empty();
        }

        $.ajax({
            url: "https://www.yuanaiv.top/setting/token/",
            type: "POST",
            data: {
                username: username,
                password: password,
            },
            success: resp => {
                this.root.access = resp.access;
                this.root.refresh = resp.refresh;
                localStorage.setItem("access", this.root.access);
                localStorage.setItem("refresh", this.root.refresh);
                this.refresh_jwt_token();
                this.getinfo();

            },
            error: () => {
                this.$login_error_message.html("用户名或密码错误");
            }

        });
    }

    refresh_jwt_token() {
        this.root.refresh = localStorage.getItem("refresh");
        $.ajax({
            url: "https://www.yuanaiv.top/setting/token/refresh/",
            type: "POST",
            data: {
                refresh: this.root.refresh,
            },
            async: false,
            success: resp => {
                localStorage.removeItem('access');
                this.root.access = resp.access;
                localStorage.setItem('access', resp.access);
            },
        });
    }


    logout_on_remote() {  // 在远程服务器上登出
        this.root.access = "";
        this.root.refresh = "";
        location.href = "/";
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
    }


    add_listening_events_register() {
        let outer = this;
        this.$register_login.click(function () {
            outer.login();
        });
        this.$register_submit.click(function () {
            outer.register_on_remote();
        });
    }

    register_on_remote() {  // 在远程服务器上注册
        let username = this.$register_username.val();
        let password = this.$register_password.val();
        let password_confirm = this.$register_password_confirm.val();
        this.$register_error_message.empty();

        $.ajax({
            url: "https://www.yuanaiv.top/setting/register/",
            type: "POST",
            data: {
                username: username,
                password: password,
                password_confirm: password_confirm,
            },
            success: resp => {
                if (resp.result === "success") {
                    this.login_on_remote(username, password, true);
                } else {
                    this.$register_error_message.html(resp.result);
                }
            }
        });
    }


    register() {  // 打开注册界面
        this.$login_login.hide();
        this.$register.show();
    }

    login() {  // 打开登录界面
        this.$register.hide();
        this.$login_login.show();
    }

    hide() {
        this.$login.hide(500);
    }

    show() {
        this.$login.show(500);
    }
}
