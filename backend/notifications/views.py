from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from .models import Notification


def create_notification(user, notif_type, title, message, icon='🔔', link=''):
    """Helper — anywhere నుండి notification create చెయ్యి"""
    return Notification.objects.create(
        
        user=user,
        notif_type=notif_type,
        title=title,
        message=message,
        icon=icon,
        link=link,
    )


class NotificationListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        notifs = Notification.objects.filter(user=request.user)[:30]
        unread = Notification.objects.filter(user=request.user, is_read=False).count()

        data = [{
            'id':         n.id,
            'type':       n.notif_type,
            'title':      n.title,
            'message':    n.message,
            'icon':       n.icon,
            'is_read':    n.is_read,
            'link':       n.link,
            'created_at': n.created_at,
        } for n in notifs]

        return Response({'notifications': data, 'unread_count': unread})


class MarkReadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        notif_id = request.data.get('id')
        if notif_id == 'all':
            Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
            return Response({'message': 'All marked as read'})

        Notification.objects.filter(id=notif_id, user=request.user).update(is_read=True)
        return Response({'message': 'Marked as read'})


class DeleteNotificationView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk):
        Notification.objects.filter(id=pk, user=request.user).delete()
        return Response({'message': 'Deleted'})
