from rest_framework import viewsets, mixins
from rest_framework.response import Response
from rest_framework.decorators import action

from store.models.customers import *
from store.serializers.customers import *
from store.permissions.customers import *


class CustomerViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin,
    viewsets.GenericViewSet):

    permission_classes = (CustomerPermission,)
    serializer_class = CustomerSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            return Customer.get_by_user(user)
        return Customer.objects.none()

    @action(methods=['GET'], detail=False)
    def current(self, request, pk=None):
        user = request.user
        if user.is_authenticated:
            serializer = CustomerUserOnlySerializer(Customer.get_by_user(user))
            return Response(serializer.data)
        return Response({})


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
