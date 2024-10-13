import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { ProfilesService } from '../../../core/services/profiles.service';
import { UserService } from '../../../core/services/user.service';

interface User {
  id: number;
  username: string;
  email: string;
}

interface UserProfile {
  id: number;
  bio: string;
  location: string;
  birth_date: string;
  profile_pic: string;
  user: number;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profilemenu.component.html',
  styleUrls: ['./profilemenu.component.css']
})
export class ProfilemenuComponent implements OnInit {
  user_id: UserProfile[] = [];
  profile: UserProfile | undefined;
  user: User | undefined;
  currentUser?: User;





  constructor(
    private profileService: ProfilesService,
    private userService: UserService,
    private authService: AuthService
  ) { }

  ngOnInit() {

    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
      this.loadUserProfile(this.currentUser.id);
      console.log('Logged-in user:', this.currentUser.id);
    });
    //this.loadFriendRequests();


  }

  // loadFriendRequests(): void {
  //   this.friendService.getFriendRequests().subscribe((data) => {
  //     this.incomingRequests = data.incoming_requests;
  //     this.outgoingRequests = data.outgoing_requests;
  //   });
  // }

  // sendRequest(profileId: number): void {
  //   this.friendService.sendFriendRequest(profileId).subscribe(
  //     (response) => {
  //       alert(response.message);  // Display success message
  //       this.loadFriendRequests();  // Reload the friend requests
  //     },
  //     (error) => {
  //       alert('An error occurred while sending the request.');
  //     }
  //   );
  // }


  loadUserProfile(userId: number) {
    this.profileService.getUserProfile().subscribe(
      profiles => {
        this.profile = profiles.find(profile => profile.user === userId);
        console.log('Profile:', this.profile);
        if (this.profile) {
          this.userService.getUsers().subscribe(users => {
            this.user = users.find(user => user.id === this.profile!.user);
            console.log('User:', this.user);
          });
        }
      },
      error => {
        console.error('Error loading user profile:', error);
      }
    );

  }

  getProfilePic(): string {
    const profilePicUrl = this.profile ? `${this.profile.profile_pic}` : 'assets/default-profile.png';
    console.log('Profile Pic URL:', profilePicUrl);
    return profilePicUrl;
  }

  goBack() {
    window.history.back();
  }
}