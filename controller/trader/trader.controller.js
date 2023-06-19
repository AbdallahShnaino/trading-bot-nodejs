const { MainClient } = require('binance');
require('dotenv').config();

async function getClientReference(userId) {
  const { api_key, api_secret } = await getUserKeys(userId);
  return new MainClient({
    api_key: api_key,
    api_secret: api_secret,
  });
}

async function getExistingCurrencies(userId) {
  const client = await getClientReference(userId);
  const { balances } = await client.getAccountInformation();
  const currencies = [];
  balances.forEach((element) => {
    if (element.free >= 0.01) {
      currencies.push(element);
    }
  });
  return { currencies: currencies };
}

async function getUserKeys(userId) {
  // go to DB
  // should be deleted after database createion
  const API_KEY = process.env.API_KEY;
  const SECRET_KEY = process.env.SECRET_KEY;

  return {
    api_key: API_KEY,
    api_secret: SECRET_KEY,
  };
}

module.exports = {
  getExistingCurrencies,
  getClientReference,
};
