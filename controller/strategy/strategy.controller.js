const Strategy = require('./../../models/strategy/strategy.nodel');
const Binance = require('binance-api-node').default;
const { findById } = require('./../../controller/user/user.controller');
async function postCreate(userId, strategyData) {
  return await Strategy.create({
    userId,
    strategyData,
  })
    .then((strategy) => {
      console.log('new strategy has been created');
      return strategy;
    })
    .catch((e) => {
      throw new Error(e.message);
    });
}

async function postCreateStrategy(req, res, next) {
  const strategyData = Object.assign(req.body, {
    purchasedAssets: 0,
    availableAmmount: req.body.ammount,
  });
  // const strategy = await postCreate(req.userId, JSON.stringify(strategyData));
  // const { purchasedAssets } = JSON.parse(strategy.strategyData);
  const { binanceAPIKey, binanceSecretKey } = await findById(req.userId);
  const binanceClient = initClient(binanceAPIKey, binanceSecretKey);
  console.log('retrive user from database');
  console.log(await binanceClient.accountInfo());

  /* 
  const client = Binance({
    apiKey: API_KEY,
    apiSecret: SECRET_KEY,
  });
*/
  //console.log(strategyData);
  // return res.status(200).json(strategy);
  return res.status(200).json(11);
}

function initClient(apiKey, apiSecret) {
  return Binance({
    apiKey,
    apiSecret,
  });
}
module.exports = {
  postCreateStrategy,
};
