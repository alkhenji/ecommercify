from rest_framework import serializers

from store.models.stores import *

class StoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Store
        lookup_field = 'slug'
        exclude = ('id',)
