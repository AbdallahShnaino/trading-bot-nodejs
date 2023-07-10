const express = require('express');
const strategyRouter = express.Router();
const {
  postCreateStrategy,
  postUpdateStrategy,
  deleteStrategy,
  getStrategyById,
  getUserStrategies,
  getUserFreeAssets,
  getAssetPrice
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


strategyRouter.get('/assets', getCurrentUser , getUserFreeAssets);

strategyRouter.get('/price/:symbol', getCurrentUser , getAssetPrice);


strategyRouter.get('/test/me', async (req,res) => {
  console.log('------------------')
  const binanceClient =  Binance({
    apiKey:'SgFQjxyqVp5aN7QtxDHj84mANsEsbLnGSWfeKHHar4HZrWHwgvHw9HPlz64ExUR7',
    apiSecret:'gToljXHbKORO0bZWSYZEo6SGg7HjXYQosyhSdFO1LUfH625nqAvy0GmN6oc4wrlv',
  });

  let accountInfo = await binanceClient.accountInfo()
  let balances = accountInfo.balances.filter(asset => asset.free > 0);
  console.log('balances',balances)
  res.send({'balances':balances})
});




module.exports = strategyRouter;
