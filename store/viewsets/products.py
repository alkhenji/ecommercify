from rest_framework import viewsets, mixins

from store.models.products import *
from store.serializers.products import *
from store.permissions.common import *


class CategoryViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin,
    viewsets.GenericViewSet):

    permission_classes = (ReadOnlyPermission,)
    lookup_field = 'slug'
    serializer_class = CategorySerializer

    def get_queryset(self):
        # get category
        store = self.request.query_params.get('store', None)

        # build QuerySet
        categories = Category.objects.all()

        if store:
            categories = categories.filter(subcategories__products__store__slug=store)

        return categories.order_by('name')


class SubcategoryViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin,
    viewsets.GenericViewSet):

    permission_classes = (ReadOnlyPermission,)
    queryset = Subcategory.objects.all().order_by('name')
    lookup_field = 'slug'
    serializer_class = SubcategorySerializer


class ProductViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin,
    viewsets.GenericViewSet):

    permission_classes = (ReadOnlyPermission,)
    lookup_field = 'slug'
    serializer_class = ProductSerializer

    def get_queryset(self):
        # get category, subcategory and store filters
        category = self.request.query_params.get('category', None)
        subcategory = self.request.query_params.get('subcategory', None)
        store = self.request.query_params.get('store', None)

        # build QuerySet
        products = Product.objects.filter(hidden=False)

        if subcategory:
            products = products.filter(subcategory__slug=subcategory)

        elif category:
            products = products.filter(subcategory__category__slug=category)

        if store:
            products = products.filter(store__slug=store)

        return products.order_by('name')
