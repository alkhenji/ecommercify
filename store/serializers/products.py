from rest_framework import serializers

from store.models.products import *
from store.serializers.stores import *

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        lookup_field = 'slug'
        exclude = ('id',)

class SubcategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Subcategory
        lookup_field = 'slug'
        exclude = ('id',)

    category = CategorySerializer()

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        exclude = ('product',)

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        lookup_field = 'slug'
        exclude = ('id',)

    subcategory = SubcategorySerializer()
    store = StoreSerializer()
