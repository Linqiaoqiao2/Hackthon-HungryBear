from django.contrib import admin
from .models import Recipe, FoodStatus, Friendship


@admin.register(Recipe)
class RecipeAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'visibility', 'created_at']
    list_filter = ['visibility', 'created_at']
    search_fields = ['title', 'description']


@admin.register(FoodStatus)
class FoodStatusAdmin(admin.ModelAdmin):
    list_display = ['author', 'content', 'visibility', 'created_at']
    list_filter = ['visibility', 'created_at']
    search_fields = ['content']


@admin.register(Friendship)
class FriendshipAdmin(admin.ModelAdmin):
    list_display = ['requester', 'addressee', 'status', 'created_at']
    list_filter = ['status', 'created_at']
