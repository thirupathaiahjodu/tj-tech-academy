from django.contrib import admin
from .models import Quiz, Question, Result

class QuestionInline(admin.TabularInline):
    model = Question
    extra = 4

@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    list_display = ['title', 'lesson', 'pass_score']
    inlines = [QuestionInline]

@admin.register(Result)
class ResultAdmin(admin.ModelAdmin):
    list_display = ['user', 'quiz', 'score', 'total', 'passed', 'attempted_at']