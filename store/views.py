from django.shortcuts import render, redirect
from django.views.generic import TemplateView, View
from django.views.generic.edit import FormView
from django.utils.decorators import method_decorator
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import csrf_protect
from django.contrib.auth import login, logout

from store.forms import AuthenticationForm

from store.models.orders import Cart

class IndexPageView(TemplateView):
    def get(self, request):

        return render(request, 'index.html')


class SignInPageView(TemplateView):
    def get(self, request):

        if request.user.is_authenticated:
            return redirect('/')

        form = AuthenticationForm()
        return render(request, 'signin.html', {'form': form})

    @method_decorator(csrf_protect)
    @method_decorator(never_cache)
    def post(self, request):

        if request.user.is_authenticated:
            return redirect('/')

        form = AuthenticationForm(data=request.POST)
        if form.is_valid():

            user = form.get_user()
            user_cart = Cart.get_by_user(user)
            session_cart = Cart.get_by_session(request)

            # create user cart if there is none
            if not user_cart:
                user_cart = Cart.objects.create(customer=user.customer)

            # merge user cart with session cart
            user_cart.merge_cart(session_cart)

            # login the user
            login(request, user)

            return redirect('/')

        return render(request, 'signin.html', {'form': form})

class SignOutView(View):
    def get(self, request):
        logout(request)
        return redirect('/')

class SignUpPageView(TemplateView):
    def get(self, request):

        if request.user.is_authenticated:
            return redirect('/')

        return render(request, 'signup.html')
