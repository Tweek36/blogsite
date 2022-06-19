from django.urls import path
from .views import index

urlpatterns = [
    path('', index),
    path('blog/<int:postId>', index),
    path('post/<int:postId>', index),
    path('createblog', index),
    path('createpost', index),
    path('editpost/<int:postId>', index),
    path('register', index),
    path('quit', index),
    path('login', index)
]
