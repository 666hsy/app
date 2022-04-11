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
