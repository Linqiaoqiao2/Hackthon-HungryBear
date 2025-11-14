from django.db import models
from django.contrib.auth.models import User


class Friendship(models.Model):
    """Friendship relationship between users"""
    requester = models.ForeignKey(User, on_delete=models.CASCADE, related_name='friendship_requests_sent')
    addressee = models.ForeignKey(User, on_delete=models.CASCADE, related_name='friendship_requests_received')
    status = models.CharField(
        max_length=20,
        choices=[('pending', 'Pending'), ('accepted', 'Accepted'), ('blocked', 'Blocked')],
        default='pending'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['requester', 'addressee']
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.requester.username} -> {self.addressee.username} ({self.status})"


class Recipe(models.Model):
    """Recipe model with visibility settings"""
    VISIBILITY_CHOICES = [
        ('private', 'Private'),
        ('friends', 'Friends Only'),
        ('friends_network', 'Friends Network'),
        ('public', 'Public'),
    ]

    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='recipes')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    ingredients = models.TextField()
    instructions = models.TextField()
    image_url = models.URLField(blank=True, null=True)
    visibility = models.CharField(max_length=20, choices=VISIBILITY_CHOICES, default='friends')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class FoodStatus(models.Model):
    """Food status/story model"""
    VISIBILITY_CHOICES = [
        ('private', 'Private'),
        ('friends', 'Friends Only'),
        ('friends_network', 'Friends Network'),
        ('public', 'Public'),
    ]

    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='food_statuses')
    content = models.TextField()
    image_url = models.URLField(blank=True, null=True)
    visibility = models.CharField(max_length=20, choices=VISIBILITY_CHOICES, default='friends')
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(blank=True, null=True)  # For story-like expiration

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.author.username} - {self.content[:50]}"
