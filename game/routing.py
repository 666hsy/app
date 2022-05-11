from django.urls import path
from game.consumers.socket.index import MultiPlayer

websocket_urlpatterns = [
    path("wss/socket/", MultiPlayer.as_asgi(), name="wss_socket"),
]