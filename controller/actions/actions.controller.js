async function makeBuyOrder(client, symbol, buyQuantity, currentPrice) {
  console.log('MAKING BUY ORDER');
  await client.order({
    symbol: 'BTCUSDT',
    side: 'BUY',
    type: 'MARKET',
    quantity: '0.01',
  });
}

module.exports = {
  makeBuyOrder,
};
