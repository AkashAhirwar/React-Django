from django.contrib import admin

# Register your models here.
from .models import Order, OrderProduct, Product


class OrderAdmin(admin.ModelAdmin):
    readonly_fields = ('date', )


admin.site.register(Order, OrderAdmin)
admin.site.register(Product)
admin.site.register(OrderProduct)
