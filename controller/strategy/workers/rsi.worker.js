
const {
  Worker, isMainThread, parentPort, workerData,
} = require('node:worker_threads');
const { findStrategyById ,updateStrategy} = require('./../strategy.controller')
const { rsi, getDetachSourceFromOHLCV } = require('trading-indicator')
const myEmitter = require('./../../../utils/strategy.update.emitter');

const { convertToMS , initClient  , isAcceptedTransaction } = require('./../../trader/trader.controller');

if (isMainThread) {
  function runRsiIndecator (script) {
    console.log(">>>>>>> its main thread",script)

    return new Promise((resolve, reject) => {
      const worker = new Worker(__filename, {
        workerData:script,
      });

myEmitter.on('update', (record) => {
  console.log('8888888888888888888888888888888888888888888888888888888' , record);
  worker.postMessage(record);

});


      worker.on('message', (msg) => {
       console.log('hi i am main thread')
        resolve(msg)
      });
      worker.on('error', reject);
      worker.on('exit', (code) => {
        if (code !== 0)
          reject(new Error(`Worker stopped with exit code ${code}`));
      });
    });
  };
  module.exports = runRsiIndecator
} else {
  async function run () {


    const {
      keys,
      strategyId,
    } = workerData;

    console.log(">>>>>>> its worker thread")
    
    let binanceClient = initClient(keys.binanceAPIKey , keys.binanceSecretKey)
    let strategy = await findStrategyById(strategyId)
    console.log('strategy',strategy)
    let userId = strategy.dataValues.userId
    let strategyData = JSON.parse(strategy.strategyData)
    let numberOfTrades = strategyData.numberOfTrades;


    console.log('strategyData.monetor',strategyData.monetor)
      
      async function startRsi (strategyData , strategyId , updateStrategy) {

        try {
          let pairs = strategyData.pairs
          for(let pair of pairs) {
            console.log('current pair ',pair)
            const { input } = await getDetachSourceFromOHLCV('binance', pair ,strategyData.timeFrame , false) // true if you want to get future market
            var atrData = await rsi(strategyData.period, strategyData.inputSource, input)
            let rsiValue =  Number.parseInt(atrData[atrData.length - 1]);
            let payingIndicators = strategyData.payingIndicators
           for(let signal of payingIndicators) {
            const isAccepted = await isAcceptedTransaction (binanceClient , 
              strategyData.ammount , pair )

              if (true) {
          //  if (rsiValue == signal && isAccepted) {
                  console.log('current number of tries ',numberOfTrades)
                  console.log('numberOfTrades',numberOfTrades)

               if (numberOfTrades > 0 &&  numberOfTrades <= numberOfTrades) {
                  console.log('match')
                  numberOfTrades -= 1
                  // pair
                  let pairPrice = await getCurrentPrice(binanceClient,pair)
                  let winningPrice = computeWinningMarginPercent(Object.values(pairPrice)[0]  , strategyData.winningMarginPercent)
                  winningPrice = financial(winningPrice)
                  let losingPrice = computelosingMarginPercent(Object.values(pairPrice)[0]  , strategyData.losingMarginPercent)
                  losingPrice = financial(losingPrice)
                  let monetor = strategyData.monetor
                  // buy
                  monetor.push({
                    pair:Object.keys(pairPrice)[0] ,
                    pairPrice:Object.values(pairPrice)[0] ,
                    winningPrice,
                    losingPrice
                  })
                  let newStrategyData = Object.assign(strategyData, {
                    monetor
                  });
                  console.log('newStrategyData' , newStrategyData)
                  const strategy = await updateStrategy(strategyId ,  JSON.stringify(newStrategyData))
               console.log(' strategy after update and add winning and losing ',strategy)
                }
                if (numberOfTrades <= 0 ) {
                  parentPort.postMessage({message:"operation done" })
                  clearInterval(interval);
                }
              }
            }

            for(let obj of strategyData.monetor) {
              let p = await binanceClient.prices({ symbol: obj.pair })
              let currentPrice = Object.values(p)[0]
              console.log('currentPrice',currentPrice,'pair',obj.pair)
              if (currentPrice == obj.winningPrice) {
                console.log('winning ...........')
                // sell
              }
              if (currentPrice == obj.losingPrice) {
                console.log('losing ...........')
                // sell

              }
            }
      
          }
        } catch (error) {
           parentPort.postMessage(error)
        }
      
      
      }

      let interval = setInterval( startRsi ,5000 ,strategyData , strategyId , updateStrategy)
      console.log('first tries',numberOfTrades)

      parentPort.on('message', async (data) => {
        strategy = await findStrategyById(strategyId)
        strategyData = JSON.parse(strategy.strategyData)
        console.log('haaaaaaay update happend in database')
        console.log('strategy',strategy)
        console.log('strategyData',strategyData)
        clearInterval(interval);
        console.log('interval',interval)
        interval = setInterval( startRsi ,5000 ,strategyData , strategyId)
        console.log('Received data from main thread:', data);
        parentPort.postMessage('Hello from the worker thread!');
      });


    }


   // parentPort.postMessage(1);

  run()
} 

async function getCurrentPrice (binanceClient , pair) {
  let symbol = pair.split("/").join("")
  let symblePrice = await binanceClient.prices({ symbol })
  console.log('symble',symbol,'symble Price',symblePrice)
  return symblePrice
}

function computeWinningMarginPercent (price , winningMarginPercent) {
  let finalPercent = price + (price * winningMarginPercent)
  return finalPercent
}
function computelosingMarginPercent (price , losingMarginPercent) {
  let finalPercent = price - (price * losingMarginPercent)
  return finalPercent
}

function financial(x) {
  return Number.parseFloat(x).toFixed(1);
}

