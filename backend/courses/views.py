from rest_framework import generics, permissions, filters
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Course, Module, Lesson
from .serializers import CourseSerializer, CourseListSerializer, ModuleSerializer, LessonSerializer


class CourseListView(generics.ListAPIView):
    serializer_class = CourseListSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = Course.objects.filter(is_published=True)
        category = self.request.query_params.get('category')
        difficulty = self.request.query_params.get('difficulty')
        is_premium = self.request.query_params.get('is_premium')

        if category:
            qs = qs.filter(category=category)
        if difficulty:
            qs = qs.filter(difficulty=difficulty)
        if is_premium is not None:
            qs = qs.filter(is_premium=is_premium.lower() == 'true')
        return qs


class CourseDetailView(generics.RetrieveAPIView):
    serializer_class = CourseSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'
    queryset = Course.objects.filter(is_published=True)


class ModuleListView(generics.ListAPIView):
    serializer_class = ModuleSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Module.objects.filter(course_id=self.kwargs['course_id'])


class LessonDetailView(generics.RetrieveAPIView):
    serializer_class = LessonSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Lesson.objects.all()

    def retrieve(self, request, *args, **kwargs):
        lesson = self.get_object()
        # Premium lesson check
        if lesson.is_premium and request.user.subscription_plan == 'free':
            return Response(
                {'detail': 'This lesson requires Premium. Please upgrade!'},
                status=403
            )
        return super().retrieve(request, *args, **kwargs)


# Admin only
class CourseCreateView(generics.CreateAPIView):
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = Course.objects.all()


class CourseUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = Course.objects.all()