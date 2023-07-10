const Strategy = require('./../../models/strategy/strategy.nodel');
const { findById } = require('./../../controller/user/user.controller');
const { isAvailableAmmount , initClient} = require('./../trader/trader.controller')
const runRsiIndecator = require('./workers/rsi.worker')

async function postCreate(userId, strategyData) {
  return await Strategy.create({
    userId,
    strategyData,
  })
    .then((strategy) => {
      console.log('new strategy has been created',strategy.dataValues.id);
      return strategy;
    })
    .catch((e) => {
      throw new Error(e.message);
    });
}

async function findStrategyById(id) {
  try {
    const strategy = await Strategy.findByPk(id);
    if (strategy) {
      return strategy
    }
    const error = new Error("There is no strategy id match the supplied id");
    throw error
  } catch (error) {
    throw error;
  }
}

async function findStrategyByUserId(userId) {
  try {
    const strategy = await Strategy.findAll({ where: { userId: userId } });
    if (strategy) {
      return strategy
    }
    const error = new Error("There is no strategies associated with this user");
    throw error
  } catch (error) {
    throw error;
  }
}


async function updateStrategy (strategyId , strategyData) {
  const strategy = await findStrategyById(strategyId);
  if (!strategy) {
    throw new Error('strategy not found');
  }
  if (strategyData != undefined) strategy.strategyData = strategyData;
  return await strategy.save();
}

async function destroy(id) {
  try {
    const strategy = await Strategy.findByPk(id);
    strategy.destroy();
  } catch (error) {
    throw error;
  }
}


async function postCreateStrategy(req, res, next) {
 // const { pairs ,winningMarginPercent , losingMarginPercent} = req.body
 // const monetor = generateMonetorObject(pairs , winningMarginPercent , losingMarginPercent )
  const strategyData = Object.assign(req.body, {
    monetor: [],
  });
  


   const strategy = await postCreate(req.userId, JSON.stringify(strategyData));
   // const { purchasedAssets } = JSON.parse(strategy.strategyData);
  console.log('retrive user from database');
  const { binanceAPIKey, binanceSecretKey } = await findById(req.userId);

  console.log('init binance client');
  let binanceClient = initClient(binanceAPIKey, binanceSecretKey);
  const clientPing = await binanceClient.ping()
  if (!clientPing) {
    return res.status(400).json({"message": "connection refused with this client" });
  }
  console.log('clientPing',clientPing)

  const { 
    ammount , 
    pairs , 
    numberOfTrades,
  } = JSON.parse(strategy.strategyData);
  try {
    await isAvailableAmmount(binanceClient, ammount , pairs , numberOfTrades)
  } catch (error) {
    return res.status(400).json({"message": error.message});
  }
  const  strategyId = strategy.dataValues.id;

  runRsiIndecator({
    keys: {binanceAPIKey, binanceSecretKey},
    strategyId,
   }).then(e => {
    console.log('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',e)
   }).catch(e => {
    console.log(' 888888888888 ',e.message)

   })




  return res.status(200).json({"strategy":strategy});
}


async function postUpdateStrategy (req , res , next) {
  const { strategyData } = req.body
  const strategyId = req.params.id
  try {
    const strategy = await updateStrategy(strategyId ,  JSON.stringify(strategyData))
    return res.status(200).json({"strategy":strategy});
  } catch (error) {
    return res.status(400).json({"error":error.message});
  }
}

async function deleteStrategy (req , res , next) {
  try {
    await destroy(req.params.id)
    return res.status(200).json({"message":"strategy has been deleted"});  
  } catch (error) {
    return res.status(400).json({"error":error.message});
  }
}

async function getStrategyById (req , res , next) {
  const id = req.params.id;
  try {
    const strategy = await findStrategyById(req.params.id)
    return res.status(200).json({"strategy":strategy});  
  } catch (error) {
    return res.status(400).json({"error":error.message});
  }

}

async function getUserStrategies (req , res , next) {
  try {
    const userId = req.session.user.userId;
    const strategies = await findStrategyByUserId(userId)
    return res.status(200).json({"strategies":strategies});  
  } catch (error) {
    return res.status(400).json({"error":error.message});
  }
}

async function getUserFreeAssets (req , res , next) {
  try {
    const userId = req.session.user.userId;
    const { binanceAPIKey, binanceSecretKey } = await findById(userId);
    let binanceClient = initClient(binanceAPIKey, binanceSecretKey);
    let accountInfo = await binanceClient.accountInfo()
    let balances = accountInfo.balances.filter(asset => asset.free > 0);
    const balancesList = balances.map((obj) =>{
      return {
        asset:obj.asset,
        balance:obj.free,
      }
    });
    return res.status(200).json({"balances":balancesList});  
  } catch (error) {
    return res.status(400).json({"error":error.message});
  }
}


async function getAssetPrice (req , res , next) {
  try {
    const userId = req.session.user.userId;
    const symbol = req.params.symbol
    const { binanceAPIKey, binanceSecretKey } = await findById(userId);
    let binanceClient = initClient(binanceAPIKey, binanceSecretKey);
    let symblePrice = await binanceClient.prices({ symbol })
    return res.status(200).json({"symbol":symbol , "price":symblePrice });  
  } catch (error) {
    return res.status(400).json({"error":error.message});
  }
}




module.exports = {
  postCreateStrategy,
  postUpdateStrategy,
  updateStrategy,
  deleteStrategy,
  getStrategyById,
  findStrategyById,
  getUserStrategies,
  getUserFreeAssets,
  getAssetPrice,
};
