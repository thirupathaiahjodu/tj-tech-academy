from django.db import models
from django.conf import settings

class Course(models.Model):
    DIFFICULTY_CHOICES = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    ]
    CATEGORY_CHOICES = [
        ('python', 'Python'),
        ('web', 'Web Development'),
        ('react', 'React'),
        ('django', 'Django'),
        ('database', 'Database'),
        ('dsa', 'DSA'),
    ]

    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    thumbnail = models.ImageField(upload_to='course_thumbnails/', null=True, blank=True)
    difficulty = models.CharField(max_length=15, choices=DIFFICULTY_CHOICES, default='beginner')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='python')
    instructor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    is_premium = models.BooleanField(default=False)
    is_published = models.BooleanField(default=False)
    total_duration_hrs = models.FloatField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Module(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='modules')
    title = models.CharField(max_length=200)
    order = models.PositiveIntegerField(default=0)
    description = models.TextField(blank=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.course.title} - {self.title}"


class Lesson(models.Model):
    module = models.ForeignKey(Module, on_delete=models.CASCADE, related_name='lessons')
    title = models.CharField(max_length=200)
    content = models.TextField()
    video_url = models.URLField(null=True, blank=True)
    code_example = models.TextField(blank=True)
    expected_output = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)
    is_premium = models.BooleanField(default=False)
    duration_mins = models.PositiveIntegerField(default=5)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title