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
