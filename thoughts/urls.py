from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ThoughtViewSet

router = DefaultRouter()
router.register(r'thoughts', ThoughtViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
