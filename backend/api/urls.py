from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'users', views.UserViewSet, basename='user')
router.register(r'recipes', views.RecipeViewSet, basename='recipe')
router.register(r'food-statuses', views.FoodStatusViewSet, basename='foodstatus')
router.register(r'friendships', views.FriendshipViewSet, basename='friendship')

urlpatterns = [
    path('', include(router.urls)),
]


