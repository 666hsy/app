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
