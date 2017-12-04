const Table = require('./table'); // eslint-disabled-this-line no-unused-vars
const knex = require('../../db/knex');

class Transaction extends Table {

  constructor() {
    const table_name = 'transaction';
    super(table_name);
  }

  totalAmount(account_id, currency) {
    const table_name = this.table_name;
    return new Promise((resolve, reject) => {
      const query = knex(table_name).sum('amount_left').where({
        to_currency: currency,
        account_id,
      });
      query.then((result) => {
        if (result[0].sum == null) {
          result[0].sum = 0;
        }
        resolve(result[0].sum);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  active(currency) {
    return this.table().select('*').where('to_currency', currency).orderBy('id', 'asc');
  }

  updateAmountLeft(transaction) {
    const f = async(currency, amount) => {
      if (currency === 'cargo') {
        return;
      }
      const transactions = await this.active(currency);
      for (let i = 0; i < transactions.length; i++) {
        if (amount === 0) {
          return;
        }
        const t = transactions[i];
        if (t.amount_left > 0) {
          const disminish = Math.min(amount, t.amount_left);
          t.amount_left -= disminish;
          amount -= disminish;
          this.update(t.id, t);
        }
      }
      return;
    };
    return f(transaction.from_currency, transaction.amount_from);
  }

  getTotalValueQuery(account_id, currency, column, key) {
    const table_name = this.table_name;
    const whereParams = {};
    whereParams.account_id = account_id;
    whereParams[key] = currency;
    const query = knex(table_name).sum(knex.raw(`${column} * price`)).where(whereParams);
    return query;
  }

  getTotalValue(account_id, currency, column, key) {
    const that = this;
    return new Promise((resolve, reject) => {
      const query = that.getTotalValueQuery(account_id, currency, column, key);
      query.then((result) => {
        if (result[0].sum == null) {
          result[0].sum = 0;
        }
        resolve(result[0].sum);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  inventaryCost(account_id, currency) {
    return this.getTotalValue(account_id, currency, 'amount_left', 'to_currency');
  }

  moneyIn(account_id) {
    const f = async (account_id) => {
      const amountIn = await this.getTotalValue(account_id, 'cargo', 'amount_to', 'from_currency');
      const amountOut = await this.getTotalValue(account_id, 'retiro', 'amount_from', 'to_currency');
      return amountIn - amountOut;
    };
    return f(account_id);
  }
}


const instance = new Transaction();

module.exports = instance;
