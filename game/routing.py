from django.urls import path
from game.consumers.socket.index import Socket
from game.consumers.socket.multiplayer.index import MultiPlayer

websocket_urlpatterns = [
    path("wss/socket/", Socket.as_asgi(), name="wss_socket"),
    path("wss/socket/multiplayer/", MultiPlayer.as_asgi(),
         name="wss_socket_multiplayer"),
]
