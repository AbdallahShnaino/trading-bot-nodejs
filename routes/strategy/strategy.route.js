const express = require('express');
const strategyRouter = express.Router();
const {
  postCreateStrategy,
} = require('../../controller/strategy/strategy.controller');
const getCurrentUser = require('../../middleware/storeId.middleware');
strategyRouter.get('/test', getCurrentUser, (req, res, next) => {
  console.log(req.userId);
  res.send('heelo');
});
strategyRouter.post('/rsi', getCurrentUser, postCreateStrategy);

module.exports = strategyRouter;
