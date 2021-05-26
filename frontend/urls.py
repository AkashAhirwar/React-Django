from django.urls import path
from .views import index

urlpatterns = [
    path('', index),
    path('Signup/', index),
    path('Signin/', index),
    path('Cart/', index),
    path('Orders/', index),
    path('s/<str:k>/', index),
]
