from django.urls import path
from .views import AskDoubtView, SuggestTopicsView

urlpatterns = [
    path('ask/', AskDoubtView.as_view(), name='ask-doubt'),
    path('suggest/', SuggestTopicsView.as_view(), name='suggest-topics'),
]