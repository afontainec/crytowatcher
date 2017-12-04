const express = require('express');
const AccountController = require('../server/controllers/account');
const PriceController = require('../server/controllers/price');
const TransactionController = require('../server/controllers/transaction');


const router = express.Router(); // eslint-disable-line

/* GET home page. */
router.get('/', (req, res) => {
  req.params.id = 1;
  AccountController.show(req, res);
});


router.get('/price', (req, res) => {
  PriceController.get(req, res);
});

router.get('/price/all', (req, res) => {
  PriceController.all(req, res);
});


router.get('/transaction/new', (req, res) => {
  TransactionController.new(req, res);
});

router.post('/transaction/create', (req, res) => {
  TransactionController.create(req, res);
});

router.get('/transaction/:id', (req, res) => {
  TransactionController.fromAccount(req, res);
});


module.exports = router;
