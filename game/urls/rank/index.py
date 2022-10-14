from django.urls import path
from game.views.rank.rank_list import RankListView

urlpatterns = [
    path("ranklist/", RankListView.as_view(), name="rank_list"),
]
