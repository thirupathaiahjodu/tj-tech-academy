from django.utils import timezone
from django.db.models import Sum
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from .models import UserPoints, Badge, UserBadge, PointTransaction
from django.contrib.auth import get_user_model

User = get_user_model()


def award_points(user, activity, points, description):
    """Helper: points award చెయ్యి + transaction save చెయ్యి"""
    user_pts, _ = UserPoints.objects.get_or_create(user=user)
    user_pts.total_points += points
    user_pts.save()

    PointTransaction.objects.create(
        user=user,
        activity=activity,
        points=points,
        description=description,
    )

    # Badge check చెయ్యి
    new_badges = check_and_award_badges(user, user_pts)
    return new_badges


def check_and_award_badges(user, user_pts):
    """User కి new badges check చేసి award చెయ్యి"""
    new_badges = []
    all_badges = Badge.objects.all()
    earned_ids = UserBadge.objects.filter(user=user).values_list('badge_id', flat=True)

    for badge in all_badges:
        if badge.id in earned_ids:
            continue

        earned = False
        if badge.badge_type == 'lesson' and user_pts.lessons_completed >= badge.required_count:
            earned = True
        elif badge.badge_type == 'quiz' and user_pts.quizzes_passed >= badge.required_count:
            earned = True
        elif badge.badge_type == 'streak' and user_pts.streak_days >= badge.required_count:
            earned = True

        if earned:
            UserBadge.objects.create(user=user, badge=badge)
            new_badges.append(badge.name)

    return new_badges


class MyStatsView(APIView):
    """User stats + badges + recent transactions"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        user_pts, _ = UserPoints.objects.get_or_create(user=user)
        badges = UserBadge.objects.filter(user=user).select_related('badge')
        transactions = PointTransaction.objects.filter(user=user)[:10]

        # Leaderboard rank calculate చెయ్యి
        rank = UserPoints.objects.filter(
            total_points__gt=user_pts.total_points
        ).count() + 1

        return Response({
            'points': UserPointsSerializer(user_pts).data,
            'rank': rank,
            'badges': UserBadgeSerializer(badges, many=True).data,
            'recent_activity': PointTransactionSerializer(transactions, many=True).data,
        })


class AddPointsView(APIView):
    """Lesson complete / Quiz pass అయినప్పుడు points add చెయ్యి"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        activity = request.data.get('activity')
        user = request.user
        user_pts, _ = UserPoints.objects.get_or_create(user=user)

        POINT_MAP = {
            'lesson_complete': (20, 'Lesson completed! +20 pts'),
            'quiz_pass': (50, 'Quiz passed! +50 pts'),
            'course_complete': (200, 'Course completed! +200 pts'),
            'daily_login': (10, 'Daily login bonus! +10 pts'),
        }

        if activity not in POINT_MAP:
            return Response({'error': 'Invalid activity'}, status=400)

        pts, desc = POINT_MAP[activity]

        # Lesson / quiz count update
        if activity == 'lesson_complete':
            user_pts.lessons_completed += 1

            # Streak update
            today = timezone.now().date()
            if user_pts.last_activity:
                diff = (today - user_pts.last_activity).days
                if diff == 1:
                    user_pts.streak_days += 1
                    if user_pts.streak_days % 7 == 0:
                        pts += 50  # Streak bonus!
                        desc += f' + {user_pts.streak_days} day streak bonus!'
                elif diff > 1:
                    user_pts.streak_days = 1
            else:
                user_pts.streak_days = 1
            user_pts.last_activity = today

        elif activity == 'quiz_pass':
            user_pts.quizzes_passed += 1

        user_pts.total_points += pts
        user_pts.save()

        PointTransaction.objects.create(
            user=user, activity=activity, points=pts, description=desc
        )

        new_badges = check_and_award_badges(user, user_pts)

        return Response({
            'points_earned': pts,
            'total_points': user_pts.total_points,
            'streak_days': user_pts.streak_days,
            'new_badges': new_badges,
            'message': desc,
        })


class LeaderboardView(APIView):
    """Top 20 users leaderboard"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        top_users = UserPoints.objects.select_related('user').order_by('-total_points')[:20]

        leaderboard = []
        for rank, up in enumerate(top_users, 1):
            leaderboard.append({
                'rank': rank,
                'name': up.user.get_full_name() or up.user.email.split('@')[0],
                'email': up.user.email,
                'avatar': up.user.avatar.url if hasattr(up.user, 'avatar') and up.user.avatar else None,
                'total_points': up.total_points,
                'streak_days': up.streak_days,
                'lessons_completed': up.lessons_completed,
                'badges_count': UserBadge.objects.filter(user=up.user).count(),
                'is_me': up.user == request.user,
            })

        # Current user rank (leaderboard లో లేకపోవచ్చు)
        my_pts, _ = UserPoints.objects.get_or_create(user=request.user)
        my_rank = UserPoints.objects.filter(total_points__gt=my_pts.total_points).count() + 1

        return Response({
            'leaderboard': leaderboard,
            'my_rank': my_rank,
            'my_points': my_pts.total_points,
        })
