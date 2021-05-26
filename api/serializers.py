from django.db.models import fields
from django.db.models.base import Model
from rest_framework import serializers, status
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import Order, Product, OrderProduct


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'password',
                  'email', 'first_name', 'last_name')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(username=validated_data['username'], email=validated_data['email'], password=validated_data['password'],
                                        first_name=validated_data['first_name'], last_name=validated_data['last_name'])
        user.save()

        return user


class OrderSerializer(serializers.ModelSerializer):

    class Meta:
        model = Order
        fields = '__all__'

    def create(self, validated_data):
        order = self.Meta.model(**validated_data)
        order.save()

        return order


class ProductSerializer(serializers.ModelSerializer):

    class Meta:
        model = Product
        fields = '__all__'

    def create(self, validated_data):

        product = Product.objects.filter(url=validated_data['url']).first()
        if product is None:
            product = self.Meta.model(**validated_data)
            product.save()

        return product


class OrderProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderProduct
        fields = '__all__'

    def create(self, validated_data):
        orderProduct = self.Meta.model(**validated_data)
        orderProduct.save()

        return orderProduct
