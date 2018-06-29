from rest_framework import viewsets, mixins

from store.models.products import *
from store.serializers.products import *
from store.permissions.common import *


class CategoryViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin,
    viewsets.GenericViewSet):

    permission_classes = (ReadOnlyPermission,)
    queryset = Category.objects.all().order_by('name')
    lookup_field = 'slug'
    serializer_class = CategorySerializer


class SubcategoryViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin,
    viewsets.GenericViewSet):

    permission_classes = (ReadOnlyPermission,)
    queryset = Subcategory.objects.all().order_by('name')
    lookup_field = 'slug'
    serializer_class = SubcategorySerializer


class ProductViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin,
    viewsets.GenericViewSet):

    permission_classes = (ReadOnlyPermission,)
    queryset = Product.objects.all().order_by('name')
    lookup_field = 'slug'
    serializer_class = ProductSerializer
