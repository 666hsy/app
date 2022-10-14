class GameRank {
    constructor(root) {
        this.root = root;
        this.$rank = $(`
<div class="game-rank">
    <div class="game-rank-table">
        <div class="game-rank-table-list">
            <table class="table table-bordered table-hover game-rank-table-score">
                <thead class="game-rank-table-score-thead">
                    <tr>
                        <th>排名</th>
                        <th>昵称</th>
                        <th>天梯分</th>
                    </tr>
                <thead>
                <tbody class="game-rank-table-score-tbody">
                </tbody>
            </table>

        </div>
    </div>
    <div class='game-turn-back'>
        返回
    </div>
</div>
`);
        this.hide();

        this.root.$game.append(this.$rank);
        this.score_player = null;
        this.score_player_time = null;
        this.$score_table_content = this.$rank.find('.game-rank-table-score-tbody');

        this.$turn_back = this.$rank.find('.game-turn-back');


        this.start();
    }

    start() {
        this.add_listening_events();
    }

    add_listening_events() {
        let outer = this;

        this.$turn_back.click(function () {
            outer.hide();
            outer.root.$menu.show();
        });
    }


    getinfo_rank_score() {
        if (this.score_player && this.score_player_time && new Date().getTime() - this.score_player_time.getTime() <= 5 * 60 * 1000) return;
        this.$score_table_content.empty();
        $.ajax({
            url: "https://www.yuanaiv.top/rank/ranklist/",
            type: "GET",
            headers: {
                "Authorization": "Bearer " + this.root.access,
            },
            success: resp => {
                if (resp.result === "success") {
                    this.score_player = resp.players;
                    this.score_player_time = new Date();
                    for (let i = 0; i < this.score_player.length; i++) {
                        let player = this.score_player[i];
                        let obj = "<tr><td>" + player.rank + "</td><td>" + player.name + "</td><td>" + player.score + "</td></tr>";
                        this.$score_table_content.append(obj);
                    }
                }
            }
        });
    }


    show() {
        this.getinfo_rank_score();
        this.$rank.show(500);
    }
    hide() {
        this.$rank.hide(500);
    }

}
