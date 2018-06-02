from django.db import models
from django.contrib.auth.models import AbstractUser


'''
    This model behaves identically to the default Django User model.
    This model allows for future customization of the User model.
    It would be much more difficult to do so mid-proiject after initial
    migrations.
'''
class User(AbstractUser):
    USER_TYPES = []

    def __str__(self):
        for ut in self.USER_TYPES:
            if hasattr(self, ut[0]):
                return '[{}] {}'.format(ut[1], self.username)

        return self.username

    @classmethod
    def register_user_type(cls, user_type):
        if not user_type[0] in list(map(lambda x: x[0], cls.USER_TYPES)):
            cls.USER_TYPES.append(user_type)
