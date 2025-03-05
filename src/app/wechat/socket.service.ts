import { Injectable, NgZone } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, Subject } from 'rxjs';
import { MessageProtocol } from './socket-types';

const HEARTBEAT_INTERVAL = 5000;
const HEARTBEAT_TIMEOUT = 10000;

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket!: Socket;
  private heartbeatTimer: any;
  private timeoutTimer: any;
  public connectionState = new Subject<boolean>();

  constructor(private ngZone: NgZone) {
    this.initializeSocket();
  }

  private initializeSocket() {
    this.socket = io('http://localhost:3000', {
      transports: ['websocket'],
      autoConnect: false
    });

    this.setupSocketListeners();
  }

  private setupSocketListeners() {
    this.socket.on('connect', () => this.handleConnect());
    this.socket.on('disconnect', (reason) => this.handleDisconnect(reason));
    this.socket.on('heartbeat_ack', () => this.clearTimeoutTimer());
  }

  /* 心跳检测和重连逻辑 */
  private startHeartbeat() {
    this.heartbeatTimer = setInterval(() => {
      this.socket.emit('heartbeat', { timestamp: Date.now() });
      this.startTimeoutTimer();
    }, HEARTBEAT_INTERVAL);
  }

  private startTimeoutTimer() {
    this.timeoutTimer = setTimeout(() => {
      console.warn('心跳超时，强制断开连接');
      this.socket.disconnect();
    }, HEARTBEAT_TIMEOUT);
  }

  /* 公共方法 */
  public connect() {
    this.socket.connect();
  }

  public disconnect() {
    this.socket.disconnect();
  }

  public sendMessage(content: string) {
    const message: MessageProtocol = {
      version: '1.0.0',
      event: 'message',
      payload: {
        id: `client_${Date.now()}`,
        timestamp: Date.now(),
        content,
        meta: { platform: 'web' }
      },
      code: 200
    };
    console.log('sendMessage', message)
    this.socket.emit('message', message);
  }

  public listen(event: 'message' | 'system'): Observable<MessageProtocol> {
    return new Observable(subscriber => {
      this.socket.on(event, (data: MessageProtocol) => {
        console.log('resultMessage', data)
        if (this.validateMessage(data)) subscriber.next(data);
      });
    });
  }

  /* 辅助方法 */
  private handleConnect() {
    this.ngZone.run(() => {
      this.connectionState.next(true);
      this.startHeartbeat();
    });
  }

  private handleDisconnect(reason: string) {
    this.ngZone.run(() => {
      console.log('连接断开:', reason);
      this.connectionState.next(false);
      this.clearTimers();
    });
  }

  private validateMessage(data: any): data is MessageProtocol {
    return !!data?.version && !!data?.payload?.content;
  }

  private clearTimers() {
    clearInterval(this.heartbeatTimer);
    this.clearTimeoutTimer();
  }

  private clearTimeoutTimer() {
    clearTimeout(this.timeoutTimer);
  }
}
