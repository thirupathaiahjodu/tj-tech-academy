from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('api/courses/', include('courses.urls')), 
    path('api/quizzes/', include('quizzes.urls')),
    path('api/ai/', include('ai_assistant.urls')),
    path('api/gamification/', include('gamification.urls')),
    path('api/subscriptions/', include('subscriptions.urls')),
    path('api/notifications/', include('notifications.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)