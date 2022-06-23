from django.shortcuts import redirect, reverse
from django.core.cache import cache
import requests
from urllib.parse import quote
from django.contrib.auth.models import User
from game.models.player.player import Player
from random import randint
from rest_framework_simplejwt.tokens import RefreshToken


def receive_code(request):
    data = request.GET
    code = data.get('code')
    state = data.get('state')

    if not cache.has_key(state):
        return redirect("index")

    cache.delete(state)

    apply_access_token_url = "https://graph.qq.com/oauth2.0/token"
    params = {
        'grant_type': "authorization_code",
        'client_id': "102005699",
        'client_secret': "ymNuxoRqeEZgYFiv",
        'code': code,
        'redirect_uri': "https://www.yuanaiv.top/setting/qq_login/receive_code",
        'fmt': "json"
    }

    access_token_res = requests.get(
        apply_access_token_url, params=params).json()
    access_token = access_token_res['access_token']

    get_user_openid_url = "https://graph.qq.com/oauth2.0/me"
    params = {
        'access_token': access_token,
        'fmt': "json"
    }

    openid_res = requests.get(get_user_openid_url, params=params).json()
    openid = openid_res['openid']

    players = Player.objects.filter(openid=openid)
    if players.exists():
        refresh = RefreshToken.for_user(players[0].user)
        return redirect(reverse("index") + "?access=%s&refresh=%s" % (str(refresh.access_token), str(refresh)))

    get_userinfo_url = "https://graph.qq.com/user/get_user_info"

    params = {
        'access_token': access_token,
        'oauth_consumer_key': "102005699",
        'openid': openid,
        'fmt': "json"
    }

    userinfo_res = requests.get(get_userinfo_url, params=params).json()

    username = userinfo_res['nickname']

    while User.objects.filter(username=username).exists():
        username += str(randint(0, 9))

    user = User.objects.create(username=username)
    player = Player.objects.create(user=user, openid=openid)

    refresh = RefreshToken.for_user(players[0].user)
    return redirect(reverse("index") + "?access=%s&refresh=%s" % (str(refresh.access_token), str(refresh)))
