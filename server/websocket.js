// server/websocket.js
const WebSocket = require('ws');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

const notifyClients = async () => {
  const todos = await prisma.todo.findMany({
    select: {
      title: true,
      id: true,
      isCompleted: true,
      price: true,
      createdAt: true
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSockeClient.OPEN) {
      client.send(JSON.stringify(todos));
    }
  });
};

module.exports = { notifyClients };
