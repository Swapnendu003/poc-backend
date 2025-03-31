const WebSocket = require('ws');
const http = require('http');

let wss;
const initWebSocket = (server) => {
  wss = new WebSocket.Server({ server });
  
  wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.send(JSON.stringify({
      type: 'connection',
      message: 'Connected to Keploy Dashboard WebSocket Server'
    }));
    
    // Set up heartbeat interval
    const heartbeatInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'heartbeat',
          timestamp: new Date().toISOString()
        }));
        console.log('Heartbeat sent');
      }
    }, 30000); 
    
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message);
        console.log('Received message:', data);
        

        if (data.type === 'subscribe') {
          // Subscribe to specific events
          ws.subscriptions = ws.subscriptions || [];
          ws.subscriptions.push(data.channel);
          ws.send(JSON.stringify({
            type: 'subscribed',
            channel: data.channel
          }));
        }
      } catch (error) {
        console.error('Error processing message:', error);
      }
    });
    
    // Add error handler
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      clearInterval(heartbeatInterval);
    });
    
    ws.on('close', () => {
      console.log('Client disconnected');
      clearInterval(heartbeatInterval); // Clear heartbeat on disconnect
    });
  });
  
  return wss;
};

const broadcast = (data) => {
  if (!wss) {
    console.error('WebSocket server not initialized');
    return;
  }
  
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      // If client has subscriptions, only send to those subscribed to the channel
      if (data.channel && client.subscriptions && !client.subscriptions.includes(data.channel)) {
        return;
      }
      
      client.send(JSON.stringify(data));
    }
  });
};

const broadcastTestResult = (testResult) => {
  broadcast({
    type: 'testResult',
    channel: 'tests',
    data: testResult
  });
};
const broadcastMetricsUpdate = (metrics) => {
  broadcast({
    type: 'metrics',
    channel: 'metrics',
    data: metrics
  });
};

module.exports = {
  initWebSocket,
  broadcast,
  broadcastTestResult,
  broadcastMetricsUpdate
};
