from rest_framework import serializers

from store.models.orders import *
from store.serializers.products import *
from store.serializers.customers import *


class OrderProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderProduct
        lookup_field = 'id'
        exclude = ('id', 'order')

    product = ProductSerializer()

class OrderSerialzer(serializers.ModelSerializer):
    class Meta:
        model = Order
        lookup_field = 'order_id'
        exclude = ('id',)

    order_products = OrderProductSerializer(many=True)
    customer = CustomerSerializer()
    delivery = DeliveryAddressSerializer()

class CartProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartProduct
        exclude = ('id', 'cart')

    product = ProductSerializer()

class CartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cart
        exclude = ('id',)

    cart_products = CartProductSerializer(many=True)
