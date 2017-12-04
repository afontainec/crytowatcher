const path = require('path');
const Transaction = require('../models/transaction');

exports.new = function (req, res) {
  const newTransactionPath = path.join(__dirname, '../', '../', 'views', 'transaction', 'new.ejs');
  res.render(newTransactionPath);
};

exports.create = function (req, res) {
  const transaction = req.body;
  transaction.account_id = req.params.id || 1;
  transaction.price = calculatePrice(transaction);
  transaction.amount_left = transaction.amount_to;
  Transaction.save(transaction).then(() => {
    Transaction.updateAmountLeft(transaction);
    res.redirect('/');
  }).catch(() => {
    res.redirect('/error');
  });
};


exports.fromAccount = function (req, res) {
  const id = req.params.id;
  Transaction.find({ account_id: id }).then((transactions) => {
    res.status(200).send(transactions);
  }).catch((error) => {
    res.status(500).send({ error });
  });
};


const calculatePrice = (t) => {
  return t.amount_from / t.amount_to;
};
