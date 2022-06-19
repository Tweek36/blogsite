from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .models import Blog, Post

class BlogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Blog
        fields = ('id', 'name', 'create_date')

class CreateBlogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Blog
        fields = ('name',)

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ('id', 'blog_name', 'title', 'upload_date', 'image_url', 'content', 'authorId')

class CreatePostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ('blog_name', 'title', 'image_url', 'content')

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'password')

class UserCreateSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
        )
        return user
    class Meta:
        model = User
        fields = ('username', 'password')