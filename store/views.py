from django.shortcuts import render
from django.views.generic import TemplateView

class IndexPageView(TemplateView):
    def get(self, request, *args, **kwargs):
        return render(request, 'index.html')
