const express = require('express');
const { MainClient } = require('binance');
require('./controller/trader/trader.controller');
const { getCurrentPrice } = require('./controller/market/market.ocntroller');
require('dotenv').config();
const app = express();
const http = require('http').createServer(app);

const port = 3000;
const API_KEY = process.env.API_KEY;
const SECRET_KEY = process.env.SECRET_KEY;

const client = new MainClient({
  api_key: API_KEY,
  api_secret: SECRET_KEY,
});

app.get('/list', async (req, res) => {
  client.getSymbolPriceTicker().then((value) => res.send(value));
});

/* 
we need from binance
palance
bay and sell 

BTCUSDT
ETHUSDT
ema pointer

const Binance = require('binance-api-node').default;

const client = Binance({
  apiKey: API_KEY,
  apiSecret: SECRET_KEY,
});
app.listen(port, async () => {
  // const data = await getExistingCurrencies();
  // const data = await getCurrentPrice('BTCUSDT');
  // console.log(' BTCUSDT BTCUSDT BTCUSDT', data);
});
*/

// Start the server

http.listen(port, () => {
  console.log('listening on *:' + port);
});
