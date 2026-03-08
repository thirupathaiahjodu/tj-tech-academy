from django.db import models
from django.conf import settings


class UserPoints(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='points')
    total_points = models.IntegerField(default=0)
    streak_days = models.IntegerField(default=0)
    last_activity = models.DateField(null=True, blank=True)
    lessons_completed = models.IntegerField(default=0)
    quizzes_passed = models.IntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.email} — {self.total_points} pts"


class Badge(models.Model):
    BADGE_TYPES = [
        ('lesson', 'Lesson'),
        ('quiz', 'Quiz'),
        ('streak', 'Streak'),
        ('course', 'Course'),
        ('special', 'Special'),
    ]
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=255)
    icon = models.CharField(max_length=10, default='🏆')
    badge_type = models.CharField(max_length=20, choices=BADGE_TYPES)
    required_count = models.IntegerField(default=1)
    points_reward = models.IntegerField(default=50)

    def __str__(self):
        return self.name


class UserBadge(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='badges')
    badge = models.ForeignKey(Badge, on_delete=models.CASCADE)
    earned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'badge')

    def __str__(self):
        return f"{self.user.email} — {self.badge.name}"


class PointTransaction(models.Model):
    ACTIVITY_TYPES = [
        ('lesson_complete', 'Lesson Complete'),
        ('quiz_pass', 'Quiz Pass'),
        ('streak_bonus', 'Streak Bonus'),
        ('badge_earned', 'Badge Earned'),
        ('course_complete', 'Course Complete'),
        ('daily_login', 'Daily Login'),
    ]
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='transactions')
    activity = models.CharField(max_length=30, choices=ACTIVITY_TYPES)
    points = models.IntegerField()
    description = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} +{self.points} ({self.activity})"