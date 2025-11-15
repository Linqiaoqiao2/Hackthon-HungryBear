"""
Management command to create sample data for development and testing.
Usage: python manage.py seed_data
"""
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import Recipe, FoodStatus, Friendship
from datetime import datetime, timedelta


class Command(BaseCommand):
    help = 'Creates sample data (users, recipes, food statuses) for development'

    def handle(self, *args, **options):
        self.stdout.write('Creating sample data...')

        # Create sample users
        user1, created = User.objects.get_or_create(
            username='Mengmeng',
            defaults={
                'email': 'mengmeng@example.com',
                'first_name': 'Mengmeng',
                'last_name': 'User',
            }
        )
        if created:
            user1.set_password('password123')
            user1.save()
            self.stdout.write(self.style.SUCCESS(f'Created user: {user1.username}'))

        user2, created = User.objects.get_or_create(
            username='Chef',
            defaults={
                'email': 'chef@example.com',
                'first_name': 'Chef',
                'last_name': 'Cook',
            }
        )
        if created:
            user2.set_password('password123')
            user2.save()
            self.stdout.write(self.style.SUCCESS(f'Created user: {user2.username}'))

        user3, created = User.objects.get_or_create(
            username='Baker',
            defaults={
                'email': 'baker@example.com',
                'first_name': 'Baker',
                'last_name': 'Sweet',
            }
        )
        if created:
            user3.set_password('password123')
            user3.save()
            self.stdout.write(self.style.SUCCESS(f'Created user: {user3.username}'))

        # Create sample recipes
        recipes_data = [
            {
                'author': user1,
                'title': 'Pizza',
                'description': 'Delicious homemade pizza with pineapple, chicken, and fresh cilantro',
                'ingredients': 'Pizza dough, tomato sauce, mozzarella, pineapple, chicken, red onion, cilantro',
                'instructions': '1. Prepare dough\n2. Add toppings\n3. Bake at 200°C for 15 minutes',
                'image_url': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
                'visibility': 'public',
            },
            {
                'author': user2,
                'title': 'Pasta Carbonara',
                'description': 'Classic Italian pasta dish',
                'ingredients': 'Spaghetti, eggs, pancetta, parmesan, black pepper',
                'instructions': '1. Cook pasta\n2. Prepare sauce\n3. Combine and serve',
                'image_url': '',
                'visibility': 'public',
            },
            {
                'author': user1,
                'title': 'Sushi Roll',
                'description': 'Fresh salmon and avocado sushi',
                'ingredients': 'Sushi rice, nori, salmon, avocado, cucumber',
                'instructions': '1. Prepare rice\n2. Roll with ingredients\n3. Slice and serve',
                'image_url': 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop',
                'visibility': 'public',
            },
            {
                'author': user3,
                'title': 'Chocolate Cake',
                'description': 'Rich and moist chocolate cake',
                'ingredients': 'Flour, sugar, cocoa, eggs, butter, milk',
                'instructions': '1. Mix ingredients\n2. Bake at 180°C for 35 minutes',
                'image_url': '',
                'visibility': 'public',
            },
        ]

        for recipe_data in recipes_data:
            recipe, created = Recipe.objects.get_or_create(
                title=recipe_data['title'],
                author=recipe_data['author'],
                defaults=recipe_data
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created recipe: {recipe.title}'))

        # Create sample food statuses (stories)
        stories_data = [
            {
                'author': user1,
                'content': 'Just made the most amazing pizza! 🍕',
                'image_url': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
                'visibility': 'public',
            },
            {
                'author': user2,
                'content': 'Perfect pasta carbonara for dinner tonight! 🍝',
                'image_url': '',
                'visibility': 'public',
            },
            {
                'author': user1,
                'content': 'Homemade sushi rolls - so fresh! 🍣',
                'image_url': 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop',
                'visibility': 'public',
            },
        ]

        for story_data in stories_data:
            # Only create if it doesn't exist (check by content and author)
            if not FoodStatus.objects.filter(
                content=story_data['content'],
                author=story_data['author']
            ).exists():
                story = FoodStatus.objects.create(**story_data)
                self.stdout.write(self.style.SUCCESS(f'Created story: {story.content[:30]}...'))

        self.stdout.write(self.style.SUCCESS('\nSample data created successfully!'))
        self.stdout.write(f'Total users: {User.objects.count()}')
        self.stdout.write(f'Total recipes: {Recipe.objects.count()}')
        self.stdout.write(f'Total stories: {FoodStatus.objects.count()}')

