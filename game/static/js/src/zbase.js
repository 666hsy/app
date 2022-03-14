export class Game{
    constructor(id) {
        this.id = id;
        this.$game = $('#' + id);
        this.$reward=new GameReward(this);
        this.playground = new GamePlayground(this);
        this.$menu = new GameMenu(this);
        this.$login = new GameLogin(this);
        this.$setting = new GameSetting(this);
        this.start();
    }
    start()
    {

    }
}
