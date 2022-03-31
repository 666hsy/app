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
