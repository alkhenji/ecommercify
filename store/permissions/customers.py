from rest_framework import permissions

class CustomerPermission(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.is_superuser:
            return True
        try:
            return obj.id == request.user.customer.id
        except:
            return False

class DeliveryAddressPermission(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.is_superuser:
            return True
        try:
            return obj.customer.id == request.user.customer.id
        except:
            return False
