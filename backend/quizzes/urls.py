from django.urls import path
from .views import QuizDetailView, QuizSubmitView, MyResultsView

urlpatterns = [
    path('lesson/<int:lesson_id>/', QuizDetailView.as_view(), name='quiz-detail'),
    path('submit/', QuizSubmitView.as_view(), name='quiz-submit'),
    path('my-results/', MyResultsView.as_view(), name='my-results'),
]