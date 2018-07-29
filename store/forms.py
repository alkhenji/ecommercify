from django import forms
from django.contrib.auth import (
    authenticate, get_user_model, password_validation
)
from django.utils import timezone

import re

from store.models.customers import *

UserModel = get_user_model()

class AuthenticationForm(forms.Form):
    '''
    Base class for authenticating users. Mostly copied from built-in Django
    AuthenticationForm class.
    '''

    email = forms.CharField(label='Email', strip=True,
        widget=forms.EmailInput(attrs={'autofocus': 'autofocus',
        'placeholder': 'Email address', 'required': True}))

    password = forms.CharField(label='Password', strip=False,
        widget=forms.PasswordInput(attrs={'placeholder': 'Password',
        'required': True}))

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

class CreateCustomerForm(forms.Form):
    '''
    Form class for creating a Customer. Creates User object and relates it to
    created Customer object.
    '''

    email = forms.CharField(label='Email', strip=True,
        widget=forms.EmailInput(attrs={'autofocus': 'autofocus',
        'placeholder': 'Email address', 'required': True}))

    password1 = forms.CharField(label='Password', strip=False,
        widget=forms.PasswordInput(attrs={'placeholder': 'Password',
        'required': True}))

    password2 = forms.CharField(label='Password', strip=False,
        widget=forms.PasswordInput(attrs={'placeholder': 'Confirm password',
        'required': True}))

    first_name = forms.CharField(label='First name', strip=True,
        widget=forms.TextInput(attrs={'placeholder': 'First name',
        'required': True}))

    last_name = forms.CharField(label='Last name', strip=True,
        widget=forms.TextInput(attrs={'placeholder': 'Last name',
        'required': True}))

    phone_number = forms.CharField(label='Phone number', strip=True,
        widget=forms.TextInput(attrs={'placeholder': 'Phone number',
        'required': True}))

    error_messages = {
        'password_mismatch': 'The two password fields do not match.',
        'account_exists': 'Account already exists. Please sign in instead.',
        'invalid_phonenumber': 'Please enter a valid Qatari phone number'
    }

    def __init__(self, request=None, *args, **kwargs):
        self.user_cache = None
        super().__init__(*args, **kwargs);

        # set the max length for the 'email', 'first_name', 'last_name'
        # and 'phone_number' fields
        self.email_field = UserModel._meta.get_field(UserModel.EMAIL_FIELD)
        self.fields['email'].max_length = self.email_field.max_length or 254

        # TODO: FINISH ME

    def clean(self):
        email = self.cleaned_data.get('email')

        try:
            user = UserModel.objects.get(email=email)
            raise self.get_account_exists_error()
        except UserModel.DoesNotExist:
            pass

        return self.cleaned_data

    def clean_password2(self):
        password1 = self.cleaned_data.get('password1')
        password2 = self.cleaned_data.get('password2')

        if password1 and password2 and password1 != password2:
            raise self.get_password_mismatch_error()
        return password2

    def clean_phone_number(self):
        phone_number = self.cleaned_data.get('phone_number')
        phone_number = re.sub('[^0-9]', '', phone_number)
        phone_number = phone_number[-8:]
        return phone_number

    def _post_clean(self):
        super()._post_clean()
        # Validate the password after self.instance is updated with form data
        # by super().
        password = self.cleaned_data.get('password2')
        if password:
            try:
                password_validation.validate_password(password)
            except forms.ValidationError as error:
                self.add_error('password2', error)

    def save(self, commit=True):
        user = UserModel(username=self.cleaned_data['email'],
            email=self.cleaned_data['email'],
            first_name=self.cleaned_data['first_name'],
            last_name=self.cleaned_data['last_name'])
        user.set_password(self.cleaned_data['password2'])
        if commit:
            user.save()
            user.refresh_from_db()
            self.user_cache = user

        customer = Customer(user=user,
            phone_number=self.cleaned_data['phone_number'],
            registered=True,
            registered_date=timezone.now())
        if commit:
            customer.save()

        return customer

    def get_user(self):
        return self.user_cache

    def get_password_mismatch_error(self):
        return forms.ValidationError(
            self.error_messages['password_mismatch'],
            code='password_mismatch'
        )

    def get_account_exists_error(self):
        return forms.ValidationError(
            self.error_messages['account_exists'],
            code='account_exists'
        )
