from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.db.models import Q
from .models import Recipe, FoodStatus, Friendship
from .serializers import (
    UserSerializer, RecipeSerializer, FoodStatusSerializer, FriendshipSerializer
)


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for viewing users"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


class RecipeViewSet(viewsets.ModelViewSet):
    """ViewSet for managing recipes with visibility logic"""
    serializer_class = RecipeSerializer
    permission_classes = [permissions.AllowAny]  # Temporarily allow unauthenticated access for development

    def get_queryset(self):
        user = self.request.user
        queryset = Recipe.objects.all()

        # Filter by visibility
        # If user is not authenticated, only show public recipes
        if not user.is_authenticated:
            return queryset.filter(visibility='public')
        
        visibility_filter = Q(visibility='public') | Q(author=user)
        
        # Friends visibility
        friendships = Friendship.objects.filter(
            Q(requester=user, status='accepted') | Q(addressee=user, status='accepted')
        )
        friend_ids = []
        for friendship in friendships:
            if friendship.requester_id == user.id:
                friend_ids.append(friendship.addressee_id)
            else:
                friend_ids.append(friendship.requester_id)
        if friend_ids:
            visibility_filter |= Q(visibility='friends', author_id__in=friend_ids)
        
        # Friends network visibility (friends of friends)
        if friend_ids:
            network_friendships = Friendship.objects.filter(
                Q(requester_id__in=friend_ids, status='accepted') |
                Q(addressee_id__in=friend_ids, status='accepted')
            )
            network_ids = []
            for friendship in network_friendships:
                if friendship.requester_id in friend_ids and friendship.addressee_id not in friend_ids:
                    network_ids.append(friendship.addressee_id)
                elif friendship.addressee_id in friend_ids and friendship.requester_id not in friend_ids:
                    network_ids.append(friendship.requester_id)
            if network_ids:
                visibility_filter |= Q(visibility='friends_network', author_id__in=network_ids)

        return queryset.filter(visibility_filter)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class FoodStatusViewSet(viewsets.ModelViewSet):
    """ViewSet for managing food statuses/stories with visibility logic"""
    serializer_class = FoodStatusSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = FoodStatus.objects.all()

        # Filter by visibility
        visibility_filter = Q(visibility='public') | Q(author=user)
        
        # Friends visibility
        friendships = Friendship.objects.filter(
            Q(requester=user, status='accepted') | Q(addressee=user, status='accepted')
        )
        friend_ids = []
        for friendship in friendships:
            if friendship.requester_id == user.id:
                friend_ids.append(friendship.addressee_id)
            else:
                friend_ids.append(friendship.requester_id)
        if friend_ids:
            visibility_filter |= Q(visibility='friends', author_id__in=friend_ids)
        
        # Friends network visibility
        if friend_ids:
            network_friendships = Friendship.objects.filter(
                Q(requester_id__in=friend_ids, status='accepted') |
                Q(addressee_id__in=friend_ids, status='accepted')
            )
            network_ids = []
            for friendship in network_friendships:
                if friendship.requester_id in friend_ids and friendship.addressee_id not in friend_ids:
                    network_ids.append(friendship.addressee_id)
                elif friendship.addressee_id in friend_ids and friendship.requester_id not in friend_ids:
                    network_ids.append(friendship.requester_id)
            if network_ids:
                visibility_filter |= Q(visibility='friends_network', author_id__in=network_ids)

        return queryset.filter(visibility_filter)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class FriendshipViewSet(viewsets.ModelViewSet):
    """ViewSet for managing friendships"""
    serializer_class = FriendshipSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Friendship.objects.filter(
            Q(requester=user) | Q(addressee=user)
        )

    def perform_create(self, serializer):
        serializer.save(requester=self.request.user)

