from django.db import models

from store.utils import get_unique_slug
from store.models.helpers import get_store_upload_path


'''
    Model representation of a Store.
'''
class Store(models.Model):

    name = models.CharField(max_length=128)
    slug = models.SlugField(max_length=160, editable=False)

    image = models.ImageField(upload_to=get_store_upload_path, blank=True,
        null=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = get_unique_slug(self, 'name', 'slug')

        super(Store, self).save(*args, **kwargs)
