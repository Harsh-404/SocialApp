import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { NewFeedContainerComponent } from './news-feed/components/new-feed-container/new-feed-container.component';
import { NgModule } from '@angular/core';
import { ProfilemenuComponent } from './news-feed/components/profilemenu/profilemenu.component';
import { FriendsComponent } from './news-feed/components/friends/friends.component';
import { AuthGuard } from './core/guards/auth.guard';
import { ChatAppComponent } from './news-feed/components/chat-app/chat-app.component';
//import { AuthGuard } from './core/guards/auth.guard';


export const routes: Routes = [
    {
        path: '', redirectTo: "login", pathMatch: "full",

    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: "register",
        component: RegisterComponent
    },
    {
        path: "profile",
        component: ProfilemenuComponent, canActivate: [AuthGuard],
    },
    {
        path: "profile/:id",
        component: ProfilemenuComponent, canActivate: [AuthGuard],
    },
    {
        path: "feed",
        component: NewFeedContainerComponent, canActivate: [AuthGuard]
    },
    {
        path: "friends",
        component: FriendsComponent
    },
    {
        path: "chat",
        component: ChatAppComponent
    },

    // {
    //     path: '',
    //     component: LayoutComponent,
    //     children: [
    //         {
    //             path: "dashboard",
    //             component: DashboardComponent
    //         }
    //     ]
    // }
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }

