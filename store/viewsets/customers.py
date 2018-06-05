from rest_framework import viewsets, mixins

from store.models.customers import *
from store.serializers.customers import *
from store.permissions.customers import *


class CustomerViewSet(mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    permission_classes = (CustomerPermission,)
    lookup_field = 'id'
    serializer_class = CustomerSerializer

    def get_queryset(self):
        user = self.request.user
        try:
            if user.is_superuser:
                return Customer.objects.all()
            else:
                return Customer.objects.get(customer=user.customer)
        except:
            pass
        return Customer.objects.none()


class DeliveryAddressViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin,
    viewsets.GenericViewSet):

    permission_classes = (DeliveryAddressPermission,)
    lookup_field = 'id'
    serializer_class = DeliveryAddressSerializer

    def get_queryset(self):
        user = self.request.user
        try:
            if user.is_superuser:
                return DeliveryAddress.objects.all()
            else:
                return DeliveryAddress.objects.filter(customer.user.customer)
        except:
            pass
        return DeliveryAddress.objects.none()
