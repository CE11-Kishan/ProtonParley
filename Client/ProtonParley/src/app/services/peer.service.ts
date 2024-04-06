import { ElementRef, Injectable} from '@angular/core';
import Peer, { MediaConnection } from 'peerjs';
import { WebSocketService } from './websocket.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PeerService {
  public peerId: string = '';
  public peer: Peer | undefined;
  public socketUrl = environment.baseUrl.replace(/https:/g, 'wss:');
  public activePeers: string[] = [];
  public stream: MediaStream[] = new Array(2);
  public mediaConnection: MediaConnection | undefined;
  public remoteVideo!: ElementRef<HTMLVideoElement>;
  public localVideo!: ElementRef<HTMLVideoElement>;

  constructor(private webSocketService: WebSocketService){
  }

  public connectToServer(){
    this.webSocketService.connect(this.socketUrl);

    console.log('Connected to Websocket Server');

    this.webSocketService.subscribeToMessages((data: string[]) => {
      this.activePeers = data;
      if (this.peerId === '') {
        this.peerId = this.activePeers[this.activePeers.length - 1];
        this.initializePeer();
      }
    });
  }

  public disconnectFromServer(){
    this.webSocketService.close();
  }

  public initializePeer() {
    this.peer = new Peer(this.peerId); 
    this.peer.on('call', (call) => {
      call.answer(this.stream[0]);
      this.mediaConnection = call;
      call.on('stream', (remoteStream) => {
        this.remoteVideo.nativeElement.srcObject = remoteStream;
      });
    });
  }

  public initiateCall(): string {
    if (this.activePeers.length > 1) {
      const randomIndex = Math.floor(Math.random() * this.activePeers.length);
      const peerIdToCall = this.activePeers[randomIndex];
      if (peerIdToCall !== this.peerId) {
        const call = this.peer?.call(peerIdToCall, this.stream[0]);
        if (call) {
          this.mediaConnection = call;
          call.on('stream', (remoteStream) => {
            this.remoteVideo.nativeElement.srcObject = remoteStream;
          });
        }
      } else {
        this.initiateCall();
      }
    } else {
      return 'No other active peers available';
    }

    return '';
  }

  public async loadLocalStream(){
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          frameRate: { ideal: 120 },
          facingMode: 'user'
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true
        }
      });
      this.stream[0] = stream;
      this.localVideo.nativeElement.srcObject = stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  }

  public setStreamVariables(local:ElementRef<HTMLVideoElement>, remote: ElementRef<HTMLVideoElement>){
    this.localVideo = local;
    this.remoteVideo = remote;
  }
}
