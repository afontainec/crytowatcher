const Table = require('./table'); // eslint-disabled-this-line no-unused-vars
const Requestify = require('requestify');

class Price extends Table {

  constructor() {
    const table_name = 'prices';
    super(table_name);
  }


  get() {
    const f = async (ctx) => {
      const btc = await Requestify.get(ctx.getPath('btc'));
      const eth = await Requestify.get(ctx.getPath('eth'));
      const entry = await ctx.makeEntry(btc, eth);
      const prices = await ctx.save(entry);
      return prices;
    };
    return f(this);
  }

  makeEntry(btc, eth) {
    btc = JSON.parse(btc.body);
    eth = JSON.parse(eth.body);
    return {
      platform: 'surbtc',
      ether_buy: eth.ticker.max_bid[0],
      ether_sell: eth.ticker.min_ask[0],
      btc_buy: btc.ticker.max_bid[0],
      btc_sell: btc.ticker.min_ask[0],
    };
  }

  getPath(currency) {
    return `https://www.surbtc.com/api/v2/markets/${currency}-clp/ticker.json`;
  }

}

const instance = new Price();

module.exports = instance;
