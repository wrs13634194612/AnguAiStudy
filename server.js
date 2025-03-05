const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"]
  }
});

// 生成标准消息格式
const createMessage = (content, sender = null) => ({
  version: '1.0.0',
  event: 'message',
  payload: {
    id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    timestamp: Date.now(),
    sender: sender ? { id: sender.id, name: sender.name } : undefined,
    content,
    meta: { protocol: 'websocket' }
  },
  code: 200
});

io.on('connection', (socket) => {
  // 发送连接成功消息
  const systemMessage = {
    version: '1.0.0',
    event: 'system',
    payload: {
      id: `sys_${socket.id}`,
      timestamp: Date.now(),
      content: '连接成功',
      meta: { connection: true }
    },
    code: 201
  };
  socket.emit('message', systemMessage);

  // 新增心跳监听
  socket.on('heartbeat', (data) => {
    socket.emit('heartbeat_ack', { timestamp: data.timestamp });
  });

  // 处理客户端消息
  socket.on('message', (rawData) => {
    console.log('服务端收到客户端的消息',rawData)
    try {
      // 验证数据格式
      const data = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;

      if (!data?.version || data.version !== '1.0.0') {
        throw new Error('协议版本不匹配');
      }
      // 构造响应消息
      const response = createMessage(`已收到：${data.payload.content}`, {
        id: 'server',
        name: '系统服务'
      });
      // 广播给所有客户端
      io.emit('message', response);

    } catch (error) {
      // 错误处理
      const errorMessage = {
        version: '1.0.0',
        event: 'error',
        payload: {
          id: `err_${Date.now()}`,
          timestamp: Date.now(),
          content: error.message,
          meta: { errorCode: 'INVALID_FORMAT' }
        },
        code: 400
      };
      socket.emit('message', errorMessage);
    }
  });
});

httpServer.listen(3000, () => {
  console.log('服务端运行在 http://localhost:3000');
});
