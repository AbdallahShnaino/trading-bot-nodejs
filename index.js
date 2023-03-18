const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;
const Binance = require('binance-api-node').default;
require('dotenv').config();
const cors = require('cors');
const { connection } = require('./db');
const { userRouter } = require('./routes/user.routes');
app.use(cors())
app.use(express.json())
app.use("/user", userRouter)

//require('./controller/trader/trader.controller');
//const { getCurrentPrice } = require('./controller/market/market.ocntroller');
// const { makeBuyOrder } = require('./controller/actions/actions.controller');
const API_KEY = process.env.API_KEY;
const SECRET_KEY = process.env.SECRET_KEY;
const client = Binance({
  apiKey: API_KEY,
  apiSecret: SECRET_KEY,
});

const WebSocket = require('ws');

const btcSocket = new WebSocket(
  'wss://stream.binance.com:9443/ws/btcusdt@ticker'
);
const ethSocket = new WebSocket(
  'wss://stream.binance.com:9443/ws/ethusdt@ticker'
);

io.on('connection', (socket) => {
  btcSocket.on('message', (data) => {
    const price = JSON.parse(data)['c'];
    socket.emit('btcusdt', price);
  });

  ethSocket.on('message', (data) => {
    const price = JSON.parse(data)['c'];
    socket.emit('ethusdt', price);
  });
});

app.post('/makeOrder', async (req, res) => {
  try {
    await makeOrder();
  } catch (e) {
    res.status(403).send({
      error: {
        message: e.message,
      },
    });
  }
});
async function makeOrder() {
  await client.order({
    symbol: 'USDT',
    side: 'BUY',
    quantity: '2',
    price: '0.0002',
    stopPrice: '0.00019',
    stopLimitPrice: '0.00018',
  });
}


app.get("/", (req, res) => {
  res.send({
      message:"api is working now"
  })
})

server.listen(port, async () => {
  makeOrder();
  // const data = await getExistingCurrencies();
  // const data = await getCurrentPrice('BTCUSDT');
  // console.log(' BTCUSDT BTCUSDT BTCUSDT', data);

  /*
  
    symbol: 'USDT',
  side: 'BUY',
  quantity: '100',
  price: '0.0002',
  stopPrice: '0.00019',
  stopLimitPrice: '0.00018'

  */

  // await makeBuyOrder(client);
  try {
    await connection
    console.log("database is connected")
} catch (error) {
    console.log(error)
    
}
  console.log(`Listening on port ${port}`);
});
