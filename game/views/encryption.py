from django.http import JsonResponse


def encryption(request):
    return JsonResponse({
        'result': "success",
    })
