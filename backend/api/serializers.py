from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Recipe, FoodStatus, Friendship


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = ['id']


class RecipeSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    author_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source='author',
        write_only=True,
        required=False
    )

    class Meta:
        model = Recipe
        fields = [
            'id', 'author', 'author_id', 'title', 'description',
            'ingredients', 'instructions', 'image_url', 'visibility',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class FoodStatusSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    author_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source='author',
        write_only=True,
        required=False
    )

    class Meta:
        model = FoodStatus
        fields = [
            'id', 'author', 'author_id', 'content', 'image_url',
            'visibility', 'created_at', 'expires_at'
        ]
        read_only_fields = ['id', 'created_at']


class FriendshipSerializer(serializers.ModelSerializer):
    requester = UserSerializer(read_only=True)
    addressee = UserSerializer(read_only=True)

    class Meta:
        model = Friendship
        fields = [
            'id', 'requester', 'addressee', 'status',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

