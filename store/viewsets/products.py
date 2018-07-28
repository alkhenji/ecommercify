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
        stores = self.request.query_params.getlist('store', None)

        # build QuerySet
        categories = Category.objects.all()

        if stores:
            categories = categories.filter(subcategories__products__store__slug__in=stores)

        return categories.order_by('name')


class SubcategoryViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin,
    viewsets.GenericViewSet):

    permission_classes = (ReadOnlyPermission,)
    lookup_field = 'slug'
    serializer_class = SubcategorySerializer

    def get_queryset(self):
        # get subcategory
        stores = self.request.query_params.getlist('store', None)

        # build QuerySet
        subcategories = Subcategory.objects.all()

        if stores:
            subcategories = subcategories.filter(products__store__slug__in=stores)

        return subcategories.order_by('name')


class ProductViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin,
    viewsets.GenericViewSet):

    permission_classes = (ReadOnlyPermission,)
    lookup_field = 'slug'
    serializer_class = ProductSerializer

    def get_queryset(self):
        # get category, subcategory and store filters
        categories = self.request.query_params.getlist('category', None)
        subcategories = self.request.query_params.getlist('subcategory', None)
        stores = self.request.query_params.getlist('store', None)

        # build QuerySet
        products = Product.objects.filter(hidden=False)

        if subcategories:
            products = products.filter(subcategory__slug__in=subcategories)

        elif categories:
            products = products.filter(subcategory__category__slug__in=categories)

        if stores:
            products = products.filter(store__slug__in=stores)

        return products.order_by('name')
