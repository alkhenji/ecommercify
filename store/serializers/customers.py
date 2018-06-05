from rest_framework import serializers

from store.models.customers import *
from core.serializers import *

class DeliveryAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliveryAddress
        lookup_field = 'id'
        exclude = ('customer',)


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        lookup_field = 'id'
        fields = '__all__'

    user = UserSerializer()
    delivery_addresses = DeliveryAddressSerializer(many=True)
