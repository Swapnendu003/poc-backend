const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const http = require('http');
const { initWebSocket } = require('./websocket');
const { swaggerUi, swaggerDocs } = require('./swagger');
const repositoryRoutes = require('./routes/repository.routes');
const metricsRoutes = require('./routes/metrics.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
const wss = initWebSocket(server);

connectDB();

app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/api/repositories', repositoryRoutes);
app.use('/api/metrics', metricsRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to the Keploy Dashboard API',
    documentation: '/api-docs'
  });
});

const { broadcastMetricsUpdate } = require('./websocket');
setInterval(async () => {
  try {
    const randomUpdate = {
      timestamp: new Date(),
      testsPassed: Math.floor(Math.random() * 10) + 90,
      testsFailed: Math.floor(Math.random() * 5),
      passRate: (90 + Math.random() * 10).toFixed(2)
    };
    broadcastMetricsUpdate(randomUpdate);
  } catch (error) {
    console.error('Error broadcasting metrics update:', error);
  }
}, 10000);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket server initialized`);
});

module.exports = { app, server };