"""
URL configuration for taskManagement project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path

from account import consumers


from . import views
from django.conf.urls.static import static
from django.conf import settings
from account import views
from django.contrib.auth.models import User
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView




router = DefaultRouter()


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('account.urls')), #path('api-user-login/', views.UserLogIn.as_view()),
    # path('userView/', views.SearchAPIView.as_view()), # Get request for Users
    # #path('create-user/', views.Create_User.as_view(), name='create_user'),
    
    # path('api/users/<int:id>/', views.UserDetailView.as_view(), name='user-detail'),
    #path('account/', include('account.urls') ),
    path('profileView/<int:user>/', views.profile_get), # Get request for profiles
    path('', include(router.urls)),
    # path('articleView/', views.ArticleView.as_view(), name='article-modify'), # Get request for Articles
    # path('articleView/<int:pk>/', views.ArticleView.as_view(), name='article-detail'),
    
    # path('register/', views.UserRegister.as_view(), name='register'),
	# path('login/', views.UserLogin.as_view(), name='login'),
	# path('logout/', views.UserLogout.as_view(), name='logout'),
	# path('user/', views.UserView.as_view(), name='user'),
    path('articles/', views.articles_view, name="articles"),
    path('articles/user/<int:user_id>/', views.articles_view, name='user_articles'),
    path('profile/', views.profile_view, name="profile"),
    path('user/', views.user_view, name="User"),
    path('current_user/', views.current_user, name='current_user'),

    path('auth/login/', TokenObtainPairView.as_view(), name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),    
    path('friend-request/send/<int:profile_id>/', views.send_friend_request, name='send_friend_request'),
    path('friend-request/accept/<int:request_id>/', views.accept_friend_request, name='accept_friend_request'),
    path('friend-request/decline/<int:request_id>/', views.decline_friend_request, name='decline_friend_request'),
    path('friend-request/cancel/<int:request_id>/', views.cancel_friend_request, name='cancel_friend_request'),
    path('friend-request/friendsList/', views.friends_with, name='friends_with'),
    path('friend-request/notification/', views.friends_notification, name='notification'),
    path('friend-request/remove/<int:request_id>/', views.remove_friend, name='remove_friend'),
    path('articles/<int:id>/', views.load_article_by_id, name='load_article_by_id'),
    path('articles/update/<int:id>/', views.update_article, name='update_article'),
    
] 



if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)