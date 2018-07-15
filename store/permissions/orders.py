from rest_framework import permissions

class OrderPermission(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.is_superuser:
            return True
        try:
            return obj.customer.id == request.user.customer.id
        except:
            return False

class CartProductPermission(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if obj.cart.customer:
            if request.user.is_authenticated:
                return obj.cart.customer.id == request.user.customer.id
            return False

        if obj.cart.session:
            return obj.cart.session == request.session.session_key

        return False
