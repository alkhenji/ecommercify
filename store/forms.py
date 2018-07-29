from django import forms
from django.contrib.auth import authenticate, get_user_model

UserModel = get_user_model()

class AuthenticationForm(forms.Form):
    '''
    Base class for authenticating users. Mostly copied from built-in Django
    AuthenticationForm class.
    '''

    email = forms.CharField(label='Email', strip=True,
        widget=forms.EmailInput(attrs={'autofocus': 'autofocus',
        'placeholder': 'Email address'}))

    password = forms.CharField(label='Password', strip=False,
        widget=forms.PasswordInput(attrs={'placeholder': 'Password'}))

    error_messages = {
        'invalid_login': 'Please enter a correct %(email)s and password. \
            Note that both fields may be case-sensitive.',
        'inactive': 'This account is inactive.'
    }

    def __init__(self, request=None, *args, **kwargs):
        '''
        The 'request' parameter is set for custom auth use by subclasses.
        The form data comes in via the standard "data" kwarg.
        '''
        self.request = request
        self.user_cache = None
        super().__init__(*args, **kwargs)

        # set the max length and label for the 'email' field
        self.email_field = UserModel._meta.get_field(UserModel.EMAIL_FIELD)
        self.fields['email'].max_length = self.email_field.max_length or 254


    def clean(self):
        email = self.cleaned_data.get('email')
        password = self.cleaned_data.get('password')

        if email is not None and password:
            try:
                user = UserModel.objects.get(email=email)
            except:
                raise self.get_invalid_login_error()

            self.user_cache = authenticate(self.request,
                username=user.username, password=password)

            if self.user_cache is None:
                raise self.get_invalid_login_error()
            else:
                self.confirm_login_allowed(self.user_cache)

        return self.cleaned_data

    def confirm_login_allowed(self, user):
        '''
        Controls whether the given User may log in. This is a policy setting,
        independent of end-user authentication. This default behavior is to
        allow login by active users, and reject login by inactive users.

        If the given user cannot log in, this method should raise a
        ``forms.ValidationError``.

        If the given user may log in, this method should return None.
        '''
        if not user.is_active:
            raise forms.ValidationError(
                self.error_messages['inactive'],
                code='inactive'
            )

    def get_user(self):
        return self.user_cache

    def get_invalid_login_error(self):
        return forms.ValidationError(
            self.error_messages['invalid_login'],
            code='invalid_login',
            params={'email': self.email_field.verbose_name}
        )
