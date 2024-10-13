from django.shortcuts import render
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import  profile,Article
from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from .serializers import ProfileSerializer, ArticleSerializer, UserLoginSerializer, UserRegisterSerializer, UserSerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework import generics
from rest_framework.generics import RetrieveAPIView  
from rest_framework import filters, permissions, status
from .validations import custom_validation,  validate_email, validate_password, validate_username
from rest_framework.authentication import SessionAuthentication
from django.contrib.auth import get_user_model, login, logout


# Create your views here.

def Home(request):
    return render(request, 'account/login.html')


# class UserProfileView(APIView):
#     def get(self, request):
#         profile = UserProfile.objects.all()
#         serializer = UserSerializer(profile, many=True)
#         return Response(serializer.data)
#     def post(self, request, pk):
#         serializer = UserSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProfileView(APIView):
    
    def get(self, request):
        profileD = profile.objects.all()
        serializer = ProfileSerializer(profileD, many=True)
        return Response(serializer.data)
    
    def post(self):
        pass


class ArticleView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
   
    def get(self, request, pk=None):
        if pk:
            # Retrieve a single article
            article = get_object_or_404(Article, pk=pk)
            serializer = ArticleSerializer(article)
            return Response(serializer.data)
        else:
            # List all articles
            articles = Article.objects.all()
            serializer = ArticleSerializer(articles, many=True)
            return Response(serializer.data)

    # def get(self, request):
    #     user=request.user
    #     #articles = Article.objects.filter(user=user)
    #     articles = Article.objects.all()
    #     serializer = ArticleSerializer(articles, many=True)
    #     return Response(serializer.data)
        
    def post(self, request, pk):
        if not request.user.is_authenticated:
            return Response({'detail': 'Authentication required to post.'}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = ArticleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user = request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        try:
            article = Article.objects.get(pk=pk)
        except Article.DoesNotExist:
            return Response({'detail': 'Article not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        if article.user != request.user:
            return Response({'detail': 'You do not have permission to edit this article.'}, status=status.HTTP_403_FORBIDDEN)

        serializer = ArticleSerializer(article, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        import ipdb; ipdb.set_trace()
        try:
            article = Article.objects.get(pk=pk)
        except Article.DoesNotExist:
            return Response({'detail': 'Article not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        # Only allow the user who created the article to delete it
        import ipdb; ipdb.set_trace()
        if article.user != request.user:
            return Response({'detail': 'You do not have permission to delete this article.'}, status=status.HTTP_403_FORBIDDEN)

        article.delete()
        return Response({'detail': 'Article deleted.'}, status=status.HTTP_204_NO_CONTENT)



class UserDetailView(RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = 'id'  
    
class UserRegister(APIView):
	permission_classes = (permissions.AllowAny,)
	def post(self, request):
		clean_data = custom_validation(request.data)
		serializer = UserRegisterSerializer(data=clean_data)
		if serializer.is_valid(raise_exception=True):
			user = serializer.create(clean_data)
			if user:
				return Response(serializer.data, status=status.HTTP_201_CREATED)
		return Response(status=status.HTTP_400_BAD_REQUEST)


class UserLogin(APIView):
	permission_classes = (permissions.AllowAny,)
	authentication_classes = (SessionAuthentication,)
	##
	def post(self, request):
		data = request.data
		assert validate_username(data)
		assert validate_password(data)
		serializer = UserLoginSerializer(data=data)
		if serializer.is_valid(raise_exception=True):
			user = serializer.check_user(data)
			login(request, user)
			return Response(serializer.data, status=status.HTTP_200_OK)


class UserLogout(APIView):
	permission_classes = (permissions.AllowAny,)
	authentication_classes = ()
	def post(self, request):
		logout(request)
		return Response(status=status.HTTP_200_OK)


class UserView(APIView):
	permission_classes = (permissions.IsAuthenticated,)
	authentication_classes = (SessionAuthentication,)
	##
	def get(self, request):
		serializer = UserSerializer(request.user)
		return Response({'user': serializer.data}, status=status.HTTP_200_OK)














# class UserLogIn(ObtainAuthToken):

#     def post(self, request, *args, **kwargs):
#         serializer = self.serializer_class(data=request.data,context={'request': request})
#         serializer.is_valid(raise_exception=True)
#         user = serializer.validated_data['user']
#         token = Token.objects.get(user=user)
#         return Response({
#             'token': token.key,
#             'id': user.pk,
#             'username': user.username
#         })

# class Create_User(APIView):
    
#     def post(self, request, *args, **kwargs):
#         username= request.data.get('username')
#         password = request.data.get("password")
#         first_name = request.data.get("first_name")
#         last_name = request.data.get("last_name")
#         email = request.data.get("email")
        
#         if not (username and first_name and last_name and email and password):
#             return Response({"error": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)
        
#         user, created = User.objects.get_or_create(
#             username=username,
#             defaults={
#                 "first_name": first_name,
#                 "last_name": last_name,
#                 "email": email,
#             },
#         )
#         if created:
#             user.set_password(password)
#             user.save()
#             return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)
#         else:
#             return Response({"message": "User already exists"}, status=status.HTTP_200_OK)
        
        


class SearchAPIView(generics.ListCreateAPIView):
    
    search_fields = ['username']
    filter_backends = (filters.SearchFilter,)
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    
    