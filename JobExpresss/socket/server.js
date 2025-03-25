var socket = {}  // 要暴露出去的对象
const WebSocket = require('ws');  // 引入WebSocket模块

socket.onopen = function(server) {  // 当WebSocket连接成功建立时触发
    console.log('WebSocket连接已打开');

    const wss = new WebSocket.Server({ server });  // 创建WebSocket服务器
    const clients = new Map();  // 存储用户和对应的WebSocket连接

    wss.on('connection', (ws) => {  // 当有新的WebSocket连接建立时触发
      console.log('客户端已连接');

      // 接收客户端消息
      ws.on('message', (message) => {
        try{
          const data = JSON.parse(message);
          // 处理身份认证
          if(data.type == 'auth' && data.userId) {
            ws.userId = data.userId;
            clients.set(data.userId, ws);
            return
          }

          // 处理一对一消息
          if (data.type === 'message' && data.receiverId) {
            clients.forEach((client) => {
              if(client.userId == data.receiverId || client.userId == data.senderID){
                console.log(data.messageType);
                
                client.send(JSON.stringify({
                  type: 'message',
                  receiverId: data.receiverId,
                  sender: ws.userId,
                  content: data.text,
                  timestamp: Date.now(),
                  messageType: data.messageType,
                }))                
              }
            })
          }

          // 处理心跳消息
          if (data.type === 'ping') {
            ws.send(JSON.stringify({ type: 'pong' }));
            return;
          }
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      });
  
      // 连接关闭时触发
      ws.on('close', () => {
        console.log('连接关闭');
        
        if (ws.userId) {
          clients.delete(ws.userId);
        }
      });

      // 连接错误时触发
      ws.on('error',(error) => {
        console.error('连接错误:', error);
      })
    });
}
module.exports = socket;
