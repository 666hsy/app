from django.urls import path
from game.consumers.socket.index import MultiPlayer

websocket_urlpatterns = [
    path("ws/socket/", MultiPlayer.as_asgi(), name="ws_socket"),
]