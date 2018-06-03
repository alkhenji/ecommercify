from django.db import models
from django.utils import timezone

from store.models.products import *
from store.models.customers import *
from store.models.helpers import *

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

    order_id = models.IntegerField(unique=True, editable=False, blank=True,
        null=True)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    delivery = models.ForeignKey(DeliveryAddress, on_delete=models.CASCADE)

    date_placed = models.DateTimeField(default=timezone.now)
    date_delivered = models.DateTimeField(blank=True, null=True)

    total_price = CurrencyField()

    private_token = models.UUIDField(default=uuid.uuid4, editable=False)
    public_token = models.UUIDField(default=uuid.uuid4, editable=False)

    def __str__(self):
        return '#{} {}, {} QAR'.format(self.order_id, str(self.customer),
            self.total_price)

    def calculate_total_price(self, save=False):
        total_price = Currency()
        for op in self.order_products.all():
            op_total = Currency(op.price)
            op_total.op(operator.mul, op.quantity)
            total_price.op(operator.add, op_total.value)

        if save:
            self.total_price = total_price.value
            self.save(update_fields=['total_price'])

        return total_price.value

    def create_order_id(self):
        return int(str(self.id) + str(random.randint(0, 999)))

    def save(self, *args, **kwargs):
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

    order = models.ForeignKey(Order, on_delete=models.CASCADE,
        related_name='order_products')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.SmallIntegerField()

    price = CurrencyField()

    def __str__(self):
        return '{}x {} for {} QAR'.format(self.quantity, str(self.product),
            self.price)

'''
    Model representation of a Return Request.
'''
class ReturnRequest(models.Model):

    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)

    date_placed = models.DateTimeField(default=timezone.now)
    date_confirmed = models.DateTimeField(null=True, blank=True)

    completed = models.BooleanField(default=False)
