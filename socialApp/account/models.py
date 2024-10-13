from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE,)
    bio = models.TextField(max_length=255, blank=True)
    location = models.CharField(max_length=255,)
    birth_date = models.DateTimeField(auto_now_add=True)
    profile_pic = models.ImageField(upload_to="profile_picture", blank=True)
    friends = models.ManyToManyField("Profile", blank=True, null=True)
    
      

    def _str_(self):
        return f"{self.user.username}'s profile"

import logging

logger = logging.getLogger(__name__)

class FriendRequest(models.Model):
    from_user = models.ForeignKey(Profile, related_name='friend_requests_sent', on_delete=models.CASCADE)
    to_user = models.ForeignKey(Profile, related_name='friend_requests_received', on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.from_user} wants to be friends with {self.to_user}"

# class FriendsList(models.Model):
    


class Article(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField(blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='articles')
    image = models.ImageField(upload_to="images")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

