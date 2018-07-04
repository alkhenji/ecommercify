from rest_framework import viewsets, mixins
from rest_framework.response import Response
from rest_framework.decorators import action


from store.models.orders import *
from store.serializers.orders import *
from store.permissions.orders import *


class OrderViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin,
    viewsets.GenericViewSet):

    permission_classes = (OrderPermission,)
    lookup_field = 'order_id'
    serializer_class = OrderSerialzer

    def get_queryset(self):
        user = self.request.user
        try:
            return Order.objects.filter(customer=user.customer)
        except:
            pass
        return Order.objects.none()


class CartProductViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin,
    mixins.DestroyModelMixin, viewsets.GenericViewSet):

    permission_classes = (CartProductPermission,)
    serializer_class = CartProductSerializer

    def get_queryset(self):
        cart = Cart.get_using_request(self.request)
        if cart:
            return CartProduct.objects.filter(cart=cart)
        return CartProduct.objects.none()

    def create(self, request):
        cart = Cart.get_using_request(request)
        product = Product.objects.get(slug=request.POST['product'])
        quantity = request.POST['quantity']

        CartProduct.objects.create(cart=cart,
            product=product,
            quantity=quantity)

        return Response({'status': 'Success'})

    @action(methods=['POST'], detail=True)
    def update_quantity(self, request, pk=None):
        cart_product = self.get_object()
        quantity = request.POST['quantity']
        cart_product.update_quantity(quantity)

        return Response({'status': 'Success'})
