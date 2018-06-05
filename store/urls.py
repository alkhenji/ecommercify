from django.urls import re_path
from store.views import IndexPageView

urlpatterns = [
    re_path(r'', IndexPageView.as_view(), name='index')
]
