from rest_framework import permissions

class OrderPermission(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.is_superuser:
            return True
        try:
            return obj.customer.id == request.user.customer.id
        except:
            return False
