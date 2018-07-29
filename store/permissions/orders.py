from rest_framework import permissions
from django.contrib.sessions.models import Session

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
            # store session if it's still new and hasn't been stored in db
            if not request.session.exists(request.session.session_key):
                request.session.create()

            session = Session.objects.get(
                session_key=request.session.session_key)

            return obj.cart.session == session

        return False
