const Table = require('./table'); // eslint-disabled-this-line no-unused-vars
const Transaction = require('./transaction');

class Account extends Table {

  constructor() {
    const table_name = 'account';
    super(table_name);
  }


  get(id) {
    const f = async(id) => {
      const account = await this.findById(id);
      account.eth = await Transaction.totalAmount(id, 'eth');
      account.clp = await Transaction.totalAmount(id, 'clp');
      account.btc = await Transaction.totalAmount(id, 'btc');
      account.ethInventary = await Transaction.inventaryCost(id, 'eth');
      account.clpInventary = await Transaction.inventaryCost(id, 'clp');
      account.btcInventary = await Transaction.inventaryCost(id, 'btc');
      account.cargos = await Transaction.totalAmount(id, 'cargo');
      account.retiros = await Transaction.totalAmount(id, 'retiro');
      account.totalMoneyIn = await Transaction.moneyIn(id);
      return account;
    };
    return f(id);
  }
}

const instance = new Account();

module.exports = instance;
