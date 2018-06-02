from django.db import models
from django.utils import timezone

from store.models.products import Product
from store.models.customers import Customer, DeliveryAddress
from store.models.helpers import CurrencyField, Currency

import uuid
import random
import operator


class OrderStatus:
    new = 'n'
    confirmed = 'c'
    delivered = 'd'
    canceled = 'e'
    rejected = 'r'

'''
    Model representation of an Order.
    NOTE: Order must be saved after all related Order Products are saved.
'''
class Order(models.Model):

    order_id = models.IntegerField(unique=True, editable=False, blank=True)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    delivery = models.ForeignKey(DeliveryAddress, on_delete=models.CASCADE)

    date_placed = models.DateTimeField(default=timezone.now)
    date_delivered = models.DateTimeField(blank=True, null=True)

    total_price = CurrencyField()

    private_token = models.UUIDField(default=uuid.uuid4, editable=False)
    public_token = models.UUIDField(default=uuid.uuid4, editable=False)

    def calculate_total_price(self, save=False):
        total_price = Currency()
        for order_product in self.order_product_set.all():
            total_price.op(operator.add, order_product.price)

        if save:
            self.total_price = total_price.value
            self.save(update_fields=['total_price'])

        return total_price.value

    def create_order_id(self):
        return int(str(self.id) + str(random.randint(0, 999)))

    def save(self, *args, **kwargs):
        if not self.total_price:
            self.total_price = self.calculate_total_price()

        super(Order, self).save(*args, **kwargs)

        if not self.order_id:
            self.order_id = self.create_order_id()
            self.save(update_fields=['order_id'])


'''
    Model representation of an Order Product for an Order.
    An Order must have at least one Order Product.
'''
class OrderProduct(models.Model):

    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.SmallIntegerField()

    price = CurrencyField()

    def __str__(self):
        return '{}x {} for {}'.format(self.quantity, str(self.product),
            str(self.price))

'''
    Model representation of a Return Request.
'''
class ReturnRequest(models.Model):

    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)

    date_placed = models.DateTimeField(default=timezone.now)
    date_confirmed = models.DateTimeField(null=True, blank=True)

    completed = models.BooleanField(default=False)
