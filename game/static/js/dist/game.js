class GameLogin {
    constructor(root) {
        this.root = root;
        this.username = "";
        this.score = 0;
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
        <br>
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

        this.$login_login.hide();

        this.$register = this.$login.find(".game-login-register");
        this.$register_username = this.$register.find(".game-login-username input");
        this.$register_password = this.$register.find(".game-login-password-first input");
        this.$register_password_confirm = this.$register.find(".game-login-password-second input");
        this.$register_submit = this.$register.find(".game-login-submit button");
        this.$register_error_message = this.$register.find(".game-login-error-message");
        this.$register_login = this.$register.find(".game-login-option");

        this.start();
        this.root.$game.append(this.$login);
        this.$register.hide();
    }

    start() {
            this.getinfo();
            this.add_listening_events();
    }

    getinfo()
    {
        let outer = this;
        $.ajax({
            url: "http://39.106.22.254:8000/setting/getinfo/",
            type: "GET",
            async:false,
            success: function(resp) {
                if (resp.result === "success") {
                    outer.username = resp.username;
                    outer.score=resp.score;
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
        this.$login_register.click(function() {
            outer.register();
        });
        this.$login_submit.click(function() {
            outer.login_on_remote();
        });
    }

    login_on_remote() {  // 在远程服务器上登录
        let outer = this;
        let username = this.$login_username.val();
        let password = this.$login_password.val();
        this.$login_error_message.empty();

        $.ajax({
            url: "http://39.106.22.254:8000/setting/login/",
            type: "GET",
            data: {
                username: username,
                password: password,
            },
            success: function(resp) {
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
            url: "http://39.106.22.254:8000/setting/logout/",
            type: "GET",
            success: function(resp) {
                if (resp.result === "success") {
                    location.reload();
                }
            }
        });
    }


    add_listening_events_register() {
        let outer = this;
        this.$register_login.click(function() {
            outer.login();
        });
        this.$register_submit.click(function() {
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
            url: "http://39.106.22.254:8000/setting/register/",
            type: "GET",
            data: {
                username: username,
                password: password,
                password_confirm: password_confirm,
            },
            success: function(resp) {
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
        this.$login.hide();
    }

    show() {
        this.$login.show();
    }
}
class ChatSocket {
    constructor(menu) {
        this.menu = menu;
        this.ws = new WebSocket("ws://39.106.22.254:8000/ws/socket/");
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
            console.log(data);
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
                let text = outer.$input.val();
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

    add_message(username, time, text) {
        let message = `[${username}][${time}]<br>${text}`;
        console.log(message);
        let color = 'white';
        if (username === this.menu.root.$login.username) {
            color = 'AliceBlue';
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
            outer.bgSound_hero.play();
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
        // this.generate_wall();
    }

    resize() {
        this.ctx.canvas.width = this.playground.width;
        this.ctx.canvas.height = this.playground.height;
        this.ctx.fillStyle = "rgba(0, 0, 0, 1)";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    generate_wall() {
        let wall_pic = "https://s3.bmp.ovh/imgs/2021/11/837412e46f4f61a6.jpg";
        this.walls = [];
        for (let i = 0; i < this.ny; i ++ ) {
            for (let j = 0; j < this.nx; j ++ ) {
                if (Math.random() < 20 / (this.nx * this.ny)) {
                    this.walls.push(new Wall(this.ctx, j, i, this.l, wall_pic));
                }
            }
        }
    }


    generate_grid() {
        this.grids = [];
        for (let i = 0; i < this.ny; i ++ ) {
            for (let j = 0; j < this.nx; j ++ ) {
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
        for (let i = 0; i < this.grids.length; i ++ ) {
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

        this.shield=false;
        this.shield_pass_time = 0;
        this.cold_pass_time = 0;

        if(this.is_me)
        {
            this.img = new Image();
            this.skill_1_codetime=1;
            this.img.src = this.playground.root.$setting.hero;

            this.fireball_img = new Image();
            this.fireball_img.src = "https://cdn.acwing.com/media/article/image/2021/12/02/1_9340c86053-fireball.png";


            this.skill_2_codetime = 3;  // 单位：秒
            //默认英雄
            if(this.img.src==="https://img0.baidu.com/it/u=1484750640,2260383730&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500")
            {
                this.hero=0;
                this.skill_2_img = new Image();
                this.skill_2_img.src = "https://cdn.acwing.com/media/article/image/2021/12/02/1_daccabdc53-blink.png";
            }

            //英雄1
            if(this.img.src==="http://39.106.22.254:8000/static/image/setting/1.jpg")
            {
                this.hero=1;
                this.skill_2_img = new Image();
                this.skill_2_img.src = "https://img1.baidu.com/it/u=2948371691,2478431799&fm=253&fmt=auto&app=138&f=JPEG?w=400&h=397";
            }
            //英雄2
            if(this.img.src==="http://39.106.22.254:8000/static/image/setting/2.jpg")
            {
                this.hero=2;
                this.skill_2_img = new Image();
                this.skill_2_img.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFGuC8c9p03raAbhftNwlIiygWHBWkmmS4Iw&usqp=CAU";
            }
            //英雄3
            if(this.img.src==="http://39.106.22.254:8000/static/image/setting/3.jpg")
            {
                this.hero=3;
                this.skill_2_img = new Image();
                this.skill_2_img.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRES0417NmPHd2BrpTLF12E91uASVYCivk-0Q&usqp=CAU";
            }
            //英雄4
            if(this.img.src==="http://39.106.22.254:8000/static/image/setting/4.jpg")
            {
                this.hero=4;
                this.skill_2_img = new Image();
                this.skill_2_img.src = "http://39.106.22.254:8000/static/image/setting/hero.jpg";
            }
            //英雄5
            if(this.img.src==="http://39.106.22.254:8000/static/image/setting/5.jpg")
            {
                this.hero=5;
                this.skill_2_img = new Image();
                this.skill_2_img.src = "https://git.acwing.com/TomG/resources/-/raw/master/images/Powershot_icon.png";
            }
        }
    }

    start() {
        
        if (this.is_me)
            this.add_listening_events();
        else
        {
            let tx=Math.random() * this.playground.virtual_map_width;
            let ty=Math.random() * this.playground.virtual_map_height;
            this.move_to(tx,ty);
        }
    }

    add_listening_events() {
        let outer = this;
        this.playground.game_map.$canvas.on("contextmenu", function() {
            return false;
        });

        this.playground.game_map.$canvas.mousedown(function(e) {

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


        this.playground.game_map.$canvas.keydown(function(e){
            if (e.which === 81) {
                if(outer.skill_1_codetime<=outer.eps)
                {
                    outer.cur_skill="fireball";
                    outer.come_skill(outer.mouseX,outer.mouseY,"fireball");
                    outer.playground.root.$menu.bgSound3.play();
                    outer.skill_1_codetime=2;
                }
            }

            // if (e.which === 32 || e.which === 49) { // 按1键或空格聚焦玩家
            //     outer.playground.focus_player = outer;
            //     outer.playground.re_calculate_cx_cy(outer.x, outer.y);
            //     return false;
            // }


            else if (e.which === 70) {
                if(outer.skill_2_codetime<=outer.eps)
                {
                    if(outer.hero===0)
                        outer.cur_skill="blink";
                    else if(outer.hero===1)
                        outer.cur_skill="cure";
                    else if(outer.hero===2)
                        outer.cur_skill="protect";
                    else if(outer.hero===3)
                        outer.cur_skill="iceball";
                    else if (outer.hero===4)
                        outer.cur_skill="manyfire";
                    else if(outer.hero===5)
                        outer.cur_skill="powershot";
                    outer.come_skill(outer.mouseX,outer.mouseY,outer.cur_skill);
                }
            }
        });
    }

    come_skill(tx,ty,skill)     //放技能函数
    {
        if(skill==="fireball")
        {
            let x = this.x, y = this.y;
            let radius = 0.01;
            let angle = Math.atan2(ty - this.y, tx - this.x);
            let vx = Math.cos(angle), vy = Math.sin(angle);
            let color = "plum";
            if(this.is_me)
                color="red";
            let speed = this.speed*3;
            let move_length = 0.8;
            new FireBall(this.playground, this, x, y, radius, vx, vy, color, speed, move_length, 0.01);
        }

        else if(skill === "blink")
        {
            let d = this.get_dist(this.x, this.y, tx, ty);
            d = Math.min(d, 0.2);
            let angle = Math.atan2(ty - this.y, tx - this.x);
            this.x += d * Math.cos(angle);
            this.y += d * Math.sin(angle);
            this.skill_2_codetime = 3;
            this.move_length = 0;  // 闪现完停下来
        }

        else if(skill==="cure")
        {
            if(this.radius<0.05&&this.is_me)
            {   
                this.speed/=1.2;
                this.radius+=0.01;
                this.skill_2_codetime = 3;
            }
        }

        else if(skill==="protect")
            this.shield=true;
        
        else if(skill==="iceball")
        {
            let x = this.x, y = this.y;
            let radius = 0.01;
            let angle = Math.atan2(ty - this.y, tx - this.x);
            let vx = Math.cos(angle), vy = Math.sin(angle);
            let color = "plum";
            if(this.is_me)
                color="MediumSlateBlue";
            let speed = this.speed*3;
            let move_length = 0.8;
            new IceBall(this.playground, this, x, y, radius, vx, vy, color, speed, move_length, 0.01);
            this.skill_2_codetime = 3;
        }

        else if(skill==="manyfire")
        {
            let x = this.x, y = this.y;
            let radius = 0.01;
            let color = "red";
            let speed = this.speed*3;
            let move_length = 0.8;
            let angle = Math.atan2(ty - this.y, tx - this.x);
            for(let i=0;i<3;i++)
            {
                let angle2=(angle+(i-1)*Math.PI/7);
                let vx = Math.cos(angle2), vy = Math.sin(angle2);
                new FireBall(this.playground, this, x, y, radius, vx, vy, color, speed, move_length, 0.01);
            }
            this.skill_2_codetime=3;
        }

        else if(skill==="powershot")
        {
            let x = this.x, y = this.y;
            let radius = 0.01;
            let angle = Math.atan2(ty - this.y, tx - this.x);
            let vx = Math.cos(angle), vy = Math.sin(angle);
            let color = "SpringGreen";
            let speed = this.speed*6;
            let move_length = 1.6;
            new PowerShot(this.playground, this, x, y, radius, vx, vy, color, speed, move_length, 0.01);
            this.skill_2_codetime=3;
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
        if(this.is_me)
            this.update_coldtime();

        if(!this.is_me&&this.spent_time>4&&Math.random()<1/300.0){  //机器放技能
            let player=this.playground.players[0];
            let tx=player.x+player.speed*this.vx*this.timedelta/1000*0.3;
            let ty=player.y+player.speed*this.vy*this.timedelta/1000*0.3;
            this.come_skill(tx,ty,"fireball");
        }


        if(this.damage_speed > this.eps)
        {
            this.vx=this.vy=0;
            this.move_length=0;
            this.x+=this.damage_x*this.damage_speed*this.timedelta/1000;
            this.y+=this.damage_y*this.damage_speed*this.timedelta/1000;
            this.damage_speed*=this.friction;
        }

        else
        {
            if (this.move_length < this.eps) {
                this.move_length = 0;
                this.vx = this.vy = 0;
                if(!this.is_me)
                {
                    let tx=Math.random() * this.playground.virtual_map_width;
                    let ty=Math.random() * this.playground.virtual_map_height;
                    this.move_to(tx,ty);
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

    update_coldtime()
    {
        this.skill_1_codetime -= this.timedelta / 1000;
        this.skill_1_codetime = Math.max(this.skill_1_codetime, 0);

        this.skill_2_codetime -= this.timedelta / 1000;
        this.skill_2_codetime = Math.max(this.skill_2_codetime, 0);
    }


    render() {
        let scale = this.playground.scale;
        let ctx_x = this.x - this.playground.cx, ctx_y = this.y - this.playground.cy;

        if(this.speed===0)
        {
            if(this.cold_pass_time <= 2)
                this.cold_pass_time += this.timedelta / 1000;
            else this.speed=this.temp;
        }
        if(this.is_me)
        {
            if (this.shield && this.shield_pass_time <= 2) 
            {
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
            this.skill_2_codetime=3;
            this.shield_pass_time = 0;
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

        else
        {
            this.ctx.beginPath();
            this.ctx.arc(ctx_x * scale, ctx_y * scale, this.radius * scale, 0, Math.PI * 2, false);
            this.ctx.fillStyle = this.color;
            this.ctx.fill();
        
        }
    }

    render_skill_coldtime() {

        let scale = this.playground.scale;
        let x = this.playground.width/scale-0.2, y = 0.9, r = 0.04;
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(x* scale, y* scale, r* scale, 0, Math.PI * 2, false);
        this.ctx.stroke();
        this.ctx.clip();
        this.ctx.drawImage(this.fireball_img, (x - r)* scale, (y - r)* scale, r * 2* scale, r * 2* scale);
        this.ctx.restore();

        if (this.skill_1_codetime > 0) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * scale, y* scale);
            this.ctx.arc(x * scale, y* scale, r * scale, 0 - Math.PI / 2, Math.PI * 2 * (1 - this.skill_1_codetime/2) - Math.PI / 2, true);
            this.ctx.lineTo(x * scale, y * scale);
            this.ctx.fillStyle = "rgba(0, 0, 255, 0.6)";
            this.ctx.fill();
        }

        x = this.playground.width/scale-0.1, y = 0.9, r = 0.04;
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(x * scale, y * scale, r * scale, 0, Math.PI * 2, false);
        this.ctx.stroke();
        this.ctx.clip();
        this.ctx.drawImage(this.skill_2_img, (x - r)* scale, (y - r)* scale, r * 2* scale, r * 2* scale);
        this.ctx.restore();

        if (this.skill_2_codetime > 0) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * scale, y * scale);
            this.ctx.arc(x * scale, y * scale, r * scale, 0 - Math.PI / 2, Math.PI * 2 * (1 - this.skill_2_codetime/3) - Math.PI / 2, true);
            this.ctx.lineTo(x* scale, y* scale);
            this.ctx.fillStyle = "rgba(0, 0, 255, 0.6)";
            this.ctx.fill();
        }
    }


    is_attacked(skill,angle,damage)
    {
        if(this.shield) return;

        if(skill==="fireball")
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
            this.speed*=1.2;
    
    
            if(this.radius<this.eps)
            {
                if(this.is_me===true)
                {
                    this.playground.score_board.lose();
                    this.playground.root.$menu.bgSound_lose.play();
                    this.playground.live_count=10;
                }
                else
                {
                    this.playground.live_count--;
                    if(this.playground.live_count===4)
                        this.playground.root.$menu.bgSound_unstop.play();
                    if(this.playground.live_count===3)
                        this.playground.root.$menu.bgSound_domainting.play();
                    if(this.playground.live_count===2)
                        this.playground.root.$menu.bgSound_godlike.play();
                    if(this.playground.live_count===1)
                        this.playground.root.$menu.bgSound_lendy.play();
                }
                if(this.playground.live_count === 0)
                {
                    this.playground.root.$menu.bgSound_win.play();
                    this.playground.score_board.win();
                    this.playground.live_count=10;
                }
                this.destroy();
                return false;
            }
            this.damage_x=Math.cos(angle);
            this.damage_y=Math.sin(angle);
            this.damage_speed=damage*80;
            // this.speed*=0.8;
        }
        else if(skill==="iceball")
        {
            this.radius-=damage;
    
            if(this.radius<this.eps)
            {
                if(!this.is_me)
                    this.playground.live_count--;
                if(this.playground.live_count === 0)
                {
                    this.playground.score_board.win();
                    this.playground.live_count=8;
                }
                this.destroy();
                return false;
            }
            this.temp =this.speed;
            this.speed=0;
        }

    }

    on_destroy()
    {   
        for(let i=0;i<this.playground.players.length;i++){
            if(this.playground.players[i]===this)
            {
                this.playground.players.splice(i,1);
            }
        }
    }
}
class ScoreBoard extends GameObject {
    constructor(playground) {
        super();
        this.playground = playground;
        this.flag=false;
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

        $canvas.on('click', function() {
            outer.playground.hide();
            outer.playground.root.$menu.bgSound1.pause();
            outer.playground.root.$menu.show();
        });
    }

    win() {
        this.state = "win";

        let outer = this;
        outer.playground.root.$menu.gcs.add_score(outer.playground.root.$menu.root.$login.username);
        console.log("win");

        setTimeout(function() {
            outer.add_listening_events();
        }, 1000);
    }

    lose() {
        this.state = "lose";

        let outer = this;
        outer.playground.root.$menu.gcs.reduce_score(outer.playground.root.$menu.root.$login.username);
        setTimeout(function() {
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

        for(let i=0;i<this.playground.players.length;i++)
        {
            let player=this.playground.players[i];
            if(this.player!==player&&this.is_collision(player))
            {
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
class GamePlayground {
    constructor(root) {
        this.root = root;
        this.live_count=10;
        this.$playground = $(`<div class="game-playground"></div>`);
        
        this.root.$game.append(this.$playground);

        this.bgSound1 = document.getElementById("shoot_ball");
        this.hide();
        this.focus_player=null;
        this.start();
    }

    get_random_color(){
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



    start() 
    {
        let outer = this;
        let uuid = this.create_uuid();
        $(window).on(`resize.${uuid}`, function () {
            outer.resize();
        });
    }

    resize() {

        // this.width = this.$playground.width();
        // this.height = this.$playground.height();
        // this.unit = Math.min(this.width / 16, this.height / 9);
        // this.width = this.unit * 16;
        // this.height = this.unit * 9;

        this.scale = this.height;
        

        if (this.game_map) this.game_map.resize();
    }

    re_calculate_cx_cy(x, y) {
        this.cx = x - 0.5 * this.width / this.scale;
        this.cy = y - 0.5 * this.height/ this.scale;

        let l = this.game_map.l;
        if (this.focus_player) {
            this.cx = Math.max(this.cx, -2 * l);
            this.cx = Math.min(this.cx, this.virtual_map_width - (this.width / this.scale - 2 * l));
            this.cy = Math.max(this.cy, -l);
            this.cy = Math.min(this.cy, this.virtual_map_height - (this.height / this.scale - l));
        }
    }



    show()
    {
        this.$playground.show();
        
        this.width=this.$playground.width();
        this.height=this.$playground.height();

        this.virtual_map_width = 3;
        this.virtual_map_height = this.virtual_map_width; 
        
        this.game_map=new GameMap(this);
        this.resize();
        this.players=[];
        this.players.push(new Player(this, this.width / 2 / this.scale, 1.5,0.05,"white",0.15,true));
        for(let i=0;i<10;i++)
            this.players.push(new Player(this,this.width / 2 / this.scale, 1.5,0.05,this.get_random_color(),0.15,false));
        
        // this.game_map.generate_grid();
        
        this.score_board=new ScoreBoard(this);
        this.notice_board=new NoticeBoard(this);
        
        // this.re_calculate_cx_cy(this.players[0].x, this.players[0].y);
        this.focus_player = this.players[0];

        
    }
    hide()
    {
        while (this.players && this.players.length > 0) 
            this.players[0].destroy();

        if (this.game_map) {
            this.game_map.destroy();
            this.game_map = null;
        }

        if (this.score_board) {
            this.score_board.destroy();
            this.score_board = null;
        }

        this.$playground.empty();

        this.$playground.hide();
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
export class Game{
    constructor(id) {
        this.id = id;
        this.$game = $('#' + id);
        this.$reward=new GameReward(this);
        this.playground = new GamePlayground(this);
        this.$menu = new GameMenu(this);
        this.$login = new GameLogin(this);
        this.$setting = new GameSetting(this);
        this.start();
    }
    start()
    {

    }
}
