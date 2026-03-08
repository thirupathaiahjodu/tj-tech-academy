from django.urls import path
from . import views

urlpatterns = [
    path('plans/',          views.PlansView.as_view(),          name='plans'),
    path('create-order/',   views.CreateOrderView.as_view(),    name='create-order'),
    path('verify-payment/', views.VerifyPaymentView.as_view(),  name='verify-payment'),
    path('my/',             views.MySubscriptionView.as_view(), name='my-subscription'),
]