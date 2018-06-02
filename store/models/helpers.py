from django.db import models
from django.forms import FloatField

import decimal
import uuid


'''
    Field representation of Currency.
'''
class CurrencyField(models.DecimalField):

    set_currency = 'QAR'

    def __init__(self, *args, **kwargs):
        kwargs['max_digits'] = 9
        kwargs['decimal_places'] = 2
        kwargs['help_text'] = 'in {}'.format(self.set_currency)

        super(CurrencyField, self).__init__(*args, **kwargs)

'''
    Class that performs Currency operations.
'''
class Currency:
    def __init__(self, value=0):
        self.value = decimal.Decimal(value)

    def op(self, operator, value):
        self.value = operator(self.value, decimal.Decimal(value))

def get_product_image_upload_path(instance, filename):
    return 'products/{}_{}'.format(uuid.uuid1(), filename)

def get_store_upload_path(instance, filename):
    return 'stores/{}_{}'.format(uuid.uuid1(), filename)
