const WebSocket = require('ws');
const io = require('socket.io')(http);

const btcSocket = new WebSocket(
  'wss://stream.binance.com:9443/ws/btcusdt@ticker'
);
const ethSocket = new WebSocket(
  'wss://stream.binance.com:9443/ws/ethusdt@ticker'
);

btcSocket.on('message', (data) => {
  const price = JSON.parse(data)['c'];
  btcSocket.emit('btcusdt', price);
  io.emit('message', msg);
});

ethSocket.on('message', (data) => {
  const price = JSON.parse(data)['c'];
  ethSocket.emit('ethusdt', price);
  io.emit('message', msg);
});
