from difflib import Match
from tokenize import group
from channels.generic.websocket import AsyncWebsocketConsumer
from django.core.cache import cache
from game.models.player.player import Player
from game.models.tools.tools import Tool
from django.conf import settings
from channels.db import database_sync_to_async
from django.conf import settings
from match_system.src.match_server.match_service import Match
from channels.db import database_sync_to_async
from thrift import Thrift
from thrift.transport import TSocket
from thrift.transport import TTransport
from thrift.protocol import TBinaryProtocol
import json


class MultiPlayer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        if self.room_name:
            await self.channel_layer.group_discard(self.room_name, self.channel_name)

    async def create_player(self, data):  # 异步
        self.room_name = None
        self.uuid = data['uuid']

        # Make socket
        transport = TSocket.TSocket('localhost', 9090)
        # Buffering is critical. Raw sockets are very slow
        transport = TTransport.TBufferedTransport(transport)

        # Wrap in a protocol
        protocol = TBinaryProtocol.TBinaryProtocol(transport)

        # Create a client to use the protocol encoder
        client = Match.Client(protocol)

        def db_get_player():
            return Player.objects.get(user__username=data['username'])

        player = await database_sync_to_async(db_get_player)()

        # Connect!
        transport.open()

        client.add_player(
            player.score, data['uuid'], data['username'], data['hero'], self.channel_name)

        transport.close()

    async def group_send_event(self, data):
        if not self.room_name:
            keys=cache.keys('*%s*' %(self.uuid))
            if keys:
                self.room_name=keys[0]
        await self.send(text_data=json.dumps(data))

    async def move_to(self, data):
        await self.channel_layer.group_send(
            self.room_name,
            {
                'type': "group_send_event",
                'event': "move_to",
                'uuid': data['uuid'],
                'tx': data['tx'],
                'ty': data['ty'],
            }
        )

    async def shoot_fireball(self, data):
        await self.channel_layer.group_send(
            self.room_name,
            {
                'type': "group_send_event",
                'event': "shoot_fireball",
                'uuid': data['uuid'],
                'tx': data['tx'],
                'ty': data['ty'],
                'ball_uuid': data['ball_uuid'],
            }
        )

    async def attack(self, data):
        await self.channel_layer.group_send(
            self.room_name,
            {
                'type': "group_send_event",
                'event': "attack",
                'uuid': data['uuid'],
                'attackee_uuid': data['attackee_uuid'],
                'x': data['x'],
                'y': data['y'],
                'skill': data['skill'],
                'angle': data['angle'],
                'damage': data['damage'],
                'ball_uuid': data['ball_uuid'],
            }
        )

    async def receive(self, text_data):  # 接收客户端的信息
        data = json.loads(text_data)

        event = data['event']

        if event == "create_player":
            await self.create_player(data)

        elif event == "move_to":
            await self.move_to(data)

        elif event == "shoot_fireball":
            await self.shoot_fireball(data)
        elif event == "attack":
            await self.attack(data)

        if event == "add":
            def db_get_player():
                return Player.objects.get(user__username=data['username'])
            player = await database_sync_to_async(db_get_player)()

            def db_update_player_score(username, score):
                player.score += score
                player.save()

            await database_sync_to_async(db_update_player_score)(data['username'], 10)

        if event == "reduce":
            def db_get_player():
                return Player.objects.get(user__username=data['username'])
            player = await database_sync_to_async(db_get_player)()

            def db_update_player_score(username, score):
                player.score += score
                player.save()
            await database_sync_to_async(db_update_player_score)(data['username'], -5)

        if event == "message":
            await self.message(data)

        if event == "add_money":
            def db_get_player():
                return Player.objects.get(user__username=data['username'])
            player = await database_sync_to_async(db_get_player)()

            def add_player_money(username, money):
                player.money += money
                player.save()

            await database_sync_to_async(add_player_money)(data['username'], data['money'])

        if event == "buy":
            def db_get_player():
                return Player.objects.get(user__username=data['username'])

            def db_get_tool():
                return Tool.objects.get(name=data['name'])

            player = await database_sync_to_async(db_get_player)()
            tool = await database_sync_to_async(db_get_tool)()

            def update_tool(username, name):
                player.money -= tool.cost
                s = str(player.tool)
                if s == "None":
                    s = ""
                s += data['id']
                player.tool = s
                player.save()

            await database_sync_to_async(update_tool)(data['username'], data['name'])

    async def message(self, data):
        await self.channel_layer.group_send(
            self.room_name,
            {
                'type': "group_send_event",
                'event': "message",
                'time': data['time'],
                'username': data['username'],
                'text': data['message'],
            }
        )
