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
