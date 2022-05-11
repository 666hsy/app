class ChatSocket {
    constructor(menu) {
        this.menu = menu;
        this.ws = new WebSocket("wss://www.yuanaiv.top/wss/socket/");
        this.start();
    }
    start() {
        this.receive();
    }
    receive() {
        let outer = this;
        this.ws.onerror = function (e) {
            outer.receive_message('Yeah', 'now', 'weksocket 未开启');
        };

        this.ws.onmessage = function (e) {  //收到来自服务器的消息
            let data = JSON.parse(e.data);
            let event = data['event'];
            if (event === 'message')
                outer.receive_message(data['username'], data['time'], data['text']);
        };

    }
    send_init(username) {
        this.ws.send(JSON.stringify({   //向服务器发送消息
            'event': 'init',
            'username': username,
        }))
    }

    add_score(username) {
        this.ws.send(JSON.stringify({   //向服务器发送消息
            'event': 'add',
            'username': username,
        }))
    }

    add_money(username,money) {
        this.ws.send(JSON.stringify({   //向服务器发送消息
            'event': 'add_money',
            'username': username,
            'money': money,
        }))
    }

    buy(username,name,id) {
        this.ws.send(JSON.stringify({   //向服务器发送消息
            'event': 'buy',
            'username': username,
            'name': name,
            'id':id,
        }))
    }

    reduce_score(username) {
        this.ws.send(JSON.stringify({   //向服务器发送消息
            'event': 'reduce',
            'username': username,
        }))
    }

    receive_init(details) {
        for (let i = 0; i < details.length; i++) {
            let detail = details[i];
            let username = detail['username'];
            let time = detail['time'];
            let text = detail['message'];
            this.menu.global_chat_field.add_message(username, time, text);
        }
    }
    send_message(username, time, text) {
        this.ws.send(JSON.stringify({
            'event': 'message',
            'username': username,
            'time': time,
            'message': text,
        }))
    }
    receive_message(username, time, text) {
        if(username!=this.menu.root.$login.username)
            this.menu.chat_field.add_message(username, time, text);
    }

    receive_online(online_user) {
        this.menu.global_chat_field.change_online_user(online_user);
    }
}