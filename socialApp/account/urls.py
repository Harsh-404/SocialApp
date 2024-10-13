
from django.urls import path
from socialApp import views
urlpatterns = [
    path('', views.Home, name='Home'),
]
