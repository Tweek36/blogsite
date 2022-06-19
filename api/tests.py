from urllib import request
from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework.test import APIRequestFactory
from django.contrib.auth.models import User
from rest_framework import status
from .views import UserCreate, UserList

# Create your tests here.
class AccountsTest(APITestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
    def test_create_user(self):
        data = {
            'username': 'foobar',
            'password': 'somepassword'
        }
        request = self.factory.post('/createuser', data, format='json')
        view = UserCreate.as_view()
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    def test_create_user_with_empty_password(self):
        data = {
            'username': 'foobar',
            'password': ''
        }
        request = self.factory.post('/createuser', data, format='json')
        view = UserCreate.as_view()
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    def test_create_user_without_password(self):
        data = {
            'username': 'foobar'
        }
        request = self.factory.post('/createuser', data, format='json')
        view = UserCreate.as_view()
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    def test_create_two_similar_users(self):
        data = {
            'username': 'foobar',
            'password': 'somepassword'
        }
        request = self.factory.post('/createuser', data, format='json')
        view = UserCreate.as_view()
        response = view(request)
        request = self.factory.post('/createuser', data, format='json')
        view = UserCreate.as_view()
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)