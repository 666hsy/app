from django.contrib import admin
from game.models.player.player import Player
from game.models.tools.tools import Tool

# Register your models here.

admin.site.register(Player)
admin.site.register(Tool)
