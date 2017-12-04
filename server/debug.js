const Transaction = require('./models/transaction');
const Price = require('./models/price');


Price.get().then((res) => {
  console.log(res);
}).catch((err) => {
  console.log(err);
});
