const Binance = require('binance-api-node').default;

let clientBucketAmmounts = []


function getCurrencyBySide(pair) {
  const [sellCurrency,buyCurrency] = pair.split("/");
  clientBucketAmmounts.push({currency:sellCurrency , ammount:0})
  clientBucketAmmounts.push({currency:buyCurrency , ammount:0})
  return[sellCurrency,buyCurrency]
}

async function isAvailableAmmount (binanceClient, ammount , pairs , numberOfTrades) {
  let data;
  for(let pair of pairs) {
    const currency = getCurrencyBySide(pair)[1].toString()
    const { balances } = await binanceClient.accountInfo({recvWindow:60000});
    data = balances.filter(element => parseFloat(element.free) > (ammount * numberOfTrades) && currency == element.asset);
  }
  if (data.length <= 0 ) {
    const error = new Error("you need to have enough assets to trade");
    throw error
  }
}

function convertToMS (runAfter) {
  let ms = 0;
  const unit = runAfter.split(/[\W\d]+/).join("");
  const number = parseInt(runAfter.split(/[^\d]+/).join(""));
  if (unit == 'm') {
    ms = number * 60000
  }else if (unit == 'h') {
    ms = number *  3.6e+6
  }else if (unit == 'd') {
    ms = number * 8.64e+7
  }else if (unit == 'w') {
    ms = number * 6.048e+8
  }else if (unit == 'M') {
  ms = number * 2.628e+9
  }
  ms = ms - 30000 // 30s
  return ms
}




async function isAcceptedTransaction (binanceClient , ammount , pair ) {
  const currency = getCurrencyBySide(pair)[1].toString()
   const { balances } = await binanceClient.accountInfo({recvWindow:60000});
   let data = balances.filter(element => parseFloat(element.free) > ammount  && currency == element.asset);
 if (data.length <= 0 ) {
   const error = new Error("you need to have enough assets to trade");
   throw error
}else{
 return true
}
}

function initClient(apiKey, apiSecret) {
  return  Binance({
    apiKey,
    apiSecret,
  });
}

module.exports = {
  isAvailableAmmount,
  convertToMS,
  initClient,
  isAcceptedTransaction,
  convertToMS,
  isAvailableAmmount,
  getCurrencyBySide,

}
