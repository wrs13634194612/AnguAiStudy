import { Component , OnInit, OnDestroy} from '@angular/core';
import { SocketService } from './socket.service';
import { MessageProtocol } from './socket-types';
import { Subscription } from 'rxjs';
import {FormsModule} from '@angular/forms';
import {NgForOf} from '@angular/common';

import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-wechat',
  imports: [
    FormsModule,
    CommonModule,
    NgForOf
  ],
  templateUrl: './wechat.component.html',
  styleUrls: ['./wechat.component.css']
})
export class WechatComponent implements OnInit, OnDestroy {
  connectionStatus = false;
  inputMessage = '';
  messages: MessageProtocol[] = [];

  private statusSub!: Subscription;
  private subs = new Subscription();

  constructor(private socketService: SocketService) {}

  ngOnInit() {
    this.initConnectionStatus();
    this.initMessageListeners();
    this.socketService.connect();
  }

  private initConnectionStatus() {
    this.statusSub = this.socketService.connectionState.subscribe(connected => {
      this.connectionStatus = connected;
    });
  }

  private initMessageListeners() {
    this.subs.add(
      this.socketService.listen('message').subscribe({
        next: msg => this.handleNewMessage(msg),
        error: err => console.error('消息接收错误', err)
      })
    );

    this.subs.add(
      this.socketService.listen('system').subscribe({
        next: sysMsg => this.handleSystemMessage(sysMsg)
      })
    );
  }

  sendMessage() {
    if (this.inputMessage.trim()) {
      try {
        this.socketService.sendMessage(this.inputMessage);
        this.inputMessage = '';
      } catch (error) {
        console.error('消息发送失败:', error);
        alert('消息发送失败，请检查网络连接');
      }
    }
  }

  private handleNewMessage(msg: MessageProtocol) {
    this.messages = [...this.messages, msg];
    this.autoScrollToBottom();
  }

  private autoScrollToBottom() {
    setTimeout(() => {
      const container = document.querySelector('.message-list');
      if (container) container.scrollTop = container.scrollHeight;
    }, 50);
  }

  private handleSystemMessage(sysMsg: MessageProtocol) {
    this.messages = [...this.messages, sysMsg];
    if (sysMsg.code >= 500) {
      alert(`系统错误: ${sysMsg.payload.content}`);
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
    this.statusSub.unsubscribe();
    this.socketService.disconnect();
  }
}
