from channels.generic.websocket import AsyncWebsocketConsumer
from django.core.cache import cache
from game.models.player.player import Player
from game.models.tools.tools import Tool
from channels.db import database_sync_to_async
import json


class MultiPlayer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        print('accept')

        self.room_name = "room"
        await self.channel_layer.group_add(self.room_name, self.channel_name)

    async def disconnect(self, close_code):
        print('disconnect')
        await self.channel_layer.group_discard(self.room_name, self.channel_name)

    async def group_send_event(self, data):
        await self.send(text_data=json.dumps(data))

    async def receive(self, text_data):  # 接收客户端的信息
        data = json.loads(text_data)

        event = data['event']

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
