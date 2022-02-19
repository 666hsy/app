export class Game{
    constructor(id) {
        this.id = id;
        this.$game = $('#' + id);
        this.$menu = new GameMenu(this);
        this.$reward=new GameReward(this);
        this.playground = new GamePlayground(this);
        this.$setting = new GameSetting(this);
        this.start();
    }
    start()
    {

    }
}
