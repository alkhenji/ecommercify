from django.db import models

from store.utils import *
from store.models.helpers import *
from store.models.stores import *


'''
    Model representation of a Category.
    A Category *should* have at least one Subcategory.
'''
class Category(models.Model):

    class Meta:
        verbose_name_plural = 'categories'

    name = models.CharField(max_length=128)
    # TODO: use Django admin prepopulated_fields to fill out slugs
    slug = models.SlugField(max_length=160, editable=False, unique=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = get_unique_slug(self, 'name', 'slug')

        super(Category, self).save(*args, **kwargs)

'''
    Model representation of a Subcategory.
    A Subcategory has exactly one parent Category.
'''
class Subcategory(models.Model):

    class Meta:
        verbose_name_plural = 'subcategories'

    name = models.CharField(max_length=128)
    category = models.ForeignKey(Category, related_name='subcategories',
        on_delete=models.CASCADE)
    slug = models.SlugField(max_length=160, editable=False, unique=True)

    def __str__(self):
        return '{} - {}'.format(self.name, str(self.category))

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = get_unique_slug(self, 'name', 'slug')

        super(Subcategory, self).save(*args, **kwargs)

'''
    Model representation of a Product.
    A Product has exactly one Subcategory that leads to exactly one Category.
    A Product has exactly one Store.
'''
class Product(models.Model):

    name = models.CharField(max_length=256)
    slug = models.SlugField(max_length=288, editable=False, unique=True)

    subcategory = models.ForeignKey(Subcategory, related_name='products',
        on_delete=models.CASCADE)
    store = models.ForeignKey(Store, related_name='products',
        on_delete=models.CASCADE)
    description = models.TextField(blank=True)
    price = CurrencyField()
    quantity = models.SmallIntegerField(default=0)

    thumbnail = models.ForeignKey('ProductImage', related_name='thumbnail_product',
        blank=True, null=True, on_delete=models.SET_NULL)

    hidden = models.BooleanField(default=False)

    def __str__(self):
        return '{}, {}, {} QAR'.format(self.name, str(self.store), str(self.price))

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = get_unique_slug(self, 'name', 'slug')

        super(Product, self).save(*args, **kwargs)

'''
    Model representation of a Product Image for a Product.
    A Product can have zero or many Product Images.
    A Product can have a foreign key to a Product Image called _thumbnail_.
    Upon save if the Product doesn't have a thumbnail assigned, a Product Image
    instance will assign itself as the Product's thumbnail.
'''
class ProductImage(models.Model):

    product = models.ForeignKey(Product, related_name='product_images',
        on_delete=models.CASCADE)
    image = models.ImageField(upload_to=get_product_image_upload_path)

    def __str__(self):
        return '{} - {}'.format(str(self.product), self.pk)

    def save(*args, **kwargs):
        super(ProductImage, self).save(*args, **kwargs)

        # TODO: check that this doesn't cause any weird behavior in the admin
        if not self.product.thumbnail:
            self.product.thumbnail = self
            self.product.save(update_fields=['thumbnail'])

'''
    Model representation of a Related Product for a Product.
    A Product can have zero or many Related Products.
'''
class RelatedProduct(models.Model):

    product = models.ForeignKey(Product, related_name='related_products',
        on_delete=models.CASCADE)
    related = models.ForeignKey(Product, on_delete=models.CASCADE)

    def __str__(self):
        return '{} -> {}'.format(str(self.product), str(self.related))
