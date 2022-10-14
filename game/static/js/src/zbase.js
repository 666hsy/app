export class Game {
    constructor(id, access, refresh) {
        this.id = id;
        this.$game = $('#' + id);
        this.access = access;
        this.refresh = refresh;
        this.$reward = new GameReward(this);
        this.playground = new GamePlayground(this);
        this.$menu = new GameMenu(this);
        this.$rank = new GameRank(this);
        this.$twomenu = new TwoGameMenu(this);
        this.$login = new GameLogin(this);
        this.$shop = new GameShop(this);
        this.$setting = new GameSetting(this);
        this.start();
    }
    start() {

    }
}
