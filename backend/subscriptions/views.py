try:
    import razorpay
except ImportError:
    razorpay = None
import json
import os
from datetime import timedelta
from django.utils import timezone
from django.conf import settings as django_settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from .models import Plan, Subscription

RAZORPAY_KEY_ID     = os.getenv('RAZORPAY_KEY_ID', '')
RAZORPAY_KEY_SECRET = os.getenv('RAZORPAY_KEY_SECRET', '')


def get_razorpay_client():
    return razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))


class PlansView(APIView):
    """All plans list — public"""
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        plans = [
            {
                'id': 'free',
                'name': 'Free',
                'price_monthly': 0,
                'price_yearly': 0,
                'features': [
                    '5 Free Courses',
                    'Basic Quiz Access',
                    'Code Playground',
                    'Community Support',
                ],
                'popular': False,
            },
            {
                'id': 'premium',
                'name': 'Premium',
                'price_monthly': 299,
                'price_yearly': 2499,
                'features': [
                    'All Courses Unlimited',
                    'AI Doubt Solver',
                    'Mock Interviews',
                    'Resume Builder',
                    'Certificate Generation',
                    'Priority Support',
                ],
                'popular': True,
            },
            {
                'id': 'pro',
                'name': 'Pro',
                'price_monthly': 599,
                'price_yearly': 4999,
                'features': [
                    'Everything in Premium',
                    '1-on-1 Mentor Sessions',
                    'Job Placement Assistance',
                    'Live Classes Access',
                    'Custom Learning Path',
                    'Interview Guarantee',
                ],
                'popular': False,
            },
        ]
        return Response(plans)


class CreateOrderView(APIView):
    """Razorpay order create చెయ్యి"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        plan_id = request.data.get('plan_id')
        billing = request.data.get('billing', 'monthly')

        PRICES = {
            ('premium', 'monthly'): 29900,   # paise లో (₹299)
            ('premium', 'yearly'):  249900,   # ₹2499
            ('pro', 'monthly'):     59900,    # ₹599
            ('pro', 'yearly'):      499900,   # ₹4999
        }

        amount = PRICES.get((plan_id, billing))
        if not amount:
            return Response({'error': 'Invalid plan'}, status=400)

        try:
            client = get_razorpay_client()
            order = client.order.create({
                'amount': amount,
                'currency': 'INR',
                'receipt': f'devpath_{request.user.id}_{plan_id}',
                'notes': {
                    'user_id': str(request.user.id),
                    'plan_id': plan_id,
                    'billing': billing,
                }
            })
            return Response({
                'order_id': order['id'],
                'amount': amount,
                'currency': 'INR',
                'key': RAZORPAY_KEY_ID,
                'plan_id': plan_id,
                'billing': billing,
            })
        except Exception as e:
            return Response({'error': str(e)}, status=500)


class VerifyPaymentView(APIView):
    """Payment verify చేసి subscription activate చెయ్యి"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        payment_id = request.data.get('razorpay_payment_id')
        order_id   = request.data.get('razorpay_order_id')
        signature  = request.data.get('razorpay_signature')
        plan_id    = request.data.get('plan_id')
        billing    = request.data.get('billing', 'monthly')

        try:
            client = get_razorpay_client()
            client.utility.verify_payment_signature({
                'razorpay_order_id':   order_id,
                'razorpay_payment_id': payment_id,
                'razorpay_signature':  signature,
            })

            # Subscription activate చెయ్యి
            days = 365 if billing == 'yearly' else 30
            expires = timezone.now() + timedelta(days=days)

            sub, _ = Subscription.objects.get_or_create(user=request.user)
            sub.status              = 'active'
            sub.billing_cycle       = billing
            sub.expires_at          = expires
            sub.razorpay_order_id   = order_id
            sub.razorpay_payment_id = payment_id
            sub.save()

            # User plan update చెయ్యి
            request.user.subscription_plan = plan_id
            request.user.subscription_expiry = expires
            request.user.save()

            return Response({
                'success': True,
                'message': f'🎉 {plan_id.title()} plan activated!',
                'expires_at': expires,
            })

        except razorpay.errors.SignatureVerificationError:
            return Response({'error': 'Payment verification failed'}, status=400)
        except Exception as e:
            return Response({'error': str(e)}, status=500)


class MySubscriptionView(APIView):
    """Current user subscription details"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        try:
            sub = Subscription.objects.get(user=user)
            return Response({
                'plan': user.subscription_plan,
                'status': sub.status,
                'billing': sub.billing_cycle,
                'expires_at': sub.expires_at,
                'is_active': sub.status == 'active' and (
                    sub.expires_at is None or sub.expires_at > timezone.now()
                ),
            })
        except Subscription.DoesNotExist:
            return Response({
                'plan': 'free',
                'status': 'active',
                'is_active': True,
                })

