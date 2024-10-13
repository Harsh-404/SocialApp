import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { UserService } from './core/services/user.service';

import { AppComponent } from './app.component';

import { AppRoutingModule, routes } from './app.routes';
import { RegisterComponent } from './auth/register/register.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NewFeedContainerComponent } from './news-feed/components/new-feed-container/new-feed-container.component';
import { FriendsComponent } from './news-feed/components/friends/friends.component';
import { ProfilemenuComponent } from './news-feed/components/profilemenu/profilemenu.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthService } from './core/services/auth.service';
//import { AuthGuard } from './core/guards/auth.guard';
import { ReactiveFormsModule } from '@angular/forms';
import { JwtInterceptor } from './core/services/jwt.interceptor';
import { ChatAppComponent } from './news-feed/components/chat-app/chat-app.component';

@NgModule({
    declarations: [
        AppComponent,
        RegisterComponent,
        NewFeedContainerComponent,
        FriendsComponent,
        ProfilemenuComponent,
        LoginComponent,
        ChatAppComponent,

    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientXsrfModule.withOptions({
            cookieName: 'csrftoken',
            headerName: 'X-CSRFToken',
        }),
        RouterModule.forRoot(routes)
    ],
    providers: [UserService, AuthService, {
        provide: HTTP_INTERCEPTORS,
        useClass: JwtInterceptor,
        multi: true
    }],
    bootstrap: [AppComponent]
})
export class AppModule { }
