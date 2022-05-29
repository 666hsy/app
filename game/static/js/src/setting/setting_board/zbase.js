class SettingBoard {
    constructor(root) {
        this.root = root;
        this.$setting_board = $(
            `<div class='game-setting-username'>
                玩家:${this.root.root.$login.username}
            </div>
            <div class='game-setting-score'>
                天梯分:${this.root.root.$login.score}
            </div>
            <div class='game-setting-logout'>
                退出登录
            </div>
            `);
        this.root.$setting.append(this.$setting_board);
    }
    start() {

    }
    update() {

    }

    hide() {
        this.$setting_board.hide();
    }
}