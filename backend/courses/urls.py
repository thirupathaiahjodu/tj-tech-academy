from django.urls import path
from .views import (
    CourseListView, CourseDetailView,
    ModuleListView, LessonDetailView,
    CourseCreateView, CourseUpdateDeleteView
)

urlpatterns = [
    path('', CourseListView.as_view(), name='course-list'),
    path('create/', CourseCreateView.as_view(), name='course-create'),
    path('<slug:slug>/', CourseDetailView.as_view(), name='course-detail'),
    path('<int:pk>/edit/', CourseUpdateDeleteView.as_view(), name='course-update'),
    path('<int:course_id>/modules/', ModuleListView.as_view(), name='module-list'),
    path('lessons/<int:pk>/', LessonDetailView.as_view(), name='lesson-detail'),
]