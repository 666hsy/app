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
