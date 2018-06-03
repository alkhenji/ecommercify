from rest_framework import viewsets

from store.models.customers import *
from store.serializers.customers import *


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    lookup_field = 'id'
    serializer_class = CustomerSerializer


class DeliveryAddressViewSet(viewsets.ModelViewSet):
    queryset = DeliveryAddress.objects.all()
    lookup_field = 'id'
    serializer_class = DeliveryAddressSerializer
