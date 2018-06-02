from django.urls import path
from store.views import IndexPageView

urlpatterns = [
    path('', IndexPageView.as_view(), name='index')
]
