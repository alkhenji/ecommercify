from rest_framework import viewsets

from store.models.orders import *
from store.serializers.orders import *


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    lookup_field = 'order_id'
    serializer_class = OrderSerialzer
