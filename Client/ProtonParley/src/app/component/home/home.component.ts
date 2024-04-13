import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PeerService } from 'src/app/services/peer.service';
import { WebSocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild('localVideo') localVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideo') remoteVideo!: ElementRef<HTMLVideoElement>;
  public btnText = "Start";
  public msg: string = '';
  public isLive: boolean = false;
  private connectedToServer: boolean = false;

  constructor(public peerService: PeerService){}

  ngOnInit(): void {
  }

  ngAfterViewInit(){
    this.peerService.setStreamVariables(this.localVideo, this.remoteVideo);
  }

  ngOnDestroy(){
    this.peerService.disconnectFromServer();
  }

  public skipToNextUser(){
    this.msg = this.peerService.initiateCall();
  }

  public goLive(){
    if(!this.connectedToServer) {
      this.peerService.connectToServer();
      this.connectedToServer = true;
    }
    this.msg = this.peerService.initiateCall();
    if(this.msg == ''){
      this.isLive = true;
      this.peerService.loadLocalStream();
    }
  }
}
