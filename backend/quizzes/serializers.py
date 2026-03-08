from rest_framework import serializers
from .models import Quiz, Question, Result


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'text', 'option_a', 'option_b',
                  'option_c', 'option_d', 'order']
        # correct_option hide చేస్తాం — submit తర్వాత reveal


class QuestionResultSerializer(serializers.ModelSerializer):
    """Submit తర్వాత correct answer show చేయడానికి"""
    class Meta:
        model = Question
        fields = ['id', 'text', 'option_a', 'option_b',
                  'option_c', 'option_d', 'correct_option', 'explanation']


class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    question_count = serializers.SerializerMethodField()

    class Meta:
        model = Quiz
        fields = ['id', 'title', 'pass_score', 'questions', 'question_count']

    def get_question_count(self, obj):
        return obj.questions.count()


class ResultSerializer(serializers.ModelSerializer):
    quiz_title = serializers.CharField(source='quiz.title', read_only=True)
    percentage = serializers.SerializerMethodField()

    class Meta:
        model = Result
        fields = ['id', 'quiz_title', 'score', 'total',
                  'passed', 'percentage', 'attempted_at']

    def get_percentage(self, obj):
        return round((obj.score / obj.total) * 100, 1) if obj.total > 0 else 0