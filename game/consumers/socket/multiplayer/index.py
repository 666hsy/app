from tokenize import group
from channels.generic.websocket import AsyncWebsocketConsumer
from django.core.cache import cache
from game.models.player.player import Player
from game.models.tools.tools import Tool
from django.conf import settings
from channels.db import database_sync_to_async
from django.conf import settings
import json


class MultiPlayer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = None

        for i in range(1000):
            name = "room-%id" % (i)
            if not cache.has_key(name) or len(cache.get(name)) < settings.ROOM_CAPACITY:
                self.room_name = name
                break
        if not self.room_name:
            return

        await self.accept()

        if not cache.has_key(self.room_name):
            cache.set(self.room_name, [], 3600)

        for player in cache.get(self.room_name):
            await self.send(text_data=json.dumps({
                'event': "create_player",
                'uuid': player['uuid'],
                'username': player['username'],
                'hero': player['hero'],
            }))

        await self.channel_layer.group_add(self.room_name, self.channel_name)

    async def disconnect(self, close_code):
        print('disconnect')
        await self.channel_layer.group_discard(self.room_name, self.channel_name)

    async def create_player(self, data):  # 异步
        players = cache.get(self.room_name)
        print(data)
        players.append({
            'uuid': data['uuid'],
            'username': data['username'],
            'hero': data['hero']
        })
        cache.set(self.room_name, players, 3600)
        await self.channel_layer.group_send(
            self.room_name,
            {
                'type': "group_send_event",
                'event': "create_player",
                'uuid': data['uuid'],
                'username': data['username'],
                'hero': data['hero'],
            }
        )

    async def group_send_event(self, data):
        await self.send(text_data=json.dumps(data))

    async def receive(self, text_data):  # 接收客户端的信息
        data = json.loads(text_data)

        event = data['event']

        if event == "create_player":
            await self.create_player(data)

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
