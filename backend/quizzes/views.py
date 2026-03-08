from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Quiz, Question, Result
from .serializers import QuizSerializer, ResultSerializer, QuestionResultSerializer


class QuizDetailView(generics.RetrieveAPIView):
    serializer_class = QuizSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return Quiz.objects.get(lesson_id=self.kwargs['lesson_id'])


class QuizSubmitView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        quiz_id = request.data.get('quiz_id')
        answers = request.data.get('answers', {})
        # answers = { "question_id": "a", "question_id": "b", ... }

        try:
            quiz = Quiz.objects.get(id=quiz_id)
        except Quiz.DoesNotExist:
            return Response({'error': 'Quiz not found'}, status=404)

        questions = quiz.questions.all()
        score = 0
        results_detail = []

        for q in questions:
            user_answer = answers.get(str(q.id), '').lower()
            is_correct = user_answer == q.correct_option
            if is_correct:
                score += 1
            results_detail.append({
                'question_id': q.id,
                'question': q.text,
                'user_answer': user_answer,
                'correct_answer': q.correct_option,
                'is_correct': is_correct,
                'explanation': q.explanation,
                'options': {
                    'a': q.option_a, 'b': q.option_b,
                    'c': q.option_c, 'd': q.option_d,
                }
            })

        total = questions.count()
        percentage = round((score / total) * 100, 1) if total > 0 else 0
        passed = percentage >= quiz.pass_score

        # Save result
        Result.objects.create(
            user=request.user,
            quiz=quiz,
            score=score,
            total=total,
            passed=passed,
        )

        return Response({
            'score': score,
            'total': total,
            'percentage': percentage,
            'passed': passed,
            'pass_score': quiz.pass_score,
            'results': results_detail,
        })


class MyResultsView(generics.ListAPIView):
    serializer_class = ResultSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Result.objects.filter(user=self.request.user)