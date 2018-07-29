from django.db import models
from django.utils import timezone
from django.contrib.sessions.models import Session

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

    token = models.UUIDField(default=uuid.uuid4, editable=False)

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


'''
    Model representation of a Cart.
'''
class Cart(models.Model):

    customer = models.OneToOneField(Customer, null=True, blank=True,
        on_delete=models.CASCADE)
    session = models.OneToOneField(Session, null=True, blank=True,
        on_delete=models.CASCADE)

    def __str__(self):
        return '{}/{}'.format(self.customer, self.session)

    @classmethod
    def create_by_user_or_session(cls, request):

        if request.user.is_authenticated:
            return cls.objects.create(customer=request.user.customer)

        else:
            # store session if it's still new and hasn't been stored in db
            if not request.session.exists(request.session.session_key):
                request.session.create()

            session = Session.objects.get(
                session_key=request.session.session_key)

            return cls.objects.create(session=session)

    @classmethod
    def get_by_user_or_session(cls, request):

        if request.user.is_authenticated:
            return cls.get_by_user(request.user)
        else:
            return cls.get_by_session(request)

    @classmethod
    def get_by_user(cls, user):
        try:
            return cls.objects.get(customer=user.customer)
        except:
            return None

    @classmethod
    def get_by_session(cls, request):
        # store session if it's still new and hasn't been stored in db
        if not request.session.exists(request.session.session_key):
            request.session.create()

        session = Session.objects.get(
            session_key=request.session.session_key)

        try:
            return cls.objects.get(session=session)
        except:
            return None

    def merge_cart(self, second_cart):
        if not second_cart:
            return

        # merge second cart into this cart
        # merging rules:
        # 1. if product only exists in second cart, move it to this cart
        # 2. if product exists in both, copy over the quantity
        for second_cp in second_cart.cart_products.all():
            try:
                first_cp = self.cart_products.get(product=second_cp.product)
                first_cp.update_quantity(second_cp.quantity)
            except:
                second_cp.change_cart(self)

        # delete cart - this will delete related cart products too
        second_cart.delete()


'''
    Model representation of a Cart Product for a Cart.
'''
class CartProduct(models.Model):

    cart = models.ForeignKey(Cart, on_delete=models.CASCADE,
        related_name='cart_products', null=False)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=False)
    quantity = models.SmallIntegerField()

    class Meta:
        unique_together = ('cart', 'product')

    def __str__(self):
        return '{}x {}'.format(self.quantity, self.product)

    def change_cart(self, cart):
        if cart:
            self.cart = cart
            self.save(update_fields=['cart'])

    def update_quantity(self, quantity):
        if int(quantity) > 0:
            self.quantity = quantity
            self.save(update_fields=['quantity'])
        else:
            self.delete()

    def save(self, *args, **kwargs):
        # cart product quantity upperbound set by available product quantity
        if int(self.quantity) > self.product.quantity:
            self.quantity = self.product.quantity

        elif int(self.quantity) <= 0 and self.product.quantity > 0:
            self.quantity = 1

        if int(self.quantity) != 0:
            super(CartProduct, self).save(*args, **kwargs)
