from rest_framework import viewsets

from store.models.stores import *
from store.serializers.stores import *


class StoreViewSet(viewsets.ModelViewSet):
    queryset = Store.objects.all()
    lookup_field = 'slug'
    serializer_class = StoreSerializer
