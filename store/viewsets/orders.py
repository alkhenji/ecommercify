from rest_framework import viewsets, mixins, status
from rest_framework.response import Response
from rest_framework.decorators import action


from store.models.orders import *
from store.serializers.orders import *
from store.permissions.orders import *


class OrderViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin,
    viewsets.GenericViewSet):

    permission_classes = (OrderPermission,)
    lookup_field = 'order_id'
    serializer_class = OrderSerializer

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
        cart = Cart.get_by_user_or_session(self.request)
        if cart:
            return CartProduct.objects.filter(cart=cart).order_by('pk')
        return CartProduct.objects.none()

    def create(self, request):
        try:
            cart = Cart.get_by_user_or_session(request)
            if not cart:
                cart = Cart.create_by_user_or_session(request)

            product = Product.objects.get(slug=request.POST['product'])
            quantity = request.POST['quantity']

            cp = CartProduct.objects.create(cart=cart,
                product=product,
                quantity=quantity)

            updated_cart_products = CartProduct.objects.filter(cart=cart).order_by('pk')
            serializer = self.get_serializer(updated_cart_products, many=True)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            print(e)
            return Response(
                {'status': 'Failed to add product to cart'},
                status=status.HTTP_400_BAD_REQUEST
            )

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            self.perform_destroy(instance)
        except Http404:
            return Response(
                {'status': 'Failed to remove product from cart'},
                status=status.HTTP_404_NOT_FOUND
            )
        cart = Cart.get_by_user_or_session(request)
        updated_cart_products = CartProduct.objects.filter(cart=cart).order_by('pk')
        serializer = self.get_serializer(updated_cart_products, many=True)
        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    @action(methods=['POST'], detail=True)
    def update_quantity(self, request, pk=None):
        cart_product = self.get_object()
        quantity = request.POST['quantity']
        cart_product.update_quantity(quantity)

        cart = Cart.get_by_user_or_session(self.request)
        updated_cart_products = CartProduct.objects.filter(cart=cart).order_by('pk')
        serializer = self.get_serializer(updated_cart_products, many=True)
        return Response(serializer.data)
