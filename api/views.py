import rest_framework
from rest_framework import serializers
from api.models import Order, OrderProduct, Product
from amazon.settings import BASE_DIR, SESSION_COOKIE_AGE
from django.shortcuts import render
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from rest_framework import permissions, status
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response
from .serializers import OrderProductSerializer, OrderSerializer, ProductSerializer, UserSerializer

import requests
from bs4 import BeautifulSoup

# Create your views here.


class GetSearch(APIView):
    def get(self, request):
        k = request.GET.get('k')

        # url = f'https://www.amazon.in/s?k={k}'
        url = BASE_DIR / "api/webpages/Amazon.in _ headphones with mic.html"  # 1.7

        # page = requests.get(url)
        page = open(url, encoding='UTF-8')

        soup = BeautifulSoup(page, 'html.parser')
        # soup = BeautifulSoup(page.text, 'html.parser')

        data = []
        root = soup.select(f'#search > div.s-desktop-width-max.s-opposite-dir > div > div.s-matching-dir.sg-col-16-of-20.sg-col.sg-col-8-of-12.sg-col-12-of-16 > div > span:nth-child(4) > div.s-main-slot.s-result-list.s-search-results.sg-row')
        if len(root) > 0:
            for i in range(3, 25):
                selector = root[0].select(
                    f'div:nth-child({str(i)}) > div > span > div > div > div:nth-child(2)')
                if len(selector) > 0:
                    img = selector[0].select(
                        'div.sg-col-4-of-12.sg-col-4-of-16.sg-col.sg-col-4-of-20 > div > div > span > a > div > img')
                    title = selector[0].select(
                        'div.sg-col-4-of-12.sg-col-8-of-16.sg-col-12-of-20.sg-col > div > div:nth-child(1) > div > div > div:nth-child(1) > h2 > a > span')
                    price = selector[0].select(
                        'div.sg-col-4-of-12.sg-col-8-of-16.sg-col-12-of-20.sg-col > div > div:nth-child(2) > div.sg-col-4-of-12.sg-col-4-of-16.sg-col.sg-col-4-of-20 > div > div.a-section.a-spacing-none.a-spacing-top-small > div > div > div > a > span:nth-child(1) > span:nth-child(2) > span.a-price-whole')
                    data.append({'imgUrl': img[0]['srcset'].split(' ')[
                                0], 'title': title[0].get_text(), 'price': price[0].get_text()})
        if len(data) == 0:
            data = [{'title': 'error'}]
        return Response(data=data, content_type="application/json")


class CreateUserView(CreateAPIView):
    model = User
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = UserSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        username = request.data['username']
        password = request.data['password']
        user = authenticate(username=username, password=password)

        if user is not None and user.is_active:
            request.session.set_expiry(SESSION_COOKIE_AGE)
            login(request, user)
            return Response({'logged in': True}, status=status.HTTP_201_CREATED, content_type="application/json")
        return Response({'logged in': False}, status=status.HTTP_201_CREATED, content_type="application/json")


class GetUser(APIView):
    def get(self, request):
        user = request.user
        if hasattr(user, 'first_name'):
            return Response({'user': user.first_name}, content_type="application/json")
        else:
            return Response({'user': user.username}, content_type="application/json")


class Login(APIView):
    def post(self, request):
        username = request.data['username']
        password = request.data['password']
        user = authenticate(username=username, password=password)
        if user is not None and user.is_active:
            request.session.set_expiry(SESSION_COOKIE_AGE)
            login(request, user)
            return Response({'login': True}, content_type="application/json")
        return Response({'login': False}, content_type="application/json")


class Logout(APIView):
    def post(self, request):
        if request.session and request.session.session_key:
            logout(request)
        return Response(status=status.HTTP_200_OK)


class UpdateCart(APIView):
    def post(self, request):
        if not request.session or not request.session.session_key:
            request.session.save()

        cart = request.session.get('cart', {'length': 0, 'items': {}})
        data = request.data

        if data['action'] == '-':
            data['quantity'] = -1
        else:
            data['quantity'] = 1
        cart['length'] = cart['length'] + data['quantity']
        data.pop('action', None)
        if data['imgUrl'] in cart['items']:
            data['quantity'] = cart['items'][data['imgUrl']
                                             ]['quantity'] + data['quantity']
            cart['items'][data['imgUrl']]['quantity'] = data['quantity']

        else:
            cart['items'][data['imgUrl']] = data
        if cart['items'][data['imgUrl']]['quantity'] == 0:
            cart['items'].pop(data['imgUrl'], None)
            data['quantity'] = 0
        request.session['cart'] = cart
        request.session.modified = True
        return Response(data)


class EmptyCart(APIView):
    def post(self, request):
        if not request.session or not request.session.session_key:
            request.session.save()

        cart = {'length': 0, 'items': {}}

        request.session['cart'] = cart
        request.session.modified = True
        return Response(status=status.HTTP_200_OK)


class GetCart(APIView):
    def get(self, request):
        if not request.session or not request.session.session_key:
            request.session.save()

        data = request.session.get('cart', {'length': 0, 'items': {}})
        return Response(data, content_type="application/json", status=status.HTTP_200_OK)


class PlaceOrder(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        data1 = {
            'user_id': request.user.id,
        }
        serializer1 = OrderSerializer(data=data1)

        if serializer1.is_valid(raise_exception=True):
            serializer1.save()
            items = request.data['items'].values()
            for item in items:
                data2 = {
                    'url': item['imgUrl'],
                    'title': item['title'],
                    'price': item['price'],
                }
                serializer2 = ProductSerializer(data=data2)
                if serializer2.is_valid(raise_exception=True):
                    serializer2.save()
                    data3 = {
                        'order': serializer1.data['id'],
                        'product': serializer2.data['id'],
                        'quantity': item['quantity'],
                    }
                    serializer3 = OrderProductSerializer(data=data3)
                    if serializer3.is_valid(raise_exception=True):
                        serializer3.save()
            return Response(data=items, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class GetOrders(APIView):
    def get(self, request):
        user = request.user
        if user.is_authenticated:
            orders = Order.objects.filter(user_id=user.id)
            _orders = []
            for order in orders:
                _order = []
                _order.append(
                    {'date': order.date.strftime("%d-%m-%Y %H:%M:%S")})
                orderproducts = OrderProduct.objects.filter(order=order.id)
                for orderproduct in orderproducts:
                    product = orderproduct.product
                    _order.append({'imgUrl': product.url, 'title': product.title,
                                  'price': product.price, 'quantity': orderproduct.quantity})
                _orders.append(_order)
            return Response(data=_orders, status=status.HTTP_200_OK)
        return Response(data=[], status=status.HTTP_404_NOT_FOUND)
