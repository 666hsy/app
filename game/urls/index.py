from django.urls import path, include
from game.views.index import index
from game.views.encryption import encryption

urlpatterns = [
    path("", index, name="index"),
    path("encryption/", encryption, name="encryption"),
    path("setting/", include("game.urls.setting.index")),
    path("rank/", include("game.urls.rank.index")),
]
