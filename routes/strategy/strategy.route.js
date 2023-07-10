const express = require('express');
const strategyRouter = express.Router();
const {
  postCreateStrategy,
  postUpdateStrategy,
  deleteStrategy,
  getStrategyById,
  getUserStrategies
} = require('../../controller/strategy/strategy.controller');
const getCurrentUser = require('../../middleware/storeId.middleware');
strategyRouter.get('/test', getCurrentUser, (req, res, next) => {
  console.log(req.userId);
  res.send('heelo');
});

const Binance = require('binance-api-node').default;

strategyRouter.get('/list', /*getCurrentUser ,*/ getUserStrategies);

strategyRouter.get('/rsi/:id', /*getCurrentUser ,*/ getStrategyById);

strategyRouter.post('/rsi', getCurrentUser, postCreateStrategy);

strategyRouter.post('/rsi/update/:id', /* getCurrentUser ,*/  postUpdateStrategy);

strategyRouter.delete('/rsi/delete/:id', /* getCurrentUser ,*/  deleteStrategy);

strategyRouter.get('/test/me', async (req,res) => {
  console.log('------------------')
  const binanceClient =  Binance({
    apiKey:'SgFQjxyqVp5aN7QtxDHj84mANsEsbLnGSWfeKHHar4HZrWHwgvHw9HPlz64ExUR7',
    apiSecret:'gToljXHbKORO0bZWSYZEo6SGg7HjXYQosyhSdFO1LUfH625nqAvy0GmN6oc4wrlv',
  });

  let pair = 'BTC/USDT'
  let symbol = pair.split("/").join("")
  let symblePrice = await binanceClient.prices({ symbol })
  console.log('symble',symbol,'symblePrice',symblePrice)
  res.send({})
});




module.exports = strategyRouter;
