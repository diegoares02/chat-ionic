import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

//importing socket
import { Socket } from "ng-socket-io";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  nickname = '';

  constructor(public navCtrl: NavController,
    private socket: Socket) {

  }

  joinChat() {
    this.socket.connect();
    console.log('Conectado al servidor');
    this.socket.emit('set-nickname', this.nickname);
    this.navCtrl.push('ChatRoomPage', { nickname: this.nickname });
  }
}
