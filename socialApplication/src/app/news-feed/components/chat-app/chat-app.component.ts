import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat-app',
  templateUrl: './chat-app.component.html',
  styleUrls: ['./chat-app.component.css']
})
export class ChatAppComponent implements OnInit {
  socket!: WebSocket;
  message = '';
  receivedMessages: string[] = [];

  ngOnInit() {
    this.setsock();
  }

  setsock() {
    this.socket = new WebSocket('ws://' + window.location.host + '/ws/account/consumers/');

    this.socket.onopen = () => {
      console.log('WebSocket connection created.');
    };

    this.socket.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      console.log('Data from event:', data.message);
      this.receivedMessages.push(data.message);
    };

    this.socket.onclose = (event: CloseEvent) => {
      console.error('WebSocket closed unexpectedly');
    };

    this.socket.onerror = (error: Event) => {
      console.error('WebSocket error:', error);
    };
  }

  sendMessage() {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ 'message': this.message }));
      this.message = '';  // Clear the input field
    } else {
      console.error('WebSocket is not open');
    }
  }
}
