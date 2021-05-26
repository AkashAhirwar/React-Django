from django.db import models
from django.contrib.auth.models import User


# Create your models here.
class Order(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)


class Product(models.Model):
    url = models.CharField(max_length=2048)
    title = models.CharField(max_length=512)
    price = models.IntegerField(null=False)


class OrderProduct(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
