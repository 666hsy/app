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
                <canvas id="canvas"></canvas>
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
        <div class = "game-login-qq">
            <image width="30" src="https://yeahye.com/media/image/qq_logo.jpg">
            <div>
                QQ一键登录
            </div>
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

        this.$qq_login = this.$login.find('.game-login-qq img');

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
        this.getinfo();
        this.add_listening_events();
    }

    getinfo() {
        let outer = this;
        $.ajax({
            url: "https://www.yuanaiv.top/setting/getinfo/",
            type: "GET",
            async: false,
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

    login_on_remote() {  // 在远程服务器上登录
        let outer = this;
        let username = this.$login_username.val();
        let password = this.$login_password.val();
        let code = this.$login_code.val();
        let num = outer.show_num.join("");
        if (num != code) {
            outer.$login_error_message.html("验证码错误！");
            outer.show_num = [];
            outer.draw(outer.show_num);
            return false;
        }

        this.$login_error_message.empty();

        $.ajax({
            url: "https://www.yuanaiv.top/setting/login/",
            type: "GET",
            data: {
                username: username,
                password: password,
            },
            success: function (resp) {
                if (resp.result === "success") {
                    location.reload();
                } else {
                    outer.$login_error_message.html(resp.result);
                }
            }
        });
    }

    logout_on_remote() {  // 在远程服务器上登出
        $.ajax({
            url: "https://www.yuanaiv.top/setting/logout/",
            type: "GET",
            success: function (resp) {
                if (resp.result === "success") {
                    location.reload();
                }
            }
        });
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
        let outer = this;
        let username = this.$register_username.val();
        let password = this.$register_password.val();
        let password_confirm = this.$register_password_confirm.val();
        this.$register_error_message.empty();

        $.ajax({
            url: "https://www.yuanaiv.top/setting/register/",
            type: "GET",
            data: {
                username: username,
                password: password,
                password_confirm: password_confirm,
            },
            success: function (resp) {
                if (resp.result === "success") {
                    location.reload();  // 刷新页面
                } else {
                    outer.$register_error_message.html(resp.result);
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
class ChatSocket {
    constructor(menu) {
        this.menu = menu;
        this.ws = new WebSocket("wss://www.yuanaiv.top/wss/socket/");
        this.start();
    }
    start() {
        this.receive();
    }
    receive() {
        let outer = this;
        this.ws.onerror = function (e) {
            outer.receive_message('Yeah', 'now', 'weksocket 未开启');
        };

        this.ws.onmessage = function (e) {  //收到来自服务器的消息
            let data = JSON.parse(e.data);
            let event = data['event'];
            if (event === 'message')
                outer.receive_message(data['username'], data['time'], data['text']);
        };

    }
    send_init(username) {
        this.ws.send(JSON.stringify({   //向服务器发送消息
            'event': 'init',
            'username': username,
        }))
    }

    add_score(username) {
        this.ws.send(JSON.stringify({   //向服务器发送消息
            'event': 'add',
            'username': username,
        }))
    }

    add_money(username,money) {
        this.ws.send(JSON.stringify({   //向服务器发送消息
            'event': 'add_money',
            'username': username,
            'money': money,
        }))
    }

    buy(username,name,id) {
        this.ws.send(JSON.stringify({   //向服务器发送消息
            'event': 'buy',
            'username': username,
            'name': name,
            'id':id,
        }))
    }

    reduce_score(username) {
        this.ws.send(JSON.stringify({   //向服务器发送消息
            'event': 'reduce',
            'username': username,
        }))
    }

    receive_init(details) {
        for (let i = 0; i < details.length; i++) {
            let detail = details[i];
            let username = detail['username'];
            let time = detail['time'];
            let text = detail['message'];
            this.menu.global_chat_field.add_message(username, time, text);
        }
    }
    send_message(username, time, text) {
        this.ws.send(JSON.stringify({
            'event': 'message',
            'username': username,
            'time': time,
            'message': text,
        }))
    }
    receive_message(username, time, text) {
        if(username!=this.menu.root.$login.username)
            this.menu.chat_field.add_message(username, time, text);
    }

    receive_online(online_user) {
        this.menu.global_chat_field.change_online_user(online_user);
    }
}class ChatField {
    constructor(menu) {
        this.menu = menu;
        this.$title = $(`<div class="chat-field-title">世界之窗<i class="bi bi-person-fill"><span id="online_user"></span></i></div>`)
        this.$history = $(`<div class="chat-field-history"></div>`);
        this.$input = $(`<input type="text" class="chat-field-input">`);


        this.func_id = null;
        this.menu.$menu.append(this.$title);
        this.menu.$menu.append(this.$history);
        this.menu.$menu.append(this.$input);

        this.start();
    }

    start() {
        
        this.add_listening_events();
    }

    add_listening_events() {
        let outer = this;

        this.$input.keydown(function (e) {
            if (e.which === 13) {  // ENTER
                let username = outer.menu.root.$login.username;
                let text = outer.escapeHtml(outer.$input.val());
                if (text) {
                    outer.$input.val("");
                    Date.prototype.format = function (fmt) {
                        var o = {
                            "M+": this.getMonth() + 1,                 //月份 
                            "d+": this.getDate(),                    //日 
                            "h+": this.getHours(),                   //小时 
                            "m+": this.getMinutes(),                 //分 
                            "s+": this.getSeconds(),                 //秒 
                            "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
                            "S": this.getMilliseconds()             //毫秒 
                        };
                        if (/(y+)/.test(fmt)) {
                            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
                        }
                        for (var k in o) {
                            if (new RegExp("(" + k + ")").test(fmt)) {
                                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                            }
                        }
                        return fmt;
                    }
                    let time = new Date().format("yyyy-MM-dd hh:mm:ss");
                    outer.add_message(username, time, text);
                    outer.menu.gcs.send_message(username, time, text);
                }
                return false;
            }
        });
    }

    render_message(message, color) {
        return $(`<div style="color:${color}">${message}</div>`);
    }

    escapeHtml (string) {
       var entityMap = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
            '/': '&#x2F;',
            '`': '&#x60;',
            '=': '&#x3D;'
          };
        return String(string).replace(/[&<>"'`=\/]/g, function (s) {
          return entityMap[s];
        });
      }

    add_message(username, time, text) {
        let message = `[${username}][${time}]<br>${text}`;
        let color = 'white';
        if (username === this.menu.root.$login.username) {
            color = 'LightBLue';
        }
        this.$history.append(this.render_message(message, color));
        this.$history.scrollTop(this.$history[0].scrollHeight);
    }
    change_online_user(online_user) {
        $("#online_user").html(online_user);
    }

}class GameMenu {
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
let GAME_OBJECTS = [];

class GameObject {
    constructor() {
        GAME_OBJECTS.push(this);

        this.has_called_start = false;  // 是否执行过start函数
        this.timedelta = 0;  // 当前帧距离上一帧的时间间隔
    }


    start() {  // 只会在第一帧执行一次
    }

    update() {  // 每一帧均会执行一次
    }

    on_destroy() {  // 在被销毁前执行一次
    }

    destroy() {  // 删掉该物体
        this.on_destroy();

        for (let i = 0; i < GAME_OBJECTS.length; i ++ ) {
            if (GAME_OBJECTS[i] === this) {
                GAME_OBJECTS.splice(i, 1);
                break;
            }
        }
    }
}

let last_timestamp;
let GAME_ANIMATION = function(timestamp) {  //在这个时刻调用这个函数
    for (let i = 0; i < GAME_OBJECTS.length; i ++ ) {
        let obj = GAME_OBJECTS[i];
        if (!obj.has_called_start) {
            obj.start();
            obj.has_called_start = true;
        } else {
            obj.timedelta = timestamp - last_timestamp;
            obj.update();
        }
    }

    last_timestamp = timestamp;

    requestAnimationFrame(GAME_ANIMATION);
}

requestAnimationFrame(GAME_ANIMATION); //一秒分成60次执行这个函数
class ClickParticle extends GameObject {
    constructor(playground, x, y, color) {
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.color = color;

        this.angle = Math.random() * Math.PI * 2;
        this.vx = Math.cos(this.angle);
        this.vy = Math.sin(this.angle);

        this.radius = 0.03;
    }

    start() {
    }

    update() {
        if (this.radius > 0.05) {
            this.destroy();
            return false;
        }
        this.radius *= 1.06;
        this.render();
    }

    render() {
        let scale = this.playground.scale;
        let ctx_x = this.x - this.playground.cx, ctx_y = this.y - this.playground.cy; // 把虚拟地图中的坐标换算成canvas中的坐标
        if (ctx_x < -0.1 * this.playground.width / scale ||
            ctx_x > 1.1 * this.playground.width / scale ||
            ctx_y < -0.1 * this.playground.height / scale ||
            ctx_y > 1.1 * this.playground.height / scale) {
            return;
        }
        this.ctx.beginPath();
        this.ctx.arc(ctx_x * scale, ctx_y * scale, this.radius * scale, 0, Math.PI * 2, false);
        this.ctx.strokeStyle = this.color;
        this.ctx.stroke();
    }
}
class Grid extends GameObject {
    constructor(playground, ctx, i, j, l, stroke_color) {
        super();
        this.playground = playground;
        this.ctx = ctx;
        this.i = i;
        this.j = j;
        this.l = l;
        this.x = this.i * this.l;
        this.y = this.j * this.l;

        this.stroke_color = stroke_color;
        this.fill_color = "rgb(210, 222, 238)";

    }

    start() 
    {

    }

    get_manhattan_dist(x1, y1, x2, y2) {
        return Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2));
    }


    update() {
        this.render();
    }

    render() {
        let scale = this.playground.scale;
        let ctx_x = this.x - this.playground.cx, ctx_y = this.y - this.playground.cy;
        let cx = ctx_x + this.l * 0.5, cy = ctx_y + this.l * 0.5; // grid的中心坐标
        // 处于屏幕范围外，则不渲染
        if (cx * scale < -0.2 * this.playground.width ||
            cx * scale > 1.2 * this.playground.width ||
            cy * scale < -0.2 * this.playground.height ||
            cy * scale > 1.2 * this.playground.height) {
            return;
        }

        this.render_grid(ctx_x, ctx_y, scale);
    }

    render_grid(ctx_x, ctx_y, scale) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.lineWidth = this.l * 0.01 * scale;
        this.ctx.strokeStyle = this.stroke_color;
        this.ctx.rect(ctx_x * scale, ctx_y * scale, this.l * scale, this.l * scale);
        this.ctx.stroke();
        this.ctx.restore();
    }

    on_destroy() {
    }
}
class Wall extends GameObject {
    constructor(ctx, x, y, l, img_url) {
        super();
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.l = l;
        this.ax = this.x * this.l;
        this.ay = this.y * this.l;
        this.img = new Image();
        this.img.src = img_url;
    }

    start() {
        console.log(this.x,this.y);
    }

    update() {
        this.render();
    }

    render() {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.lineWidth = this.l * 0.03;
        this.ctx.strokeStyle = "rgba(0,0,0,0)";
        this.ctx.rect(this.ax, this.ay, this.l, this.l);
        this.ctx.stroke();
        this.ctx.clip();
        this.ctx.drawImage(this.img, this.ax, this.ay, this.l, this.l);
        this.ctx.restore();
    }
}
class GameMap extends GameObject {
    constructor(playground) {
        super();
        this.playground = playground;
        this.$canvas = $(`<canvas tabindex=0 class="game-playground-map"></canvas>`);
        this.ctx = this.$canvas[0].getContext('2d');
        this.ctx.canvas.width = this.playground.width;
        this.ctx.canvas.height = this.playground.height;
        this.playground.$playground.append(this.$canvas);

        let width = this.playground.virtual_map_width;
        let height = this.playground.virtual_map_height;
        this.l = height * 0.2;
        this.nx = Math.ceil(width / this.l);
        this.ny = Math.ceil(height / this.l);

        this.start();

    }
    start() {
        this.$canvas.focus();
        this.generate_grid();
    }

    resize() {
        this.ctx.canvas.width = this.playground.width;
        this.ctx.canvas.height = this.playground.height;
        // this.ctx.fillStyle = "rgba(0, 0, 0, 1)";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    generate_wall() {
        let wall_pic = "https://s3.bmp.ovh/imgs/2021/11/837412e46f4f61a6.jpg";
        this.walls = [];
        for (let i = 0; i < this.ny; i++) {
            for (let j = 0; j < this.nx; j++) {
                if (Math.random() < 20 / (this.nx * this.ny)) {
                    this.walls.push(new Wall(this.ctx, j, i, this.l, wall_pic));
                }
            }
        }
    }


    generate_grid() {
        this.grids = [];
        for (let i = 0; i < this.ny; i++) {
            for (let j = 0; j < this.nx; j++) {
                this.grids.push(new Grid(this.playground, this.ctx, j, i, this.l, "DimGray"));
            }
        }
    }



    update() {
        this.render();
    }

    render() {
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    on_destroy() {
        for (let i = 0; i < this.grids.length; i++) {
            this.grids[i].destroy();
        }
        this.grids = [];
    }

}
class NoticeBoard extends GameObject {
    constructor(playground) {
        super();

        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.text = "欢迎来到英雄联盟";
    }

    start() {
    }

    write(text) {
        this.text = text;
    }

    update() {
        this.render();
    }

    render() {
        this.ctx.font = "20px serif";
        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "center";
        this.ctx.fillText(this.text, this.playground.width / 2, 20);
    }
}
class Particle extends GameObject
{
    constructor(playground,x,y,radius,vx,vy,color,speed,move_length)
    {
        super();
        this.playground=playground;
        this.ctx=this.playground.game_map.ctx;
        this.x=x;
        this.y=y;
        this.radius=radius;
        this.vx=vx;
        this.vy=vy;
		this.move_length=move_length;
        this.color=color;
        this.speed=speed;
        this.friction=0.9;
        this.eps=0.001;
    }
    start()
    {

    }
    update(){
        if(this.move_length<this.eps||this.speed<this.eps){
            this.destroy();
            return false;
        }
		let moved=Math.min(this.move_length,this.speed*this.timedelta/1000);
        this.x+=this.vx*moved;
        this.y+=this.vy*moved;

        

        this.speed*=this.friction;
		this.move_length-=moved;
		this.render();
	}
	render() {
		let scale = this.playground.scale;
        let ctx_x = this.x - this.playground.cx, ctx_y = this.y - this.playground.cy;

        if (ctx_x < -0.2 * this.playground.width / scale ||
            ctx_x > 1.2 * this.playground.width / scale ||
            ctx_y < -0.2 * this.playground.height / scale ||
            ctx_y > 1.2 * this.playground.height / scale) {
            return;
        }
        this.ctx.beginPath();
        this.ctx.arc(ctx_x * scale, ctx_y * scale, this.radius * scale, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();

	}

}
class Player extends GameObject {
    constructor(playground, x, y, radius, color, speed, is_me) {
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.damage_x = 0;
        this.damage_y = 0;
        this.damage_speed = 0;
        this.move_length = 0;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.is_me = is_me;
        this.eps = 0.01;
        this.friction = 0.9;
        this.spent_time = 0;

        this.cur_skill = null;

        this.shield = false;
        this.shield_pass_time = 0;
        this.cold_pass_time = 0;
        this.tool = this.playground.root.$login.tool;
        this.tool = String(this.tool);
        if (this.tool.indexOf("a") != -1)
            this.speed += 0.03
        if (this.is_me) {
            this.img = new Image();
            this.skill_1_codetime = 1;
            this.img.src = this.playground.root.$setting.hero;

            this.fireball_img = new Image();
            this.fireball_img.src = "https://cdn.acwing.com/media/article/image/2021/12/02/1_9340c86053-fireball.png";


            this.skill_2_codetime = 3;  // 单位：秒
            //默认英雄
            if (this.img.src === "https://img0.baidu.com/it/u=1484750640,2260383730&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500") {
                this.hero = 0;
                this.skill_2_img = new Image();
                this.skill_2_img.src = "https://cdn.acwing.com/media/article/image/2021/12/02/1_daccabdc53-blink.png";
            }

            //英雄1
            if (this.img.src === "https://www.yuanaiv.top/static/image/setting/1.jpg") {
                this.hero = 1;
                this.skill_2_img = new Image();
                this.skill_2_img.src = "https://img1.baidu.com/it/u=2948371691,2478431799&fm=253&fmt=auto&app=138&f=JPEG?w=400&h=397";
            }
            //英雄2
            if (this.img.src === "https://www.yuanaiv.top/static/image/setting/2.jpg") {
                this.hero = 2;
                this.skill_2_img = new Image();
                this.skill_2_img.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFGuC8c9p03raAbhftNwlIiygWHBWkmmS4Iw&usqp=CAU";
            }
            //英雄3
            if (this.img.src === "https://www.yuanaiv.top/static/image/setting/3.jpg") {
                this.hero = 3;
                this.skill_2_img = new Image();
                this.skill_2_img.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRES0417NmPHd2BrpTLF12E91uASVYCivk-0Q&usqp=CAU";
            }
            //英雄4
            if (this.img.src === "https://www.yuanaiv.top/static/image/setting/4.jpg") {
                this.hero = 4;
                this.skill_2_img = new Image();
                this.skill_2_img.src = "https://www.yuanaiv.top/static/image/setting/hero.jpg";
            }
            //英雄5
            if (this.img.src === "https://icons.iconarchive.com/icons/fazie69/league-of-legends/256/Ezreal-Pulsefire-without-LoL-logo-icon.png") {
                this.hero = 5;
                this.skill_2_img = new Image();
                this.skill_2_img.src = "https://game.gtimg.cn/images/lol/act/img/spell/Ezreal_RisingSpellForce.png";
            }
            //英雄6
            if (this.img.src === "https://img.anfensi.com/upload/2019-3/201932790313858.png") {
                this.hero = 6;
                this.skill_2_img = new Image();
                this.skill_2_img.src = "https://game.gtimg.cn/images/lol/act/img/spell/TeemoRCast.png";
            }
            //英雄7
            if (this.img.src === "https://gameplus-platform.cdn.bcebos.com/gameplus-platform/upload/file/source/QQ%E6%88%AA%E5%9B%BE20211024095740_1635041048562.png") {
                this.hero = 7;
                this.skill_2_img = new Image();
                this.skill_2_img.src = "https://game.gtimg.cn/images/lol/act/img/spell/AurelionSolW.png";
            }
        }
    }

    start() {

        if (this.is_me)
            this.add_listening_events();
        else {
            let tx = Math.random() * this.playground.virtual_map_width;
            let ty = Math.random() * this.playground.virtual_map_height;
            this.move_to(tx, ty);
        }
    }

    add_listening_events() {
        let outer = this;
        this.playground.game_map.$canvas.on("contextmenu", function () {
            return false;
        });

        this.playground.game_map.$canvas.mousedown(function (e) {

            const rect = outer.ctx.canvas.getBoundingClientRect();
            let tx = (e.clientX - rect.left) / outer.playground.scale + outer.playground.cx;
            let ty = (e.clientY - rect.top) / outer.playground.scale + outer.playground.cy;

            if (e.which === 3)  //鼠标右键
            {
                new ClickParticle(outer.playground, tx, ty, "rgba(255,255,255,0.5)");
                outer.move_to(tx, ty);
            }
        });

        this.playground.game_map.$canvas.on("mousemove", function (e) {  //获取鼠标位置

            const rect = outer.ctx.canvas.getBoundingClientRect();
            outer.mouseX = (e.clientX - rect.left) / outer.playground.scale + outer.playground.cx;
            outer.mouseY = (e.clientY - rect.top) / outer.playground.scale + outer.playground.cy;
        });


        this.playground.game_map.$canvas.keydown(function (e) {
            if (e.which === 81) {
                if (outer.skill_1_codetime <= outer.eps) {
                    outer.cur_skill = "fireball";
                    outer.come_skill(outer.mouseX, outer.mouseY, "fireball");
                    outer.playground.root.$menu.bgSound3.play();
                    outer.skill_1_codetime = 2;
                }
            }

            // if (e.which === 32 || e.which === 49) { // 按1键或空格聚焦玩家
            //     outer.playground.focus_player = outer;
            //     outer.playground.re_calculate_cx_cy(outer.x, outer.y);
            //     return false;
            // }


            else if (e.which === 70) {
                if (outer.skill_2_codetime <= outer.eps) {
                    if (outer.hero === 0)
                        outer.cur_skill = "blink";
                    else if (outer.hero === 1)
                        outer.cur_skill = "cure";
                    else if (outer.hero === 2)
                        outer.cur_skill = "protect";
                    else if (outer.hero === 3)
                        outer.cur_skill = "iceball";
                    else if (outer.hero === 4)
                        outer.cur_skill = "manyfire";
                    else if (outer.hero === 5)
                        outer.cur_skill = "powershot";
                    else if (outer.hero === 6)
                        outer.cur_skill = "mogu";
                    else if (outer.hero === 7)
                        outer.cur_skill = "planet";
                    outer.come_skill(outer.mouseX, outer.mouseY, outer.cur_skill);
                }
            }
        });
    }

    come_skill(tx, ty, skill)     //放技能函数
    {
        if (skill === "fireball") {
            let x = this.x, y = this.y;
            let radius = 0.01;
            let angle = Math.atan2(ty - this.y, tx - this.x);
            let vx = Math.cos(angle), vy = Math.sin(angle);
            let color = "plum";
            if (this.is_me)
                color = "red";
            let speed = this.speed * 3;
            let move_length = 0.8;
            new FireBall(this.playground, this, x, y, radius, vx, vy, color, speed, move_length, 0.01);
        }

        else if (skill === "blink") {
            let d = this.get_dist(this.x, this.y, tx, ty);
            d = Math.min(d, 0.2);
            let angle = Math.atan2(ty - this.y, tx - this.x);
            this.x += d * Math.cos(angle);
            this.y += d * Math.sin(angle);
            this.skill_2_codetime = 3;
            this.move_length = 0;  // 闪现完停下来
        }

        else if (skill === "cure") {
            if (this.radius < 0.05 && this.is_me) {
                this.speed /= 1.2;
                this.radius += 0.01;
                this.skill_2_codetime = 3;
            }
        }

        else if (skill === "protect")
            this.shield = true;

        else if (skill === "iceball") {
            let x = this.x, y = this.y;
            let radius = 0.01;
            let angle = Math.atan2(ty - this.y, tx - this.x);
            let vx = Math.cos(angle), vy = Math.sin(angle);
            let color = "MediumSlateBlue";
            let speed = this.speed * 3;
            let move_length = 0.8;
            new IceBall(this.playground, this, x, y, radius, vx, vy, color, speed, move_length, 0.01);
            this.skill_2_codetime = 3;
        }

        else if (skill === "manyfire") {
            let x = this.x, y = this.y;
            let radius = 0.01;
            let color = "red";
            let speed = this.speed * 3;
            let move_length = 0.8;
            let angle = Math.atan2(ty - this.y, tx - this.x);
            for (let i = 0; i < 3; i++) {
                let angle2 = (angle + (i - 1) * Math.PI / 7);
                let vx = Math.cos(angle2), vy = Math.sin(angle2);
                new FireBall(this.playground, this, x, y, radius, vx, vy, color, speed, move_length, 0.01);
            }
            this.skill_2_codetime = 3;
        }

        else if (skill === "powershot") {
            let x = this.x, y = this.y;
            let radius = 0.01;
            let angle = Math.atan2(ty - this.y, tx - this.x);
            let vx = Math.cos(angle), vy = Math.sin(angle);
            let color = "SpringGreen";
            let speed = this.speed * 4;
            let move_length = 1.6;
            new PowerShot(this.playground, this, x, y, radius, vx, vy, color, speed, move_length, 0.01);
            this.skill_2_codetime = 3;
        }
        else if (skill === "mogu") {
            let x = this.x, y = this.y;
            let radius = 0.02;
            let angle = Math.atan2(ty - this.y, tx - this.x);
            let vx = 0, vy = 0;
            let color = "LimeGreen";
            let speed = 0;
            let move_length = 10;
            this.playground.skills.push(new FireBall(this.playground, this, x, y, radius, vx, vy, color, speed, move_length, 0.01));
            this.skill_2_codetime = 3;
        }
        else if (skill === "planet") {
            if (!this.planet_system_on) {
                let radius = 0.1;
                let T = 2;
                let start_rotius = 0.25;
                let satellite_num = 3;
                this.planet_system = new Planet(this.playground, this, this, radius, T, start_rotius, satellite_num, 0);
                this.planet_system_on = 1;
            }
            else {
                if (this.planet_system) this.planet_system.destroy();
            }
            this.skill_2_codetime = 3;
        }
    }

    get_dist(x1, y1, x2, y2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    move_to(tx, ty) {
        this.move_length = this.get_dist(this.x, this.y, tx, ty);
        let angle = Math.atan2(ty - this.y, tx - this.x);
        this.vx = Math.cos(angle);
        this.vy = Math.sin(angle);
    }

    update() {

        if (this.is_me && this.playground.focus_player === this) {
            this.playground.re_calculate_cx_cy(this.x, this.y);
        }


        this.spent_time += this.timedelta / 1000;
        if (this.is_me)
            this.update_coldtime();

        if (!this.is_me && this.spent_time > 4 && Math.random() < 1 / 300.0 && this.speed != 0) {  //机器放技能
            let player = this.playground.players[0];
            let tx = player.x + player.speed * this.vx * this.timedelta / 1000 * 0.3;
            let ty = player.y + player.speed * this.vy * this.timedelta / 1000 * 0.3;
            this.come_skill(tx, ty, "fireball");
        }


        if (this.damage_speed > this.eps) {
            this.vx = this.vy = 0;
            this.move_length = 0;
            this.x += this.damage_x * this.damage_speed * this.timedelta / 1000;
            this.y += this.damage_y * this.damage_speed * this.timedelta / 1000;
            this.damage_speed *= this.friction;
        }

        else {
            if (this.move_length < this.eps) {
                this.move_length = 0;
                this.vx = this.vy = 0;
                if (!this.is_me) {
                    let tx = Math.random() * this.playground.virtual_map_width;
                    let ty = Math.random() * this.playground.virtual_map_height;
                    this.move_to(tx, ty);
                }
            } else {
                let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
                this.x += this.vx * moved;
                this.y += this.vy * moved;
                this.move_length -= moved;
            }
        }
        this.render();
    }

    update_coldtime() {
        this.skill_1_codetime -= this.timedelta / 1000;
        this.skill_1_codetime = Math.max(this.skill_1_codetime, 0);

        this.skill_2_codetime -= this.timedelta / 1000;
        this.skill_2_codetime = Math.max(this.skill_2_codetime, 0);
    }


    render() {
        let scale = this.playground.scale;
        let ctx_x = this.x - this.playground.cx, ctx_y = this.y - this.playground.cy;

        if (this.speed === 0) {
            if (this.cold_pass_time <= 2)
                this.cold_pass_time += this.timedelta / 1000;
            else {
                this.speed = this.temp;
                this.cold_pass_time = 0
            }
        }
        if (this.is_me) {
            if (this.shield && this.shield_pass_time <= 2) {
                this.shield_pass_time += this.timedelta / 1000;

                let scale = this.playground.scale;
                let ctx_x = this.x - this.playground.cx, ctx_y = this.y - this.playground.cy; // 把虚拟地图中的坐标换算成canvas中的坐标
                if (ctx_x < -0.1 * this.playground.width / scale ||
                    ctx_x > 1.1 * this.playground.width / scale ||
                    ctx_y < -0.1 * this.playground.height / scale ||
                    ctx_y > 1.1 * this.playground.height / scale) {
                    return;
                }
                this.ctx.beginPath();
                this.ctx.arc(ctx_x * scale, ctx_y * scale, this.radius * scale * 3.9, 0, Math.PI * 2);
                this.ctx.arc(ctx_x * scale, ctx_y * scale, this.radius * scale * 4.0, 0, Math.PI * 2, true);
                this.ctx.fillStyle = 'silver';
                this.ctx.fill();
            }
            else if (this.shield) {
                this.shield = false;
                this.skill_2_codetime = 3;
                this.shield_pass_time = 0;
            }
            else if (this.planet_system_on) {
                this.planet_system_on = false;
                this.skill_2_codetime = 3;
            }
            this.ctx.save();
            this.ctx.strokeStyle = this.color;
            this.ctx.beginPath();
            this.ctx.arc(ctx_x * scale, ctx_y * scale, this.radius * scale, 0, Math.PI * 2, false);
            this.ctx.stroke();
            this.ctx.clip();
            this.ctx.drawImage(this.img, (ctx_x - this.radius) * scale, (ctx_y - this.radius) * scale, this.radius * 2 * scale, this.radius * 2 * scale);
            this.ctx.restore();
            this.render_skill_coldtime();
        }

        else {
            this.ctx.beginPath();
            this.ctx.arc(ctx_x * scale, ctx_y * scale, this.radius * scale, 0, Math.PI * 2, false);
            this.ctx.fillStyle = this.color;
            this.ctx.fill();

        }
    }

    render_skill_coldtime() {

        let scale = this.playground.scale;
        let x = this.playground.width / scale - 0.2, y = 0.9, r = 0.04;
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(x * scale, y * scale, r * scale, 0, Math.PI * 2, false);
        this.ctx.stroke();
        this.ctx.clip();
        this.ctx.drawImage(this.fireball_img, (x - r) * scale, (y - r) * scale, r * 2 * scale, r * 2 * scale);
        this.ctx.restore();

        if (this.skill_1_codetime > 0) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * scale, y * scale);
            this.ctx.arc(x * scale, y * scale, r * scale, 0 - Math.PI / 2, Math.PI * 2 * (1 - this.skill_1_codetime / 2) - Math.PI / 2, true);
            this.ctx.lineTo(x * scale, y * scale);
            this.ctx.fillStyle = "rgba(0, 0, 255, 0.6)";
            this.ctx.fill();
        }

        x = this.playground.width / scale - 0.1, y = 0.9, r = 0.04;
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(x * scale, y * scale, r * scale, 0, Math.PI * 2, false);
        this.ctx.stroke();
        this.ctx.clip();
        this.ctx.drawImage(this.skill_2_img, (x - r) * scale, (y - r) * scale, r * 2 * scale, r * 2 * scale);
        this.ctx.restore();

        if (this.skill_2_codetime > 0) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * scale, y * scale);
            this.ctx.arc(x * scale, y * scale, r * scale, 0 - Math.PI / 2, Math.PI * 2 * (1 - this.skill_2_codetime / 3) - Math.PI / 2, true);
            this.ctx.lineTo(x * scale, y * scale);
            this.ctx.fillStyle = "rgba(0, 0, 255, 0.6)";
            this.ctx.fill();
        }
    }


    is_attacked(skill, angle, damage) {
        if (this.shield) return;

        if (skill === "fireball") {
            for (let i = 0; i < 20 + Math.random() * 10; i++) {
                let x = this.x, y = this.y;
                let radius = this.radius * Math.random() * 0.1;
                let angle = Math.PI * 2 * Math.random();
                let vx = Math.cos(angle), vy = Math.sin(angle);
                let color = this.color;
                let speed = this.speed * 10;
                let move_length = this.radius * Math.random() * 3;
                new Particle(this.playground, x, y, radius, vx, vy, color, speed, move_length);
            }

            this.radius -= damage;
            this.speed *= 1.2;


            if (this.radius < this.eps) {
                if (this.is_me === true) {
                    this.playground.root.$menu.bgSound_lose.play();
                    this.playground.live_count = 10;
                    this.playground.score_board.lose();
                }
                else {
                    this.playground.live_count--;
                    if (this.playground.live_count === 4)
                        this.playground.root.$menu.bgSound_unstop.play();
                    if (this.playground.live_count === 3)
                        this.playground.root.$menu.bgSound_domainting.play();
                    if (this.playground.live_count === 2)
                        this.playground.root.$menu.bgSound_godlike.play();
                    if (this.playground.live_count === 1)
                        this.playground.root.$menu.bgSound_lendy.play();
                }
                if (this.playground.live_count === 0) {
                    this.playground.root.$menu.bgSound_win.play();
                    this.playground.live_count = 10;
                    this.playground.score_board.win();
                }
                this.destroy();
                return false;
            }
            this.damage_x = Math.cos(angle);
            this.damage_y = Math.sin(angle);
            this.damage_speed = damage * 80;
        }
        else if (skill === "iceball") {
            this.radius -= damage;

            if (this.radius < this.eps) {
                this.playground.live_count--;
                if (this.playground.live_count === 4)
                    this.playground.root.$menu.bgSound_unstop.play();
                if (this.playground.live_count === 3)
                    this.playground.root.$menu.bgSound_domainting.play();
                if (this.playground.live_count === 2)
                    this.playground.root.$menu.bgSound_godlike.play();
                if (this.playground.live_count === 1)
                    this.playground.root.$menu.bgSound_lendy.play();
                if (this.playground.live_count === 0) {
                    this.playground.root.$menu.bgSound_win.play();
                    this.playground.score_board.win();
                    this.playground.live_count = 10;
                }
                this.destroy();
                return false;
            }
            this.temp = this.speed;
            this.speed = 0;
        }

    }

    on_destroy() {
        for (let i = 0; i < this.playground.players.length; i++) {
            if (this.playground.players[i] === this) {
                this.playground.players.splice(i, 1);
            }
        }
    }
}
class ScoreBoard extends GameObject {
    constructor(playground) {
        super();
        this.playground = playground;
        this.flag = false;
        this.ctx = this.playground.game_map.ctx;

        this.state = null;  // win: 胜利，lose：失败

        this.win_img = new Image();
        this.win_img.src = "https://img0.baidu.com/it/u=4030779468,445934973&fm=253&fmt=auto&app=138&f=JPEG?w=567&h=334";

        this.lose_img = new Image();
        this.lose_img.src = "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fwx3.sinaimg.cn%2Flarge%2F006cSBLKgy1fygwp6unafj304c04y0sr.jpg&refer=http%3A%2F%2Fwx3.sinaimg.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1647950615&t=8df7970c36727e59665ee57f2fa28a74";
    }

    start() {

    }

    add_listening_events() {
        let outer = this;
        let $canvas = this.playground.game_map.$canvas;

        $canvas.on('click', function () {
            outer.playground.hide();
            outer.playground.root.$menu.bgSound1.pause();
            outer.playground.root.$menu.show();
        });
    }

    win() {
        this.state = "win";

        let outer = this;
        this.playground.root.$login.score += 10;
        this.playground.root.$login.money += 30;
        outer.playground.root.$menu.gcs.add_score(outer.playground.root.$menu.root.$login.username);
        outer.playground.root.$menu.gcs.add_money(outer.playground.root.$menu.root.$login.username, 30);

        setTimeout(function () {
            outer.add_listening_events();
        }, 1000);
    }

    lose() {
        this.state = "lose";

        let outer = this;
        this.playground.root.$login.score -= 5;
        this.playground.root.$login.money += 10;
        outer.playground.root.$menu.gcs.reduce_score(outer.playground.root.$menu.root.$login.username);
        outer.playground.root.$menu.gcs.add_money(outer.playground.root.$menu.root.$login.username, 10);
        setTimeout(function () {
            outer.add_listening_events();
        }, 1000);
    }

    update() {
        this.render();
    }

    render() {
        let len = this.playground.height / 2;
        if (this.state === "win") {
            this.ctx.drawImage(this.win_img, this.playground.width / 2 - len / 2, this.playground.height / 2 - len / 2, len, len);
        } else if (this.state === "lose") {
            this.ctx.drawImage(this.lose_img, this.playground.width / 2 - len / 2, this.playground.height / 2 - len / 2, len, len);
        }
    }
}
class FireBall extends GameObject {
    constructor(playground, player, x, y, radius, vx, vy, color, speed, move_length, damage) {
        super();
        this.playground = playground;
        this.player = player;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.move_length = move_length;
        this.damage = damage;
        this.eps = 0.01;
    }

    start() {
    }

    update() {
        if (this.move_length < this.eps) {
            this.destroy();
            return false;
        }
        this.update_move();

        for(let i=0;i<this.playground.players.length;i++)
        {
            let player=this.playground.players[i];
            if(this.player!==player&&this.is_collision(player))
            {
                this.attack(player);
            }
        }

        for(let i=0;i<this.playground.towers.length;i++)
        {
            let tower=this.playground.towers[i];
            if(this.player!==tower&&this.is_collision(tower))
            {
                this.attack(tower);
            }
        }

        this.render();
    }

    update_move() {
        let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.move_length -= moved;
    }

    update_attack() {
        for (let i = 0; i < this.playground.players.length; i ++ ) {
            let player = this.playground.players[i];
            if (this.player !== player && this.is_collision(player)) {
                this.attack(player);
                break;
            }
        }
    }

    get_dist(x1, y1, x2, y2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    is_collision(player) {
        let distance = this.get_dist(this.x, this.y, player.x, player.y);
        if (distance < this.radius + player.radius)
            return true;
        return false;
    }

    attack(player) {
        let angle = Math.atan2(player.y - this.y, player.x - this.x);
        player.is_attacked("fireball",angle, this.damage);
        this.destroy();
    }

    render() {
        let scale = this.playground.scale;
        let ctx_x = this.x - this.playground.cx, ctx_y = this.y - this.playground.cy; // 把虚拟地图中的坐标换算成canvas中的坐标
        if (ctx_x < -0.1 * this.playground.width / scale ||
            ctx_x > 1.1 * this.playground.width / scale ||
            ctx_y < -0.1 * this.playground.height / scale ||
            ctx_y > 1.1 * this.playground.height / scale) {
            return;
        }
        this.ctx.beginPath();
        this.ctx.arc(ctx_x * scale, ctx_y * scale, this.radius * scale, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();

    }
}
class IceBall extends GameObject {
    constructor(playground, player, x, y, radius, vx, vy, color, speed, move_length, damage) {
        super();
        this.playground = playground;
        this.player = player;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.move_length = move_length;
        this.damage = damage;
        this.eps = 0.01;
    }

    start() {
    }

    update() {
        if (this.move_length < this.eps) {
            this.destroy();
            return false;
        }
        this.update_move();

        for(let i=0;i<this.playground.players.length;i++)
        {
            let player=this.playground.players[i];
            if(this.player!==player&&this.is_collision(player))
            {
                this.attack(player);
            }
        }

        for(let i=0;i<this.playground.towers.length;i++)
        {
            let tower=this.playground.towers[i];
            if(this.player!==tower&&this.is_collision(tower))
            {
                this.attack(tower);
            }
        }
        this.render();
    }

    update_move() {
        let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.move_length -= moved;
    }

    update_attack() {
        for (let i = 0; i < this.playground.players.length; i ++ ) {
            let player = this.playground.players[i];
            if (this.player !== player && this.is_collision(player)) {
                this.attack(player);
                break;
            }
        }
    }

    get_dist(x1, y1, x2, y2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    is_collision(player) {
        let distance = this.get_dist(this.x, this.y, player.x, player.y);
        if (distance < this.radius + player.radius)
            return true;
        return false;
    }

    attack(player) {
        let angle = Math.atan2(player.y - this.y, player.x - this.x);
        player.is_attacked("iceball",angle, this.damage);
        this.destroy();
    }

    render() {
        let scale = this.playground.scale;
        let ctx_x = this.x - this.playground.cx, ctx_y = this.y - this.playground.cy; // 把虚拟地图中的坐标换算成canvas中的坐标
        if (ctx_x < -0.1 * this.playground.width / scale ||
            ctx_x > 1.1 * this.playground.width / scale ||
            ctx_y < -0.1 * this.playground.height / scale ||
            ctx_y > 1.1 * this.playground.height / scale) {
            return;
        }
        this.ctx.beginPath();
        this.ctx.arc(ctx_x * scale, ctx_y * scale, this.radius * scale, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }
}
class Planet extends GameObject
{
  constructor(playground, player, planet, radius, T, start_rotius, satellite_num, rotius_acc)
  {
    super();
    this.type = "defend";
    this.satellites = [];
    this.playground = playground;
    this.player = player;
    for (let i = 0; i < satellite_num; i++)
    {
        let angle = Math.PI * 2 / satellite_num * i;
        let satellite = new Satellite(playground, player, radius, T, start_rotius, angle, rotius_acc);
        satellite.hurtable = true;
        satellite.damage = 0.01;
        satellite.type = "defend";
        satellite.color = player.color;
        this.satellites.push(satellite);
    }
    
  }

  start()
  {
    
  }

  update()
  {
    // if ((this.playground.mode === "multi-mode" && this.player.type === "me" && this.planet.is_player && this.planet.MP <= 0)
    //  || (this.playground.mode === "single-mode" && this.planet.MP <= 0))
    // {
    //     this.planet.turn_planet_system();
    //     this.destroy();
    //     delete this;
    // }
      // this.planet.MP -= 2 * this.timedelta / 1000;
  }

  on_destroy()
  {
    // if (this.playground.mps && this.playground.the_player.type === "me") this.playground.mps.send_turnoff_planet_system(this.uuid);
    // for (let i = 0; i < this.satellites.length; ++ i)
    // {
    //   let obj = this.satellites[i];
    //   obj.radius_acc = -obj.abs_radius_acc;
    //   obj.rotius_acc = -obj.abs_rotius_acc;
    // }

    // this.player.planet_system = null;
    // this.player.planet_system_on = 0;
  }
}
class PowerShot extends GameObject {
    constructor(playground, player, x, y, radius, vx, vy, color, speed, move_length, damage) {
        super();
        this.playground = playground;
        this.player = player;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.move_length = move_length;
        this.damage = damage;
        this.arrow_length = 20;
        this.eps = 0.01;
    }

    start() {
    }

    update() {
        if (this.move_length < this.eps) {
            this.destroy();
            return false;
        }
        this.update_move();

        for (let i = 0; i < this.playground.players.length; i++) {
            let player = this.playground.players[i];
            if (this.player !== player && this.is_collision(player)) {
                this.attack(player);
            }
        }


        this.render();
    }

    update_move() {
        let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.move_length -= moved;
    }

    update_attack() {
        for (let i = 0; i < this.playground.players.length; i++) {
            let player = this.playground.players[i];
            if (this.player !== player && this.is_collision(player)) {
                this.attack(player);
                break;
            }
        }
    }

    get_dist(x1, y1, x2, y2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    is_collision(player) {
        let distance = this.get_dist(this.x, this.y, player.x, player.y);
        if (distance < this.radius + player.radius)
            return true;
        return false;
    }

    attack(player) {
        let angle = Math.atan2(player.y - this.y, player.x - this.x);
        player.is_attacked("fireball", angle, this.damage);
    }

    render() {
        let scale = this.playground.scale;
        let ctx_x = this.x - this.playground.cx, ctx_y = this.y - this.playground.cy; // 把虚拟地图中的坐标换算成canvas中的坐标
        if (ctx_x < -0.1 * this.playground.width / scale ||
            ctx_x > 1.1 * this.playground.width / scale ||
            ctx_y < -0.1 * this.playground.height / scale ||
            ctx_y > 1.1 * this.playground.height / scale) {
            return;
        }
        this.ctx.beginPath();
        this.ctx.arc(ctx_x * scale, ctx_y * scale, this.radius * scale, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }
}
class Satellite extends GameObject {
  constructor(playground, player, radius, T, rotius, start_angle) {
    super();
    this.playground = playground;
    this.ctx = this.playground.game_map.ctx;
    this.player = player;
    this.radius = 0.01;
    this.pass_time = 0;
    this.rotius = rotius;

    this.omega = Math.PI * 2 / T;
    this.angle = start_angle;
    this.speed = this.omega * rotius;
    this.color = "white";

    this.start();
  }

  start() {
    this.vx = 1;
    this.vy = 0;
    this.x = this.player.x + this.rotius;
    this.y = this.player.y;
  }
  get_dist(x1, y1, x2, y2) {
    let dx = x1 - x2;
    let dy = y1 - y2;
    return Math.sqrt(dx * dx + dy * dy);
  }

  is_collision(player) {
    let distance = this.get_dist(this.x, this.y, player.x, player.y);
    if (distance < this.radius + player.radius)
      return true;
    return false;
  }

  attack(player) {
    let angle = Math.atan2(player.y - this.y, player.x - this.x);
    player.is_attacked("fireball", angle, this.damage);
  }


  update() {
    this.update_move();
    this.update_rotate();

    for (let i = 0; i < this.playground.players.length; i++) {
      let player = this.playground.players[i];
      if (this.player !== player && this.is_collision(player)) {
        this.attack(player);
      }
    }

    this.render();
  }


  update_rotate() {
    let angle = this.omega * this.timedelta / 1000;
    this.angle += angle;
  }

  update_move() {
    let dx = this.rotius * Math.cos(this.angle);
    let dy = this.rotius * Math.sin(this.angle);
    this.x = this.player.x + dx;
    this.y = this.player.y + dy;
  }


  render() {
    if (this.pass_time <= 2) {
      this.pass_time += this.timedelta / 1000;
      let scale = this.playground.scale;
      this.ctx_x = this.x - this.playground.cx;
      this.ctx_y = this.y - this.playground.cy;
      this.ctx.beginPath();
      this.ctx.arc(this.ctx_x * scale, this.ctx_y * scale, this.radius * scale, 0, Math.PI * 2);
      this.ctx.fillStyle = this.color;
      this.ctx.fill();
    }
    else
      this.destroy();
  }
}
class Tower extends GameObject {
    constructor(playground, x, y, radius, color) {
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.eps = 0.02;
        this.spent_time = 0;
        this.friction = 0.9;
        this.img = new Image();
        this.img.src="data:image/jpeg;base64,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";
    }

    start() {
        
    }


    come_skill(tx,ty)     //放技能函数
    {
        let x = this.x, y = this.y;
        let radius = 0.01;
        let angle = Math.atan2(ty - this.y, tx - this.x);
        let vx = Math.cos(angle), vy = Math.sin(angle);
        let color = "Cyan";
        let speed = 0.45;
        let move_length = 0.8;
        new FireBall(this.playground, this, x, y, radius, vx, vy, color, speed, move_length, 0.01);
    }

    get_dist(x1, y1, x2, y2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }


    update() {

        this.spent_time += this.timedelta / 1000;
        let player=this.playground.players[0];
        let d=this.get_dist(this.x,this.y,player.x,player.y);
        if(d<0.7&&this.spent_time>4&&Math.random()<1/100.0){  //机器放技能
            let tx=player.x+player.speed*player.vx*this.timedelta/1000*0.3;
            let ty=player.y+player.speed*player.vy*this.timedelta/1000*0.3;
            this.come_skill(tx,ty);
        }

        this.render();
    }



    render() {
        let scale = this.playground.scale;
        let ctx_x = this.x - this.playground.cx, ctx_y = this.y - this.playground.cy;

        this.ctx.save();
        this.ctx.strokeStyle = this.color;
        this.ctx.beginPath();
        this.ctx.arc(ctx_x * scale, ctx_y * scale, this.radius * scale, 0, Math.PI * 2, false);
        this.ctx.stroke();
        this.ctx.clip();
        this.ctx.drawImage(this.img, (ctx_x - this.radius) * scale, (ctx_y - this.radius) * scale, this.radius * 2 * scale, this.radius * 2 * scale);
        this.ctx.restore();
    }

    is_attacked(skill,angle,damage)
    {
        if(skill==="fireball"||skill==="iceball")
        {
            for(let i=0;i<20+Math.random()*10;i++){
                let x=this.x,y=this.y;
                let radius=this.radius*Math.random()*0.1;
                let angle=Math.PI*2*Math.random();
                let vx=Math.cos(angle),vy=Math.sin(angle);
                let color=this.color;
                let speed=this.speed*10;
                let move_length=this.radius*Math.random()*3;
                new Particle(this.playground,x,y,radius,vx,vy,color,speed,move_length);
            }
    
            this.radius-=damage;
            if(this.radius<this.eps)
            {
                this.playground.root.$menu.gcs.add_money(this.playground.root.$menu.root.$login.username,5);
                this.destroy();
                return false;
            }
        }
    }

    on_destroy()
    {   
        for(let i=0;i<this.playground.towers.length;i++){
            if(this.playground.towers[i]===this)
            {
                this.playground.towers.splice(i,1);
            }
        }
    }
}
class GamePlayground {
    constructor(root) {
        this.root = root;
        this.live_count = 10;
        this.tower_count = 4;
        this.$playground = $(`<div class="game-playground"></div>`);

        this.root.$game.append(this.$playground);

        this.bgSound1 = document.getElementById("shoot_ball");
        this.skills = [];
        this.hide();
        this.focus_player = null;
        this.start();
    }

    get_random_color() {
        var hex = Math.floor(Math.random() * 16777216).toString(16); //生成ffffff以内16进制数
        while (hex.length < 6)  //while循环判断hex位数，少于6位前面加0凑够6位
            hex = '0' + hex;
        return '#' + hex; //返回‘#'开头16进制颜色
    }

    create_uuid() {
        let res = "";
        for (let i = 0; i < 8; i++) {
            let x = parseInt(Math.floor(Math.random() * 10));
            res += x;
        }
        return res;
    }



    start() {
        let outer = this;
        let uuid = this.create_uuid();
        $(window).on(`resize.${uuid}`, function () {
            outer.resize();
        });
    }

    resize() {

        this.scale = this.height;
        if (this.game_map) this.game_map.resize();
    }

    re_calculate_cx_cy(x, y) {
        this.cx = x - 0.5 * this.width / this.scale;
        this.cy = y - 0.5 * this.height / this.scale;

        let l = this.game_map.l;
        if (this.focus_player) {
            this.cx = Math.max(this.cx, -2 * l);
            this.cx = Math.min(this.cx, this.virtual_map_width - (this.width / this.scale - 2 * l));
            this.cy = Math.max(this.cy, -l);
            this.cy = Math.min(this.cy, this.virtual_map_height - (this.height / this.scale - l));
        }
    }


    show() {
        this.$playground.show(500);

        this.width = this.$playground.width();
        this.height = this.$playground.height();

        this.virtual_map_width = 3;
        this.virtual_map_height = this.virtual_map_width;

        this.game_map = new GameMap(this);
        this.resize();
        this.players = [];
        this.towers = [];
        this.players.push(new Player(this, this.width / 2 / this.scale, 1.5, 0.05, "white", 0.15, true));
        for (let i = 0; i < 10; i++)
            this.players.push(new Player(this, this.width / 2 / this.scale, 1.5, 0.05, this.get_random_color(), 0.15, false));

        this.towers.push(new Tower(this, 0.5, 0.5, 0.1, "white"));
        this.towers.push(new Tower(this, 1.5, 1.5, 0.1, "white"));
        this.towers.push(new Tower(this, 2.5, 2, 0.1, "white"));
        this.towers.push(new Tower(this, 0.7, 2.5, 0.1, "white"));

        this.score_board = new ScoreBoard(this);
        this.notice_board = new NoticeBoard(this);

        // this.re_calculate_cx_cy(this.players[0].x, this.players[0].y);
        this.focus_player = this.players[0];


    }
    hide() {
        while (this.players && this.players.length > 0)
            this.players[0].destroy();

        while (this.towers && this.towers.length > 0)
            this.towers[0].destroy();

        while (this.skills && this.skills.length > 0)
            this.skills[0].destroy();

        if (this.game_map) {
            this.game_map.destroy();
            this.game_map = null;
        }

        if (this.score_board) {
            this.score_board.destroy();
            this.score_board = null;
        }

        this.$playground.empty();

        this.$playground.hide(500);
    }

}
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

        this.start();
    }
    start() {
        this.add_listening_events();
    }

    add_listening_events() {
        let outer = this;
        this.$turn_back.click(function () {
            outer.root.$menu.bgSound2.pause();
            outer.hide();
            outer.root.$menu.show();
        });
    }

    show() {
        this.$reward.show(500);
    }

    hide() {
        this.$reward.hide(500);
    }
}
class SettingBoard {
    constructor(root) {
        this.root = root;
        this.$setting_board = $(
            `<div class='game-setting-username'>
                玩家:${this.root.root.$login.username}
            </div>
            <div class='game-setting-score'>
                天梯分:${this.root.root.$login.score}
            </div>
            <div class='game-setting-logout'>
                退出登录
            </div>
            `);
        this.root.$setting.append(this.$setting_board);
    }
    start() {

    }
    update() {

    }

    hide() {
        this.$setting_board.hide();
    }
}class GameSetting {
    constructor(root) {
        this.root = root;
        this.hero = "https://img0.baidu.com/it/u=1484750640,2260383730&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500";
        this.score = this.root.$login.score;
        this.money = this.root.$login.money;
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
            outer.hero = "../../static/image/setting/1.jpg";
            alert("已选择：hero1");
        });
        this.$img_2.click(function () {
            outer.hero = "../../static/image/setting/2.jpg";
            alert("已选择：hero2");
        });
        this.$img_3.click(function () {
            outer.hero = "../../static/image/setting/3.jpg";
            alert("已选择：hero3");
        });
        this.$img_4.click(function () {
            outer.hero = "../../static/image/setting/4.jpg";
            alert("已选择：hero4");
        });
        this.$img_5.click(function () {
            outer.hero = "https://icons.iconarchive.com/icons/fazie69/league-of-legends/256/Ezreal-Pulsefire-without-LoL-logo-icon.png";
            outer.bgSound_hero5.play();
        });
        this.$img_6.click(function () {
            outer.hero = "https://img.anfensi.com/upload/2019-3/201932790313858.png";
            outer.bgSound_hero6.play();
        });
        this.$img_7.click(function () {
            outer.hero = "https://gameplus-platform.cdn.bcebos.com/gameplus-platform/upload/file/source/QQ%E6%88%AA%E5%9B%BE20211024095740_1635041048562.png";
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
class ShopBoard {
    constructor(root) {
        this.root = root;
        this.$shop_board = $(
            `<div class='game-setting-username'>
                我的金币:${this.root.root.$login.money}
            </div>
            `);
        this.root.$shop.append(this.$shop_board);
    }
    start() {

    }
    update() {

    }
    hide() {
        this.$shop_board.hide();
    }

}class GameShop {
    constructor(root) {
        this.root = root;
        this.tool = this.root.$login.tool;
        this.tool = String(this.tool);
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
    <div class='game-turn-back'>
        返回
    </div>
</div>
`);
        this.hide();

        this.root.$game.append(this.$shop);

        this.$turn_back = this.$shop.find('.game-turn-back');
        this.$img_shoose = this.$shop.find('.shoose');

        this.start();
    }

    start() {
        this.add_listening_events();
    }

    add_listening_events() {
        let outer = this;
        this.$turn_back.click(function () {
            outer.hide();
            outer.root.$menu.bgSound_hero.pause();
            outer.root.$menu.show();
        });
        this.$img_shoose.click(function () {
            if (outer.tool.indexOf("a") === -1 && outer.root.$login.money >= 300) {
                outer.root.$login.money -= 300;
                outer.root.$menu.gcs.buy(outer.root.$login.username, "shoose", "a");
                alert("已购买：速度之靴");
            }
            else if (outer.tool.indexOf("a") != -1)
                alert("已拥有");
            else {
                console.log(outer.money);
                alert("金币不足");
            }
        });
    }

    show() {
        this.$shop.show(500);
        this.shop_board = new ShopBoard(this);
    }
    hide() {
        if (this.shop_board)
            this.shop_board.hide();
        this.$shop.hide(500);
    }

}
export class Game{
    constructor(id) {
        this.id = id;
        this.$game = $('#' + id);
        this.$reward=new GameReward(this);
        this.playground = new GamePlayground(this);
        this.$menu = new GameMenu(this);
        this.$login = new GameLogin(this);
        this.$shop = new GameShop(this);
        this.$setting = new GameSetting(this);
        this.start();
    }
    start()
    {

    }
}
