from django.urls import path
from .views import EmptyCart, GetSearch, PlaceOrder
from .views import CreateUserView, GetUser
from .views import Login, Logout
from .views import UpdateCart, GetCart, GetOrders

urlpatterns = [
    path('s/', GetSearch.as_view()),
    path('create/', CreateUserView.as_view()),
    path('user/', GetUser.as_view()),
    path('login/', Login.as_view()),
    path('logout/', Logout.as_view()),
    path('updateCart/', UpdateCart.as_view()),
    path('emptyCart/', EmptyCart.as_view()),
    path('GetCart/', GetCart.as_view()),
    path('placeOrder/', PlaceOrder.as_view()),
    path('getOrders/', GetOrders.as_view()),
]
