import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

//importing libraries
import { Socket } from "ng-socket-io";
import { Observable } from "rxjs/Observable";

/**
 * Generated class for the ChatRoomPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chat-room',
  templateUrl: 'chat-room.html',
})
export class ChatRoomPage {

  messages=[];
  nickname='';
  message='';

  constructor(public navCtrl: NavController, public navParams: NavParams,
  private socket:Socket,private toastCtrl:ToastController) {
    this.nickname = this.navParams.get('nickname');
 
    this.getMessages().subscribe(message => {
      this.messages.push(message);
    });
 
    this.getUsers().subscribe(data => {
      let user = data['user'];
      if (data['event'] === 'left') {
        this.showToast('User left: ' + user);
      } else {
        this.showToast('User joined: ' + user);
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatRoomPage');
  }

  sendMessage(){
    this.socket.emit('add-message',{text: this.message});
    this.message = '';
  }

  getMessages(){
    let observable = new Observable(observer => {
      this.socket.on('message',(data) => {
        console.log(data);
        observer.next(data);
      })
    })
    return observable;
  }

  getUsers(){
    let observable = new Observable(observer => {
      this.socket.on('users-changed',(data)=>{
        observer.next(data);
      })
    })
    return observable;
  }

  ionViewWillLeave(){
    this.socket.disconnect();
  }

  showToast(msg){
    let toast = this.toastCtrl.create({
      message: msg,
      duration:2000
    });
    toast.present();
  }
}
