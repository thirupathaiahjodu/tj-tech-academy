from rest_framework import serializers
from .models import Course, Module, Lesson


class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ['id', 'title', 'order', 'duration_mins',
                  'is_premium', 'code_example', 'expected_output', 'content', 'video_url']


class ModuleSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)
    lesson_count = serializers.SerializerMethodField()

    class Meta:
        model = Module
        fields = ['id', 'title', 'order', 'description', 'lessons', 'lesson_count']

    def get_lesson_count(self, obj):
        return obj.lessons.count()


class CourseSerializer(serializers.ModelSerializer):
    modules = ModuleSerializer(many=True, read_only=True)
    instructor_name = serializers.SerializerMethodField()
    module_count = serializers.SerializerMethodField()
    total_lessons = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = ['id', 'title', 'slug', 'description', 'thumbnail',
                  'difficulty', 'category', 'instructor_name',
                  'is_premium', 'is_published', 'total_duration_hrs',
                  'created_at', 'modules', 'module_count', 'total_lessons']

    def get_instructor_name(self, obj):
        return obj.instructor.username if obj.instructor else 'DevPath Team'

    def get_module_count(self, obj):
        return obj.modules.count()

    def get_total_lessons(self, obj):
        return sum(m.lessons.count() for m in obj.modules.all())


class CourseListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for course listing (no nested data)"""
    instructor_name = serializers.SerializerMethodField()
    module_count = serializers.SerializerMethodField()
    total_lessons = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = ['id', 'title', 'slug', 'description', 'thumbnail',
                  'difficulty', 'category', 'instructor_name',
                  'is_premium', 'total_duration_hrs', 'module_count', 'total_lessons']

    def get_instructor_name(self, obj):
        return obj.instructor.username if obj.instructor else 'DevPath Team'

    def get_module_count(self, obj):
        return obj.modules.count()

    def get_total_lessons(self, obj):
        return sum(m.lessons.count() for m in obj.modules.all())