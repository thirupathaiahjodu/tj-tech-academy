from django.db import models
from django.conf import settings


class Plan(models.Model):
    PLAN_TYPES = [('free', 'Free'), ('premium', 'Premium'), ('pro', 'Pro')]
    name = models.CharField(max_length=50)
    plan_type = models.CharField(max_length=20, choices=PLAN_TYPES)
    price_monthly = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    price_yearly = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    features = models.JSONField(default=list)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class Subscription(models.Model):
    STATUS = [('active', 'Active'), ('expired', 'Expired'), ('cancelled', 'Cancelled')]
    BILLING = [('monthly', 'Monthly'), ('yearly', 'Yearly')]

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='subscription')
    plan = models.ForeignKey(Plan, on_delete=models.SET_NULL, null=True)
    status = models.CharField(max_length=20, choices=STATUS, default='active')
    billing_cycle = models.CharField(max_length=10, choices=BILLING, default='monthly')
    started_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    razorpay_order_id = models.CharField(max_length=100, blank=True)
    razorpay_payment_id = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"{self.user.email} — {self.plan}"