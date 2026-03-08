from django.db import models
from django.conf import settings


class Notification(models.Model):
    TYPES = [
        ('lesson',    'Lesson Complete'),
        ('quiz',      'Quiz Result'),
        ('badge',     'Badge Earned'),
        ('streak',    'Streak'),
        ('system',    'System'),
        ('course',    'Course Update'),
    ]

    user        = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    notif_type  = models.CharField(max_length=20, choices=TYPES, default='system')
    title       = models.CharField(max_length=200)
    message     = models.TextField()
    icon        = models.CharField(max_length=10, default='🔔')
    is_read     = models.BooleanField(default=False)
    link        = models.CharField(max_length=200, blank=True)  # e.g. /courses/python
    created_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} — {self.title}"