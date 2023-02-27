const express = require('express');
const { MainClient } = require('binance');

require('dotenv').config();
const app = express();
const port = 3001;
const API_KEY = process.env.API_KEY;
const SECRET_KEY = process.env.SECRET_KEY;

const client = new MainClient({
  api_key: API_KEY,
  api_secret: SECRET_KEY,
});

app.get('/list', async (req, res) => {
  client.getSymbolPriceTicker().then((value) => res.send(value));
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
