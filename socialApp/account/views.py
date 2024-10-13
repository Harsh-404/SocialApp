import json
import logging
from django.shortcuts import get_object_or_404, redirect
from django.contrib.sessions.models import Session
from rest_framework.decorators import api_view,authentication_classes,permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.core.files.base import ContentFile
import base64

from django.core import serializers
from .models import Article, FriendRequest, Profile
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from rest_framework.authentication import BasicAuthentication, SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import api_view, parser_classes

logger = logging.getLogger(__name__)


@api_view(['GET', 'POST','PATCH','DELETE'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def articles_view(request, user_id=None):
    print(f"Is authenticated: {request.user.is_authenticated}")
    print(f"User: {request.user}")
    # print(f"Session key: {request.session.session_key}")
    # print(f"Request method: {request.method}")
    # print(f"Request headers: {request.headers}")
    user = request.user
    if request.method == "GET":
        if user.is_authenticated:
            
            profile = get_object_or_404(Profile, user__username=user.username)
            friends = profile.friends.all()

            friends_with = [friend.id for friend in friends]
            friends_with.append(profile.user.id)
            articles = Article.objects.filter(user__id__in=friends_with)
            print(f"articles:{articles}")
        else:
            articles = Article.objects.all()
        data = [{
                'id': article.id,
                'title': article.title,
                'content': article.content,
                'image': request.build_absolute_uri(article.image.url) if article.image else None,
                'user': article.user.username if article.user else None
            } for article in articles]
        return Response(data)    

    
    elif request.method == "POST":
        title = request.data.get('title')
        content = request.data.get('content')
        image_data = request.data.get('image')

        if not title or not content:
            return Response({'error': 'Title and content are required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            article = Article(
                title=title,
                content=content,
                user=request.user
            )

            if image_data:
                # Assuming image_data is a base64 encoded string
                article.image = image_data
                
            article.save()

            return Response({
                'id': article.id,
                'title': article.title,
                'content': article.content,
                'image': request.build_absolute_uri(article.image.url) if article.image else None,
                'user': article.user.id 
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            logger.error(f"Error creating article: {e}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    elif request.method == "DELETE":
            
            try:
                article = Article.objects.get(id=user_id, user=request.user)
                article.delete()
                return Response({'message': 'Article deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
            except Article.DoesNotExist:
                return Response({'error': 'Article not found or you do not have permission to delete this article'}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def load_article_by_id(request, id):
    try:
        article = Article.objects.get(id=id)
        return JsonResponse({
            'id': article.id,
            'title': article.title,
            'content': article.content,
        })
    except Article.DoesNotExist:
        raise Http404("Article not found")



@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
@csrf_exempt  
def update_article(request, id):
    if request.method == 'PATCH':
        try:
            article = Article.objects.get(pk=id)
            data = json.loads(request.body)
            article.title = data.get('title', article.title)
            article.content = data.get('content', article.content)
            article.save()

            return JsonResponse({
                'message': 'Article updated successfully',
                'id': article.id,
                'title': article.title,
                'content': article.content,
            })
        except Article.DoesNotExist:
            return JsonResponse({'error': 'Article not found'}, status=404)
    else:
        return HttpResponseBadRequest('Invalid request method')

    
@api_view(['GET', 'POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def profile_get(request, user=None):
    if request.user.is_authenticated:
        if request.method == "GET":
            profile_v = Profile.objects.filter(user=user)
            data = [{
                'id': profile.id,
                'bio': profile.bio,
                'location': profile.location,
                'profile_pic': request.build_absolute_uri(profile.profile_pic.url) if profile.profile_pic else None,
                'user': profile.user.id if profile.user else None
            } for profile in profile_v]
            return Response(data)

@api_view(['GET', 'POST'])
@parser_classes([MultiPartParser, FormParser])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def profile_view(request):
    if request.method == "GET":
        profile_v = Profile.objects.all()
        data = [{
            'id': profile.id,
            'bio': profile.bio,
            'location': profile.location,
            'profile_pic': request.build_absolute_uri(profile.profile_pic.url) if profile.profile_pic else None,
            'user': profile.user.id if profile.user else None
        } for profile in profile_v]
        return Response(data)
    
    elif request.method == "POST":
        bio = request.data.get('bio', '')
        location = request.data.get('location')
        image_data = request.data.get('profile_pic')

        if not location:
            return Response({'error': 'Location is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            profile, created = Profile.objects.get_or_create(
                user=request.user,
                defaults={'bio': bio, 'location': location}
            )
            
            if not created:
                profile.bio = bio
                profile.location = location

            if image_data:
                try:
                    # Handle base64 encoded image
                    if isinstance(image_data, str) and image_data.startswith('data:image'):
                        format, imgstr = image_data.split(';base64,')
                        ext = format.split('/')[-1]
                        data = ContentFile(base64.b64decode(imgstr), name=f'temp.{ext}')
                    # Handle file upload
                    else:
                        data = image_data
                        ext = data.name.split('.')[-1]
                    
                    profile.profile_pic.save(f'profile_pic_{profile.id}.{ext}', data, save=True)
                except Exception as e:
                    return Response({'error': f'Error processing image: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
            
            profile.save()

            return Response({
                'id': profile.id,
                'bio': profile.bio,
                'location': profile.location,
                'profile_pic': request.build_absolute_uri(profile.profile_pic.url) if profile.profile_pic else None,
                'user': profile.user.id
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response({'error': 'Invalid request method.'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


@api_view(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])
def user_view(request):
    
    if request.method == "GET":
        users = User.objects.all()
        data = [{
            "id": user.id,
            "email": user.email,
            "username": user.username,
        } for user in users]
        return Response(data)
    if request.method == "POST":
        username=request.data.get('username')
        email=request.data.get("email")
        password=request.data.get("password")
        
        if not username or not password:
            return Response({"Error","username and Password is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User(username=username, email=email, )
            user.set_password(password) #we need to hash the password before saving it to database
            user.save()
            return Response({'username':username, 'email':email},status=status.HTTP_201_CREATED)
        
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
    
def logout_view(request):
    logout(request)
    Session.objects.all().delete()
    return redirect(user_view)

from rest_framework.authtoken.models import Token

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def current_user(request):
    user = request.user
    logger.info(f"User {user.username} with ID {user.id} fetched successfully.")
    return Response({'id': user.id, 'username': user.username, 'email': user.email})

from django.shortcuts import render, redirect, get_object_or_404
from .models import Profile, FriendRequest
from django.http import Http404, HttpResponseBadRequest, JsonResponse
from django.shortcuts import get_object_or_404


@api_view(['GET', 'POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
@csrf_exempt
def send_friend_request(request, profile_id):
    from_user = request.user.profile
    to_user = get_object_or_404(Profile, id=profile_id)
    
    if from_user != to_user:
        friend_request, created = FriendRequest.objects.get_or_create(
            from_user=from_user,
            to_user=to_user
        )
        if created:
            
            return JsonResponse({'status': 'success', 'message': 'Friend request sent'}, status=201)
        else:
            
            return JsonResponse({'status': 'error', 'message': 'Friend request already exists'}, status=400)
    
    return JsonResponse({'status': 'error', 'message': 'You cannot send a request to yourself'}, status=400)

@api_view(['GET', 'POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def accept_friend_request(request, request_id):
    logger.debug(f"Accepting friend request with ID {request_id}")

    friend_request = FriendRequest.objects.get(from_user=request_id)
    
    if friend_request.to_user == request.user.profile:
        friend_request.to_user.friends.add(friend_request.from_user)
        friend_request.from_user.friends.add(friend_request.to_user)
        friend_request.delete()
        return JsonResponse({'status': 'success', 'message': 'Friend request accepted'}, status=200)
    
    return JsonResponse({'status': 'error', 'message': 'Unauthorized action'}, status=403)

@api_view(['GET', 'POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def decline_friend_request(request, request_id):
    friend_request = get_object_or_404(FriendRequest, from_user=request_id, to_user=request.user.profile)
    
    if friend_request.to_user == request.user.profile:
        friend_request.delete()
        return JsonResponse({'status': 'success', 'message': 'Friend request declined'}, status=200)
    
    return JsonResponse({'status': 'error', 'message': 'Unauthorized action'}, status=403)

@api_view(['GET', 'POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def cancel_friend_request(request, request_id):
    friend_request = get_object_or_404(FriendRequest, to_user=request_id, from_user=request.user.profile)
    
    if friend_request.from_user == request.user.profile:
        friend_request.delete()
        return JsonResponse({'status': 'success', 'message': 'Friend request declined'}, status=200)
    
    return JsonResponse({'status': 'error', 'message': 'Unauthorized action'}, status=403)


@api_view(['GET', 'POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def friends_with(request):
    
    user = request.user
    
    profile = get_object_or_404(Profile, user__username=user.username)

    friends = profile.friends.all()

    friends_with = [{"friend_id": friend.id, "username": friend.user.username} for friend in friends]

    return JsonResponse({"Friends_with": friends_with})



@api_view(['GET', 'POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def friends_notification(request):
    
    user = request.user
    
    profile = get_object_or_404(Profile, user__id=user.id)
    received_requests = profile.friend_requests_received.all()
    sent_requests = profile.friend_requests_sent.all()
    
    received_data = [
        {"id":req.from_user.id ,"from_user": req.from_user.user.username, "timestamp": req.timestamp}
        for req in received_requests
    ]
    sent_data = [
        {"id":req.to_user.id ,"to_user": req.to_user.user.username, "timestamp": req.timestamp}
        for req in sent_requests
    ]
    
    return JsonResponse({"received_requests": received_data, "sent_requests": sent_data})

@api_view(['GET', 'POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def remove_friend(request, request_id):
    
    user = request.user
    
    user_profile = get_object_or_404(Profile, user__id=user.id)
    to_remove_profile = get_object_or_404(Profile, id=request_id)
    
    is_friend = user_profile.friends.filter(id=to_remove_profile.id).exists()
    
    if is_friend:
        user_profile.friends.remove(to_remove_profile)
        to_remove_profile.friends.remove(user_profile)
        return Response("Removed Profile")
    else:
        return Response("Friend Id Does not exist")