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

  constructor(public peerService: PeerService){}

  ngOnInit(): void {
    this.peerService.connectToServer();
  }

  ngAfterViewInit(){
    this.peerService.setStreamVariables(this.localVideo, this.remoteVideo);
  }

  ngOnDestroy(){
    this.peerService.disconnectFromServer();
  }

  public onButtonClick(){
    this.msg = this.peerService.initiateCall();
    if(this.msg === ''){
      this.btnText="Skip"
    }
  }

  public loadLocalStream(){
    this.peerService.loadLocalStream();
  }
}
