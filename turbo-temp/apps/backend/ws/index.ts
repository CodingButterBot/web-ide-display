import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 3002 });

wss.on('connection', (ws) => {
  console.log('Client connected');
  
  ws.on('message', (message) => {
    console.log('Received: %s', message);
    ws.send(`Echo: ${message}`);
  });
  
  ws.send('WebSocket server connected');
});

console.log('WebSocket server listening on port 3002');