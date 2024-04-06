import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket$!: WebSocketSubject<any>; 

  constructor() { }

  public connect(url: string): WebSocketSubject<any> {
    this.socket$ = webSocket({
      url: url,
      deserializer: msg => JSON.parse(msg.data),
      serializer: msg => JSON.stringify(msg)
    });

    return this.socket$;
  }

  public close() {
    if (this.socket$) {
      this.socket$.complete();
    }
  }

  public subscribeToMessages(callback: (data: any) => void) {
    this.socket$.subscribe(
      (data: any) => {
        callback(data);
      },
      (error: any) => {
        console.error('WebSocket error:', error);
      },
      () => {
        console.log('WebSocket connection closed');
      }
    );
  }
}
