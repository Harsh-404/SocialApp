from django.forms import ValidationError
from rest_framework import serializers
from .models import profile, Article
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, get_user_model
import ipdb
UserModel = get_user_model()

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = profile
        fields = '__all__'

class ArticleSerializer(serializers.ModelSerializer):
        class Meta:
            '''Meta definition for ModelName.'''
            model = Article
            fields = '__all__'
            

class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = '__all__'
        def create(self, clean_data):
            user_obj = UserModel.objects.create_user(username = clean_data['email'], password = clean_data['password'])
            user_obj.username = clean_data["username"]
            user_obj.save()
            return user_obj

class UserLoginSerializer(serializers.ModelSerializer):
    username = serializers.CharField()
    password = serializers.CharField()

    class Meta:
        model = UserModel
        fields = ['username', 'password']
    
    def check_user(self, clean_data):
        user = authenticate(username=clean_data["username"], password=clean_data["password"])
        if not user:
            return ValidationError("user not found")
        return user
    

    
class UserSerializer(serializers.ModelSerializer):
	class Meta:
		model = UserModel
		fields = ('email', 'username')
    
# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = UserModel
#         fields = ['id', 'username', 'first_name', 'last_name', 'email']


#tester, test@1234