from django.urls import path, include, re_path

from rest_framework import routers

from store.views import IndexPageView
from store.viewsets import *

router = routers.DefaultRouter()

router.register(r'products', products.ProductViewSet, base_name='products')
router.register(r'categories', products.CategoryViewSet, base_name='categories')
router.register(r'stores', stores.StoreViewSet, base_name='stores')
router.register(r'customers', customers.CustomerViewSet, base_name='customers')
router.register(r'orders', orders.OrderViewSet, base_name='orders')

urlpatterns = [
    # REST framework
    path('api-v1/', include(router.urls)),
    # Should be last because matches everything
    re_path(r'', IndexPageView.as_view(), name='index')
]
