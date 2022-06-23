from django.http import JsonResponse
from urllib.parse import quote
from random import randint
from django.core.cache import cache


def get_state():
    res = ""
    for i in range(8):
        res += str(randint(0, 9))
    return res


def apply_code(request):
    response_type = "code"
    client_id = "102005699"
    redirect_uri = quote(
        "https://www.yuanaiv.top/setting/qq_login/receive_code")  # url编码
    state = get_state()  # 随机值，验证身份
    scope = "get_user_info"

    cache.set(state, True, 7200)  # 有效期,存入redis

    apply_code_url = "https://graph.qq.com/oauth2.0/authorize"
    return JsonResponse({
        'result': "success",
        'apply_code_url': apply_code_url + "?response_type=%s&client_id=%s&redirect_uri=%s&state=%s&scope=%s" % (response_type, client_id, redirect_uri, state, scope)
    })
