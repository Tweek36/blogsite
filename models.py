from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from rest_framework.authtoken.models import Token

# Create your models here.
class Blog(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=64, unique=True)
    create_date = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.name

class Post(models.Model):
    id = models.AutoField(primary_key=True)
    blog_name = models.CharField(max_length=64)
    title = models.CharField(max_length=128)
    upload_date = models.DateField(auto_now_add=True)
    image_url = models.CharField(max_length=256)
    content = models.CharField(max_length=8192)
    authorId = models.DecimalField(decimal_places=0, max_digits=20)

    def __str__(self):
        return self.title