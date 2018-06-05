from rest_framework import serializers

from store.models.products import *
from store.serializers.stores import *


class SubcategorySerializerForCategory(serializers.ModelSerializer):
    class Meta:
        model = Subcategory
        exclude = ('id', 'category')


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        lookup_field = 'slug'
        exclude = ('id',)

    subcategories = SubcategorySerializerForCategory(many=True)


class CategorySerializerForSubcategory(serializers.ModelSerializer):
    class Meta:
        model = Category
        exclude = ('id',)


class SubcategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Subcategory
        lookup_field = 'slug'
        exclude = ('id',)

    category = CategorySerializerForSubcategory()


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
