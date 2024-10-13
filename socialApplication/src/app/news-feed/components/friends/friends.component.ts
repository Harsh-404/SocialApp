import { Component } from '@angular/core';
import { FriendsService } from '../../../core/services/friends.service';
import { ProfilesService } from '../../../core/services/profiles.service';
import { UserService } from '../../../core/services/user.service';

interface UserProfile {
  id: number;
  bio: string;
  location: string;
  birth_date: string;
  profile_pic: string;
  user: number;
}
interface User {
  id: number;
  username: string;
  email: string;
}
interface Friends {
  friend_id: number;
  username: string;
}

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrl: './friends.component.css',

})
export class FriendsComponent {

  searchQuery: string = '';
  searchResults: any[] = [];
  profile: UserProfile | undefined;
  user: User | undefined;
  friend: Friends | undefined;
  profileId!: number;
  isFriendAllowed: boolean = true;

  constructor(private friendService: FriendsService, private userService: UserService, private profileService: ProfilesService,) { }

  onSearch() {
    if (this.searchQuery.length > 2) {
      this.friendService.search(this.searchQuery).subscribe(
        (results) => {
          this.searchResults = results;

        },
        (error) => {
          console.error('Error:', error);
        }
      );
    } else {
      this.searchResults = [];
    }
  }

  viewProfile(userId: number): void {
    console.clear()
    this.profileService.getUserProfile().subscribe(
      profiles => {
        this.profile = profiles.find(profile => profile.user === userId);
        console.log('Profile:', this.profile);

        if (this.profile) {
          this.userService.getUsers().subscribe(users => {
            this.user = users.find(user => user.id === this.profile!.user);
            console.log('User:', this.profile!.id);
          });

          this.friendService.getFriendList().subscribe(response => {
            const friend = response.Friends_with.find((f: Friends) => f.friend_id === this.profile?.id);
            if (friend) {
              this.isFriendAllowed = false;
              console.log("Friend", (friend));
            }
            else { this.isFriendAllowed = true }
            ///
          });
        }

      },
      error => {
        console.error('Error loading user profile:', error);
      }
    );
  }


  incomingRequests: any[] = [];
  outgoingRequests: any[] = [];
  listRequests: any[] = [];

  ngOnInit(): void {
    console.clear()
    this.loadFriendRequests();
    this.friendsList();
  }

  // Load friend requests
  loadFriendRequests(): void {
    this.friendService.getFriendRequests().subscribe((data) => {
      this.incomingRequests = data.received_requests;
      this.outgoingRequests = data.sent_requests;
    });
  }

  // Send friend request
  sendRequest(userId: number): void {
    console.log("user", userId);
    this.friendService.sendFriendRequest(userId).subscribe((response) => {
      alert(response.message);  // Display success or error message
      this.loadFriendRequests();  // Reload the friend requests
    },
      (error) => {
        alert('An error occurred while sending the request.');
      }

    );
  }

  // Accept a friend request
  acceptRequest(requestId: number): void {
    this.friendService.acceptFriendRequest(requestId).subscribe((response) => {
      alert(response.message);  // Display success or error message
      this.loadFriendRequests();  // Reload the friend requests
      this.friendsList();// Reload the friend requests
    });
  }

  // Decline a friend request
  declineRequest(requestId: number): void {
    this.friendService.declineFriendRequest(requestId).subscribe((response) => {
      alert(response.message);  // Display success or error message
      this.loadFriendRequests();  // Reload the friend requests
    });
  }

  // Cancel a friend request
  cancelRequest(requestId: number): void {
    this.friendService.cancelFriendRequest(requestId).subscribe((response) => {
      alert(response.message);  // Display success or error message
      this.loadFriendRequests();  // Reload the friend requests
    });
  }

  getProfilePic(): string {
    const profilePicUrl = this.profile ? `${this.profile.profile_pic}` : 'assets/default-profile.png';
    // console.log('Profile Pic URL:', profilePicUrl);
    return profilePicUrl;
  }
  friendsList(): void {
    this.friendService.getFriendList().subscribe((data) => {
      this.listRequests = data.Friends_with;
    });
  }

  removeFriend(requestId: number): void {
    this.friendService.removeFriend(requestId).subscribe((response) => {
      alert("Removed Friend");  // Display success or error message
      this.loadFriendRequests();
      this.friendsList();// Reload the friend requests
    });
  }


}
