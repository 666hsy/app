class ShopBoard {
    constructor(root) {
        this.root = root;
        this.$shop_board = $(
            `<div class='game-setting-username'>
                我的金币:${this.root.root.$login.money}
            </div>
            `);
        this.root.$shop.append(this.$shop_board);
    }
    start() {

    }
    update() {

    }
    hide() {
        this.$shop_board.hide();
    }

}