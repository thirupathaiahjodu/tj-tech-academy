from django.urls import path
from . import views

urlpatterns = [
    path('stats/', views.MyStatsView.as_view(), name='my-stats'),
    path('add-points/', views.AddPointsView.as_view(), name='add-points'),
    path('leaderboard/', views.LeaderboardView.as_view(), name='leaderboard'),
]