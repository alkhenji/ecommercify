from rest_framework import viewsets, mixins

from store.models.orders import *
from store.serializers.orders import *
from store.permissions.orders import *


class OrderViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin,
    viewsets.GenericViewSet):

    permission_classes = (OrderPermission,)
    lookup_field = 'order_id'
    serializer_class = OrderSerialzer

    def get_queryset(self):
        user = self.request.user
        try:
            return Order.objects.filter(customer=user.customer)
        except:
            pass
        return Order.objects.none()
