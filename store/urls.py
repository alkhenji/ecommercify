from django.urls import path, include, re_path
# from django.contrib.auth import views as auth_views

from django.conf import settings
from django.conf.urls.static import static

from rest_framework import routers

from store.views import *
from store.viewsets import *

router = routers.DefaultRouter()

router.register(r'products', products.ProductViewSet, base_name='products')
router.register(r'categories', products.CategoryViewSet, base_name='categories')
router.register(r'subcategories', products.SubcategoryViewSet, base_name='subcategories')
router.register(r'stores', stores.StoreViewSet, base_name='stores')
router.register(r'customers', customers.CustomerViewSet, base_name='customers')
router.register(r'orders', orders.OrderViewSet, base_name='orders')
router.register(r'cart', orders.CartProductViewSet, base_name='cart')

urlpatterns = [
    # REST framework
    path('api-v1/', include(router.urls)),

    # path('signin', SignInPageView.as_view(), name='signin'),

    path('signin', SignInPageView.as_view(), name='signin'),
    path('signup', SignUpPageView.as_view(), name='signup'),

    # Should be last because matches everything
    re_path(r'', IndexPageView.as_view(), name='index')
]

# Add urls to media files when in development to serve them
# Production images should be hosted somewhere else
if settings.DEBUG:
    urlpatterns = static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) + urlpatterns
