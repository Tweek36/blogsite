from email.policy import HTTP
from os import stat
from re import T
from turtle import pos
from django.http import JsonResponse
from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from rest_framework import generics, status
from .serializers import BlogSerializer, PostSerializer, UserCreateSerializer, CreatePostSerializer, CreateBlogSerializer, UserSerializer
from .models import Blog, Post
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework import authentication
from rest_framework import exceptions
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

# Create your views here.
class BlogView(generics.ListAPIView):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer

class RemoveBlogView(generics.DestroyAPIView):
    serializer_class = BlogSerializer
    lookup_url_kwarg = 'id'
    
    def destroy(self, request, format=None):
        id = request.GET.get(self.lookup_url_kwarg)
        if id != None:
            blog = Blog.objects.filter(id=id)
            if len(blog) > 0:
                blog[0].delete()
                return Response({"Blog destroyed"}, status=status.HTTP_200_OK)
            return Response({"Blog not found": "Invalid blog id."}, status=status.HTTP_404_NOT_FOUND)
        return Response({"Bad request": "Id parameter not found in request"}, status=status.HTTP_400_BAD_REQUEST)

class GetBlog(APIView):
    serializer_class = BlogSerializer
    lookup_url_kwarg = 'id'

    def get(self, request, format=None):
        id = request.GET.get(self.lookup_url_kwarg)
        if id != None:
            blog = Blog.objects.filter(id=id)
            if len(blog) > 0:
                data = BlogSerializer(blog[0]).data
                return Response(data, status=status.HTTP_200_OK)
            return Response({"Blog not found": "Invalid blog id."}, status=status.HTTP_404_NOT_FOUND)
        return Response({"Bad request": "Id parameter not found in request"}, status=status.HTTP_400_BAD_REQUEST)

    
class CreateBlogView(APIView):
    serializer_class = CreateBlogSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            name = serializer.data.get('name')
            queryset  = Blog.objects.filter(name=name)

            if queryset.exists():
                blog = queryset[0]
                blog.name = name
                blog.save(update_fields=['name'])
                return Response(BlogSerializer(blog).data, status=status.HTTP_200_OK)
            else:
                blog = Blog(name=name)
                blog.save()
            
                return Response(BlogSerializer(blog).data, status=status.HTTP_201_CREATED)
        
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)

class PostView(generics.ListAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

class GetPost(APIView):
    serializer_class = PostSerializer
    lookup_url_kwarg = 'id'

    def get(self, request, format=None):
        id = request.GET.get(self.lookup_url_kwarg)
        if id != None:
            post = Post.objects.filter(id=id)
            if len(post) > 0:
                data = PostSerializer(post[0]).data
                return Response(data, status=status.HTTP_200_OK)
            return Response({"Post not found": "Invalid post id."}, status=status.HTTP_404_NOT_FOUND)
        return Response({"Bad request": "Id parameter not found in request"}, status=status.HTTP_400_BAD_REQUEST)
    
class CreatePostView(APIView):
    serializer_class = CreatePostSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            blog_name = serializer.data.get('blog_name')
            image_url = serializer.data.get('image_url')
            content   = serializer.data.get('content')
            title     = serializer.data.get('title')
            authorId  = self.request.session.get('userId')
            queryset  = Post.objects.filter(title=title)

            if queryset.exists():
                post = queryset[0]
                post.blog_name = blog_name
                post.image_url = image_url
                post.content   = content
                post.save(
                    update_fields=['blog_name', 'image_url', 'content'])
                return Response(PostSerializer(post).data, status=status.HTTP_200_OK)
            else:
                post = Post(
                    blog_name = blog_name,
                    image_url = image_url,
                    content   = content,
                    title     = title,
                    authorId  = authorId)
                post.save()
            
                return Response(PostSerializer(post).data, status=status.HTTP_201_CREATED)
        
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)

class UserList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserDetail(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserCreate(APIView):
    def post(self, request, format='json'):
        serializer = UserCreateSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.create(request.data)
            if user:
                return Response(user, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserLogin(APIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_url_kwargs = ('username', 'password')

    def get(self, request, format='json'):
        username = request.GET.get(self.lookup_url_kwargs[0])
        password = request.GET.get(self.lookup_url_kwargs[1])
        if username != None or password != None:
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                if not self.request.session.exists(self.request.session.session_key):
                    self.request.session.create()
                self.request.session['userId'] = user.id
                return Response({"UserId updated": user.id}, status=status.HTTP_200_OK)
            return Response({"User not found": user}, status=status.HTTP_404_NOT_FOUND)
        return Response({"Bad request": "User and pass parameters not found in request"}, status=status.HTTP_400_BAD_REQUEST)

class UserLogout(APIView):
    def get(self, request, format='json'):
        logout(request)
        self.request.session['userId'] = None
        return Response({"Sucsefull": "User is logged out"}, status=status.HTTP_200_OK)        

class CurrentUser(APIView):
    def get(self, request, format=None):
        userId = self.request.session.get('userId')
        if userId is not None:
            user = User.objects.filter(id = userId)
            if len(user) > 0:
                data = UserSerializer(user[0]).data
                data['isAdmin'] = user[0].is_superuser
                return JsonResponse(data, status=status.HTTP_200_OK)
        return JsonResponse({"No such user" : "User is not authorized"}, status=status.HTTP_404_NOT_FOUND)
