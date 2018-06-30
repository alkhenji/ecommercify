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


class CartViewSet(mixins.RetrieveModelMixin, viewsets.GenericViewSet):

    serializer_class = CartSerializer

    def get_queryset(self):
        try:
            if self.request.user.is_authenticated:
                cart = Cart.objects.get(customer=user.customer)
            else:
                cart = Cart.objects.get(session=request.session.session_key)
        except:
            cart = Cart.objects.none()

        return cart
