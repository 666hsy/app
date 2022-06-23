from django.urls import path, include
from game.views.setting.getinfo import InfoView
from game.views.setting.register import PlayerView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


urlpatterns = [
    path("token/", TokenObtainPairView.as_view(), name="setting_token"),
    path("token/refresh/", TokenRefreshView.as_view(),
         name="setting_token_refresh"),
    path("getinfo/", InfoView.as_view(), name="setting_getinfo"),
    path("register/", PlayerView.as_view(), name="setting_register"),
    path("qq_login/", include("game.urls.setting.qq_login.index")),
]
