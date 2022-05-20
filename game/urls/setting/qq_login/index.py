from django.urls import path
from game.views.setting.qq_login.apply_code import apply_code
from game.views.setting.qq_login.receive_code import receive_code


urlpatterns = [
    path("apply_code/", apply_code, name="setting_qqlogin_apply_code"),
    path("receive_code/", receive_code, name="setting_qqlogin_receive_code"),
]
