class Player extends GameObject {
    constructor(playground, x, y, radius, color, speed, charst, hero) {
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
        this.charst = charst;
        this.hero = hero;
        this.eps = 0.01;
        this.friction = 0.9;
        this.spent_time = 0;

        this.cur_skill = null;
        this.fireballs = [];
        this.iceballs = [];

        this.shield = false;
        this.shield_pass_time = 0;
        this.cold_pass_time = 0;
        this.tool = this.playground.root.$login.tool;
        this.tool = String(this.tool);
        if (this.tool.indexOf("a") != -1)
            this.speed += 0.03
        if (this.charst !== "rebort") {
            this.img = new Image();
            this.skill_1_codetime = 1;

            this.fireball_img = new Image();
            this.fireball_img.src = "https://cdn.acwing.com/media/article/image/2021/12/02/1_9340c86053-fireball.png";

            this.skill_2_codetime = 3;  // 单位：秒
            //默认英雄
            if (this.hero === 0) {
                this.img.src = "https://img0.baidu.com/it/u=1484750640,2260383730&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500";
                this.skill_2_img = new Image();
                this.skill_2_img.src = "https://cdn.acwing.com/media/article/image/2021/12/02/1_daccabdc53-blink.png";
            }

            //英雄1
            if (this.hero === 1) {
                this.img.src = "https://www.yuanaiv.top/static/image/setting/1.jpg";
                this.skill_2_img = new Image();
                this.skill_2_img.src = "https://img1.baidu.com/it/u=2948371691,2478431799&fm=253&fmt=auto&app=138&f=JPEG?w=400&h=397";
            }
            //英雄2
            if (this.hero === 2) {
                this.img.src = "https://www.yuanaiv.top/static/image/setting/2.jpg";
                this.skill_2_img = new Image();
                this.skill_2_img.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFGuC8c9p03raAbhftNwlIiygWHBWkmmS4Iw&usqp=CAU";
            }
            //英雄3
            if (this.hero === 3) {
                this.img.src = "https://www.yuanaiv.top/static/image/setting/3.jpg";
                this.skill_2_img = new Image();
                this.skill_2_img.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRES0417NmPHd2BrpTLF12E91uASVYCivk-0Q&usqp=CAU";
            }
            //英雄4
            if (this.hero === 4) {
                this.img.src = "https://www.yuanaiv.top/static/image/setting/4.jpg";
                this.skill_2_img = new Image();
                this.skill_2_img.src = "https://www.yuanaiv.top/static/image/setting/hero.jpg";
            }
            //英雄5
            if (this.hero === 5) {
                this.img.src = "https://icons.iconarchive.com/icons/fazie69/league-of-legends/256/Ezreal-Pulsefire-without-LoL-logo-icon.png";
                this.skill_2_img = new Image();
                this.skill_2_img.src = "https://game.gtimg.cn/images/lol/act/img/spell/Ezreal_RisingSpellForce.png";
            }
            //英雄6
            if (this.hero === 6) {
                this.img.src = "https://img.anfensi.com/upload/2019-3/201932790313858.png";
                this.skill_2_img = new Image();
                this.skill_2_img.src = "https://game.gtimg.cn/images/lol/act/img/spell/TeemoRCast.png";
            }
            //英雄7
            if (this.hero === 7) {
                this.img.src = "https://gameplus-platform.cdn.bcebos.com/gameplus-platform/upload/file/source/QQ%E6%88%AA%E5%9B%BE20211024095740_1635041048562.png";
                this.skill_2_img = new Image();
                this.skill_2_img.src = "https://game.gtimg.cn/images/lol/act/img/spell/AurelionSolW.png";
            }
        }
    }

    start() {

        this.playground.player_count ++ ;
        this.playground.notice_board.write("正在匹配：" + this.playground.player_count + "/3");

        if (this.playground.player_count >= 3) {
            this.playground.state = "fighting";
            this.playground.notice_board.write("Fighting");
        }

        if (this.charst === "me")
            this.add_listening_events();
        if (this.charst === "rebort") {
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
            if (outer.playground.state !== "fighting")
                return true;
            console.log("outer.playground.state");
            const rect = outer.ctx.canvas.getBoundingClientRect();
            let tx = (e.clientX - rect.left) / outer.playground.scale + outer.playground.cx;
            let ty = (e.clientY - rect.top) / outer.playground.scale + outer.playground.cy;

            if (e.which === 3)  //鼠标右键
            {
                if (tx < 0 || tx > outer.playground.virtual_map_width || ty < 0 || ty > outer.playground.virtual_map_height) return;
                new ClickParticle(outer.playground, tx, ty, "rgba(255,255,255,0.5)");
                outer.move_to(tx, ty);

                if (outer.playground.mode === "multi mode") {
                    outer.playground.mps.send_move_to(tx, ty);
                }

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

    destroy_ball(uuid) {
        for (let i = 0; i < this.fireballs.length; i++) {
            let ball = this.fireballs[i];
            if (ball.uuid === uuid) {
                ball.destroy();
                break;
            }
        }
    }


    come_skill(tx, ty, skill)     //放技能函数
    {
        if (skill === "fireball") {
            let x = this.x, y = this.y;
            let radius = 0.01;
            let angle = Math.atan2(ty - this.y, tx - this.x);
            let vx = Math.cos(angle), vy = Math.sin(angle);
            let color = "plum";
            if (this.charst === "me")
                color = "red";
            let speed = this.speed * 3;
            let move_length = 0.8;
            let fireball = new FireBall(this.playground, this, x, y, radius, vx, vy, color, speed, move_length, 0.01);
            this.fireballs.push(fireball);
            if (this.playground.mode === "multi mode" && this.charst === "me") {
                this.playground.mps.send_shoot_fireball(tx, ty, fireball.uuid);
            }
            return fireball;
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
            if (this.radius < 0.05 && this.charst != "enemy") {
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
            let iceball = IceBall(this.playground, this, x, y, radius, vx, vy, color, speed, move_length, 0.01);
            this.iceballs.push_back(iceball);
            this.skill_2_codetime = 3;
            if (this.playground.mode === "multi mode" && this.charst === "me") {
                this.playground.mps.send_iceball(tx, ty, iceball.uuid);
            }
            return iceball;
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

        if (this.charst === "me" && this.playground.focus_player === this) {
            this.playground.re_calculate_cx_cy(this.x, this.y);
        }


        this.spent_time += this.timedelta / 1000;
        if (this.charst === "me")
            this.update_coldtime();

        if (this.charst === "rebort" && this.spent_time > 4 && Math.random() < 1 / 300.0 && this.speed != 0) {  //机器放技能
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
                if (this.charst === "rebort") {
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
        if (this.charst !== "rebort") {
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
            if (this.charst === "me")
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


    receive_attack(skill, angle, damage, ball_uuid, attacker) {
        attacker.destroy_fireball(ball_uuid);
        this.is_attacked(skill, angle, damage);
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
                if (this.charst === "me") {
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
