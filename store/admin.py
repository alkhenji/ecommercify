from django.contrib import admin

from store.models import *

admin.site.register(products.Category)
admin.site.register(products.Subcategory)
admin.site.register(products.Product)
admin.site.register(products.ProductImage)
admin.site.register(products.RelatedProduct)

admin.site.register(stores.Store)

admin.site.register(customers.Customer)
admin.site.register(customers.DeliveryAddress)

admin.site.register(orders.Order)
admin.site.register(orders.OrderProduct)
admin.site.register(orders.ReturnRequest)
admin.site.register(orders.Cart)
admin.site.register(orders.CartProduct)
