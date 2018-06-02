from django.apps import AppConfig


class StoreConfig(AppConfig):
    name = 'store'

    def ready(self):
        from core.models import User
        User.register_user_type(('customer', 'Customer'))
