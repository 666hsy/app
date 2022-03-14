class PowerShot extends GameObject {
    constructor(playground, player, x, y, vx, vy, damage) {
        super();
        this.playground = playground;
        this.player = player;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.radius = 5;
        this.arrow_length = 30;
        this.speed = 300;
        this.move_length = 1500;
        this.total_move_length = 2; // 总移动距离：2
        this.remain_time = this.total_move_length / this.speed * 0.7; // 用来计算箭矢尾迹长度
        this.total_remain_time = this.total_move_length / this.speed * 0.7; // 用来计算箭矢尾迹长度
        this.eps = 0.01;
        this.st = [];
        this.grd_colors = ["rgb(218, 255, 103)", "rgb(193, 245, 94)", "rgb(163, 216, 93)", "rgb(124, 174, 80)"];

    }

    start() {
        for (let i = 0; i < this.playground.players.length; i ++ ) 
           this.st.push(0);
    }

    update() {
        if (this.move_length < this.eps) {
            console.log("destroy");
            this.destroy();
            return false;
        }
        this.update_move();

        this.update_attack();
        
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
            if (this.player !== player && this.is_collision(player)&&this.st[i]===0) {
                console.log("attacked");
                this.st[i]=1;
                this.attack(player);
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
        player.is_attacked("powershot",angle, this.damage);
    }

    render() {
        let ctx_x = this.x;
        let ctx_y = this.y;
        //console.log(ctx_x,ctx_y);
        if (this.move_length > this.eps) 
            this.render_arrow(ctx_x, ctx_y);
        //this.render_effect(ctx_x, ctx_y);
    }

    render_arrow(ctx_x, ctx_y)
    {
        this.ctx.save();

        this.ctx.translate(ctx_x, ctx_y);
        this.ctx.rotate(this.angle);

        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(this.arrow_length * 0.5, 0);
        this.ctx.lineTo(this.arrow_length * 0.4, -this.arrow_length * 0.1);
        this.ctx.moveTo(this.arrow_length * 0.5, 0);
        this.ctx.lineTo(this.arrow_length * 0.4, this.arrow_length * 0.1);

        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(-this.arrow_length * 0.5, 0);
        this.ctx.lineTo(-this.arrow_length * 0.55, -this.arrow_length * 0.05);
        this.ctx.lineTo(-this.arrow_length * 0.55, this.arrow_length * 0.05);
        this.ctx.lineTo(-this.arrow_length * 0.5, 0);
        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = this.arrow_length * 0.2;
        this.ctx.stroke();

        this.ctx.restore();
    }

    render_effect(ctx_x, ctx_y) {
        this.ctx.save();

        this.ctx.translate(ctx_x, ctx_y);
        this.ctx.rotate(this.angle);

        this.ctx.shadowColor = "rgb(175, 210, 151)";
        this.ctx.shadowBlur = 10;

        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(-Math.min(this.total_move_length - this.move_length, this.speed * this.remain_time), 0);

        let x = (this.total_remain_time - this.remain_time) * this.speed;
        let grd = this.ctx.createLinearGradient(x, 0, -this.speed * this.remain_time, 0);
        grd.addColorStop(0, "rgba(245, 255, 224, 0.9)");
        grd.addColorStop(0.25, "rgba(215, 255, 127, 0.6)");
        grd.addColorStop(0.75, "rgba(215, 255, 127, 0.4)");
        grd.addColorStop(0.95, "rgba(136, 188, 194, 0.1)");
        grd.addColorStop(1, "rgba(255, 255, 255, 0)");

        this.ctx.strokeStyle = grd;
        this.ctx.lineWidth = this.arrow_length * 0.15;
        this.ctx.stroke();
        this.ctx.restore();
    }

}
