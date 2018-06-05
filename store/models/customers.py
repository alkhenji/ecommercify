from django.db import models
from django.conf import settings


'''
    Model representation of a Customer that shares a one-to-one relationship
    with the defined global User model.
'''
class Customer(models.Model):

    user = models.OneToOneField(settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='customer')

    phone_number = models.CharField(max_length=16, blank=True, null=True)

    registered = models.BooleanField(default=False)
    registered_date = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return '[Customer] {} {}'.format(self.user.first_name,
            self.user.last_name)

    @property
    def full_name(self):
        return '{} {}'.format(self.user.first_name, self.user.last_name)

'''
    Model representation of a Delivery Address that is linked to a Customer.
'''
class DeliveryAddress(models.Model):

    customer = models.ForeignKey(Customer, on_delete=models.CASCADE,
        related_name='delivery_addresses')
    address = models.TextField(blank=True, null=True)
    building = models.SmallIntegerField(blank=True, null=True,
        verbose_name='building number')
    street = models.SmallIntegerField(blank=True, null=True,
        verbose_name='street number')
    zone = models.SmallIntegerField(blank=True, null=True,
        verbose_name='zone number')
    latitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True,
        null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True,
        null=True)
