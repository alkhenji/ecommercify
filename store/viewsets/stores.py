from rest_framework import viewsets, mixins

from store.models.stores import *
from store.serializers.stores import *
from store.permissions.common import *


class StoreViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin,
    viewsets.GenericViewSet):

    permission_classes = (ReadOnlyPermission,)
    lookup_field = 'slug'
    serializer_class = StoreSerializer

    def get_queryset(self):
        categories = self.request.query_params.getlist('category', None)

        # build Queryset
        stores = Store.objects.all()

        if categories:
            stores = stores.filter(products__subcategory__category__slug__in=categories).distinct()

        return stores.order_by('name')
