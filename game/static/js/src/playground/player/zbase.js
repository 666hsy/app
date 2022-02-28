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
        }
    }

    start() {
        
        if (this.is_me)
        {
            console.log(this.img.src);
            this.add_listening_events();
        }
            
        else
        {
            let tx=Math.random()*this.playground.width;
            let ty=Math.random()*this.playground.height;
            this.move_to(tx,ty);
        }
    }

    add_listening_events() {
        let outer = this;
        this.playground.game_map.$canvas.on("contextmenu", function() {
            return false;
        });

        this.playground.game_map.$canvas.mousedown(function(e) {
            if (e.which === 3)
            {
                new ClickParticle(outer.playground, e.clientX, e.clientY, "rgba(255,255,255,0.5)");
                outer.move_to(e.clientX, e.clientY);
            }
        });

        this.playground.game_map.$canvas.on("mousemove", function (e) {  //获取鼠标位置
            outer.mouseX = e.clientX;
            outer.mouseY = e.clientY;
        });


        this.playground.game_map.$canvas.keydown(function(e){
            if (e.which === 81) {
                if(outer.skill_1_codetime<=outer.eps)
                {
                    outer.cur_skill="fireball";
                    outer.come_skill(outer.mouseX,outer.mouseY,"fireball");
                    outer.skill_1_codetime=1;
                }
            }

            else if (e.which === 68) {
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
            let radius = 7;
            let angle = Math.atan2(ty - this.y, tx - this.x);
            let vx = Math.cos(angle), vy = Math.sin(angle);
            let color = "plum";
            if(this.is_me)
                color="red";
            let speed = this.playground.height*0.5;
            let move_length = 600;
            new FireBall(this.playground, this, x, y, radius, vx, vy, color, speed, move_length, 10);
        }

        else if(skill === "blink")
        {
            let d = this.get_dist(this.x, this.y, tx, ty);
            d = Math.min(d, 120);
            let angle = Math.atan2(ty - this.y, tx - this.x);
            this.x += d * Math.cos(angle);
            this.y += d * Math.sin(angle);
            this.skill_2_codetime = 3;
            this.move_length = 0;  // 闪现完停下来
        }

        else if(skill==="cure")
        {
            if(this.radius<this.playground.height*0.05&&this.is_me)
            {   
                console.log(this.radius,this.playground.height*0.05);
                this.speed/=1.5;
                this.radius+=10;
                this.skill_2_codetime = 3;
            }
        }

        else if(skill==="protect")
        {
            this.shield=true;
        }
        
        else if(skill==="iceball")
        {
            let x = this.x, y = this.y;
            let radius = 7;
            let angle = Math.atan2(ty - this.y, tx - this.x);
            let vx = Math.cos(angle), vy = Math.sin(angle);
            let color = "plum";
            if(this.is_me)
                color="MediumSlateBlue";
            let speed = this.playground.height*0.5;
            let move_length = 600;
            new IceBall(this.playground, this, x, y, radius, vx, vy, color, speed, move_length, 10);
            this.skill_2_codetime = 3;
        }

        else if(skill==="manyfire")
        {
            let x = this.x, y = this.y;
            let radius = 7;
            let color = "red";
            let speed = this.playground.height*0.5;
            let move_length = 600;
            for(let i=0;i<10;i++)
            {
                let angle = Math.PI*i/5;
                let vx = Math.cos(angle), vy = Math.sin(angle);
                new FireBall(this.playground, this, x, y, radius, vx, vy, color, speed, move_length, 10);
            }
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

        this.update_win();
        this.spent_time += this.timedelta / 1000;
        if(this.is_me)
            this.update_coldtime();

        if(!this.is_me&&this.spent_time>4&&Math.random()<1/300.0){  //机器放技能
            let player=this.playground.players[0];
            let tx=player.x+player.speed*this.vx*this.timedelta/1000*0.3;
            let ty=player.y+player.speed*this.vy*this.timedelta/1000*0.3;
            this.come_skill(tx,ty,"fireball");
        }


        if(this.damage_speed>10)
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
                    let tx=Math.random()*this.playground.width;
                    let ty=Math.random()*this.playground.height;
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

    update_win() {
        if (this.is_me === true && this.playground.players.length === 1) {
            this.playground.score_board.win();
        }
    }


    render() {

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
                this.ctx.beginPath();
                this.ctx.arc(this.x, this.y, this.radius * 3.9, 0, Math.PI * 2);
                this.ctx.arc(this.x, this.y, this.radius * 4.0, 0, Math.PI * 2, true);
                this.ctx.fillStyle = 'silver';
                this.ctx.fill();
            }
        else if (this.shield) {
            this.shield = false;
            this.skill_2_codetime=3;
            this.shield_pass_time = 0;
        }


            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            this.ctx.stroke();
            this.ctx.clip();
            this.ctx.drawImage(this.img, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2); 
            this.ctx.restore();
            this.render_skill_coldtime();
        }

        else
        {
            this.ctx.beginPath();
            this.ctx.arc(this.x , this.y, this.radius, 0, Math.PI * 2, false);
            this.ctx.fillStyle = this.color;
            this.ctx.fill();            
        }
    }

    render_skill_coldtime() {
        let x = this.playground.width-150, y = this.playground.height-50, r = this.playground.height*0.04;
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, 0, Math.PI * 2, false);
        this.ctx.stroke();
        this.ctx.clip();
        this.ctx.drawImage(this.fireball_img, (x - r), (y - r), r * 2, r * 2);
        this.ctx.restore();

        if (this.skill_1_codetime > 0) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            this.ctx.arc(x, y, r, 0 - Math.PI / 2, Math.PI * 2 * (1 - this.skill_1_codetime) - Math.PI / 2, true);
            this.ctx.lineTo(x, y);
            this.ctx.fillStyle = "rgba(0, 0, 255, 0.6)";
            this.ctx.fill();
        }

        x = this.playground.width-70, y = this.playground.height-50, r = this.playground.height*0.04;
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, 0, Math.PI * 2, false);
        this.ctx.stroke();
        this.ctx.clip();
        this.ctx.drawImage(this.skill_2_img, (x - r), (y - r), r * 2, r * 2);
        this.ctx.restore();

        if (this.skill_2_codetime > 0) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            this.ctx.arc(x, y, r, 0 - Math.PI / 2, Math.PI * 2 * (1 - this.skill_2_codetime/3) - Math.PI / 2, true);
            this.ctx.lineTo(x, y);
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
            this.speed*=2;
    
    
            if(this.radius<10)
            {
                this.destroy();
                return false;
            }
            this.damage_x=Math.cos(angle);
            this.damage_y=Math.sin(angle);
            this.damage_speed=damage*80;
            this.speed*=0.8;
        }
        else if(skill==="iceball")
        {
            this.radius-=damage;
    
            if(this.radius<10)
            {
                this.destroy();
                return false;
            }
            this.temp =this.speed;
            this.speed=0;
        }

    }

    on_destroy()
    {
        if(this.is_me===true)
            this.playground.score_board.lose();
        for(let i=0;i<this.playground.players.length;i++){
            if(this.playground.players[i]===this)
            {
                this.playground.players.splice(i,1);
            }
        }
    }
}
