from rest_framework import viewsets, mixins

from store.models.stores import *
from store.serializers.stores import *
from store.permissions.common import *


class StoreViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin,
    viewsets.GenericViewSet):

    permission_classes = (ReadOnlyPermission,)
    queryset = Store.objects.all()
    lookup_field = 'slug'
    serializer_class = StoreSerializer
